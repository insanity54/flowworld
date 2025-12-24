package main

import (
	"log"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/ghupdate"
	"github.com/pocketbase/pocketbase/plugins/jsvm"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/hook"
	"github.com/pocketbase/pocketbase/tools/osutils"
)

func setupYogaTimer(app core.App) {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for range ticker.C {

		flowCollection, err := app.FindCollectionByNameOrId("flows")
		if err != nil {
			log.Printf("Error finding collection: %v", err)
			continue
		}

		flows, err := app.FindRecordsByFilter(
			"flows", // collection
			"",
			"-created", // sort
			1,          // limit
			0,          // offset
		)
		if err != nil {
			log.Printf("Error finding records: %v", err)
			continue
		}
		if len(flows) == 0 {
			log.Println("No flows found.")
			continue
		}

		currentFlow := flows[0]
		app.ExpandRecord(currentFlow, []string{"pose"}, nil)

		currentPose := currentFlow.ExpandedOne("pose")
		if currentPose == nil {
			log.Println("No current pose found.")
			continue
		}

		app.ExpandRecord(currentPose, []string{"neighbors"}, nil)

		nextPoseCandidates := currentPose.ExpandedAll("neighbors")
		if len(nextPoseCandidates) == 0 {

			log.Panic("No neighbor poses available. Pose " + currentPose.Id + " is missing neighbors.")
			continue
		}

		// Calculate total rarity weight
		var totalWeight, adjustedWeight float64

		for _, neighbor := range nextPoseCandidates {
			rarity := neighbor.GetInt("rarity") // Fetch rarity as integer

			// Ensure rarity is non-zero
			if rarity <= 0 {
				rarity = 1 // Treat non-positive rarities as 1
			}

			adjustedWeight = 1 / float64(rarity) // Inverse weighting
			totalWeight += adjustedWeight
		}

		if totalWeight <= 0 {
			log.Println("No valid neighbors with non-zero rarity.")
			continue
		}

		// Perform weighted selection
		randomWeight := rand.Float64() * totalWeight
		var cumulativeWeight float64
		var selectedPose *core.Record

		for _, neighbor := range nextPoseCandidates {
			rarity := neighbor.GetInt("rarity")

			if rarity <= 0 {
				rarity = 1
			}

			adjustedWeight := 1 / float64(rarity) // Use inverse weighting
			cumulativeWeight += adjustedWeight

			if cumulativeWeight >= randomWeight {
				selectedPose = neighbor
				break
			}
		}

		// No fallback, panic if selection fails unexpectedly
		if selectedPose == nil {
			log.Panic("Pose selection failed unexpectedly. This should not happen.")
		}

		log.Printf("Pose selected: %s", selectedPose.Get("name"))

		record := core.NewRecord(flowCollection)
		record.Set("channel", "global42")
		record.Set("pose", selectedPose.Get("id"))

		if err = app.Save(record); err != nil {
			log.Printf("Failed to save selectedPose: %v", err)
		}
	}
}

func main() {
	app := pocketbase.New()

	// ---------------------------------------------------------------
	// Optional plugin flags:
	// ---------------------------------------------------------------

	var hooksDir string
	app.RootCmd.PersistentFlags().StringVar(
		&hooksDir,
		"hooksDir",
		"",
		"the directory with the JS app hooks",
	)

	var hooksWatch bool
	app.RootCmd.PersistentFlags().BoolVar(
		&hooksWatch,
		"hooksWatch",
		true,
		"auto restart the app on pb_hooks file change; it has no effect on Windows",
	)

	var hooksPool int
	app.RootCmd.PersistentFlags().IntVar(
		&hooksPool,
		"hooksPool",
		15,
		"the total prewarm goja.Runtime instances for the JS app hooks execution",
	)

	var migrationsDir string
	app.RootCmd.PersistentFlags().StringVar(
		&migrationsDir,
		"migrationsDir",
		"",
		"the directory with the user defined migrations",
	)

	var automigrate bool
	app.RootCmd.PersistentFlags().BoolVar(
		&automigrate,
		"automigrate",
		true,
		"enable/disable auto migrations",
	)

	var publicDir string
	app.RootCmd.PersistentFlags().StringVar(
		&publicDir,
		"publicDir",
		defaultPublicDir(),
		"the directory to serve static files",
	)

	var indexFallback bool
	app.RootCmd.PersistentFlags().BoolVar(
		&indexFallback,
		"indexFallback",
		true,
		"fallback the request to index.html on missing static path, e.g. when pretty urls are used with SPA",
	)

	app.RootCmd.ParseFlags(os.Args[1:])

	// ---------------------------------------------------------------
	// Plugins and hooks:
	// ---------------------------------------------------------------

	// load jsvm (pb_hooks and pb_migrations)
	jsvm.MustRegister(app, jsvm.Config{
		MigrationsDir: migrationsDir,
		HooksDir:      hooksDir,
		HooksWatch:    hooksWatch,
		HooksPoolSize: hooksPool,
	})

	// migrate command (with js templates)
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		TemplateLang: migratecmd.TemplateLangJS,
		Automigrate:  automigrate,
		Dir:          migrationsDir,
	})

	// GitHub selfupdate
	ghupdate.MustRegister(app, app.RootCmd, ghupdate.Config{})

	// static route to serves files from the provided public dir
	// (if publicDir exists and the route path is not already defined)
	app.OnServe().Bind(&hook.Handler[*core.ServeEvent]{
		Func: func(e *core.ServeEvent) error {
			if !e.Router.HasRoute(http.MethodGet, "/{path...}") {
				e.Router.GET("/{path...}", apis.Static(os.DirFS(publicDir), indexFallback))
			}

			return e.Next()
		},
		Priority: 999, // execute as latest as possible to allow users to provide their own route
	})

	go setupYogaTimer(app)

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

// the default pb_public dir location is relative to the executable
func defaultPublicDir() string {
	if osutils.IsProbablyGoRun() {
		return "./pb_public"
	}

	return filepath.Join(os.Args[0], "../pb_public")
}
