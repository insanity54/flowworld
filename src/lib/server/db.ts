import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './db/schema';

let rawDb: Database | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (db) return db;

  rawDb = new Database(process.env.DB_PATH || './data/flowworld.db');
  rawDb.exec('PRAGMA journal_mode=WAL');
  rawDb.exec('PRAGMA foreign_keys=ON');

  db = drizzle(rawDb, { schema });

  initSchema();
  migrateSchema();
  seedIfEmpty();

  return db;
}

function initSchema(): void {
  rawDb!.exec(`
    CREATE TABLE IF NOT EXISTS poses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      display_name TEXT NOT NULL,
      rarity INTEGER NOT NULL DEFAULT 1,
      difficulty TEXT NOT NULL DEFAULT 'beginner',
      mirror TEXT
    );

    CREATE TABLE IF NOT EXISTS pose_neighbors (
      pose_id TEXT NOT NULL REFERENCES poses(id) ON DELETE CASCADE,
      neighbor_id TEXT NOT NULL REFERENCES poses(id) ON DELETE CASCADE,
      PRIMARY KEY (pose_id, neighbor_id)
    );

    CREATE TABLE IF NOT EXISTS flows (
      id TEXT PRIMARY KEY,
      pose_id TEXT NOT NULL REFERENCES poses(id),
      channel TEXT NOT NULL DEFAULT 'global42',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_flows_created ON flows(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_flows_channel ON flows(channel);
    CREATE INDEX IF NOT EXISTS idx_pose_neighbors_pose ON pose_neighbors(pose_id);
  `);
}

function columnExists(table: string, column: string): boolean {
  const cols = rawDb!.query(`PRAGMA table_info(${table})`).all() as { name: string }[];
  return cols.some(c => c.name === column);
}

function migrateSchema(): void {
  if (!columnExists('poses', 'difficulty')) {
    rawDb!.exec('ALTER TABLE poses ADD COLUMN difficulty TEXT NOT NULL DEFAULT \'beginner\'');
  }
  if (!columnExists('poses', 'mirror')) {
    rawDb!.exec('ALTER TABLE poses ADD COLUMN mirror TEXT');
  }
}

export function closeDb(): void {
  if (rawDb) {
    rawDb.close();
    rawDb = null;
    db = null;
  }
}

type SeedPose = { name: string; display_name: string; rarity: number; difficulty: string; mirror: string; neighbors: string[] };

function seedIfEmpty(): void {
  const count = rawDb!.query('SELECT COUNT(*) as c FROM poses').get() as { c: number };
  if (count.c > 0) return;

  const seedPoses: SeedPose[] = [
    { name: "mountain", display_name: "Mountain", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["bridge", "runnersLungeL", "runnersLungeR", "sphinx", "headToKneeL", "headToKneeR", "kneesToChest", "staff", "happyBaby", "corpse", "pigeonR", "pigeonL", "lizardL", "lizardR", "cobra", "upDog", "seated", "seatedForwardFold", "warriorOneR", "warriorOneL", "threeLeggedDogR", "threeLeggedDogL", "downDog", "catCow", "wildThingL", "wildThingR", "supportedSidePlankL", "supportedSidePlankR", "sidePlankR", "sidePlankL", "plank", "ragdoll", "standingForwardFold"] },
    { name: "standingForwardFold", display_name: "Standing Forward Fold", rarity: 2, difficulty: "beginner", mirror: "", neighbors: ["plank", "halfwayLift", "sidePlankR", "sidePlankL"] },
    { name: "ragdoll", display_name: "Ragdoll", rarity: 3, difficulty: "beginner", mirror: "", neighbors: ["halfwayLift", "mountain", "plank", "catCow"] },
    { name: "plank", display_name: "Plank", rarity: 2, difficulty: "intermediate", mirror: "", neighbors: ["sidePlankL", "sidePlankR", "mountain", "upDog", "cobra", "sphinx", "downDog", "warriorOneL", "runnersLungeL", "runnersLungeR"] },
    { name: "sidePlankL", display_name: "Side Plank Left", rarity: 2, difficulty: "intermediate", mirror: "sidePlankR", neighbors: ["plank"] },
    { name: "sidePlankR", display_name: "Side Plank Right", rarity: 2, difficulty: "intermediate", mirror: "sidePlankL", neighbors: ["sidePlankL", "plank"] },
    { name: "supportedSidePlankR", display_name: "Supported Side Plank Right", rarity: 1, difficulty: "beginner", mirror: "supportedSidePlankL", neighbors: ["plank"] },
    { name: "supportedSidePlankL", display_name: "Supported Side Plank Left", rarity: 1, difficulty: "beginner", mirror: "supportedSidePlankR", neighbors: ["supportedSidePlankR"] },
    { name: "wildThingR", display_name: "Wild Thing Right", rarity: 4, difficulty: "intermediate", mirror: "wildThingL", neighbors: ["plank", "ragdoll"] },
    { name: "wildThingL", display_name: "Wild Thing Left", rarity: 4, difficulty: "intermediate", mirror: "wildThingR", neighbors: ["wildThingR", "plank", "ragdoll"] },
    { name: "halfwayLift", display_name: "Halfway Lift", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["plank", "ragdoll", "mountain", "standingForwardFold"] },
    { name: "catCow", display_name: "Cat Cow", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["ragdoll", "mountain", "standingForwardFold"] },
    { name: "downDog", display_name: "Down Dog", rarity: 1, difficulty: "intermediate", mirror: "", neighbors: ["plank", "mountain", "standingForwardFold"] },
    { name: "threeLeggedDogL", display_name: "Three Legged Dog Left", rarity: 2, difficulty: "intermediate", mirror: "threeLeggedDogR", neighbors: ["downDog", "mountain"] },
    { name: "threeLeggedDogR", display_name: "Three Legged Dog Right", rarity: 2, difficulty: "intermediate", mirror: "threeLeggedDogL", neighbors: ["downDog", "threeLeggedDogL"] },
    { name: "warriorOneL", display_name: "Warrior One Left", rarity: 1, difficulty: "beginner", mirror: "warriorOneR", neighbors: ["mountain"] },
    { name: "warriorOneR", display_name: "Warrior One Right", rarity: 1, difficulty: "beginner", mirror: "warriorOneL", neighbors: ["warriorOneL", "mountain"] },
    { name: "seatedForwardFold", display_name: "Seated Forward Fold", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["mountain"] },
    { name: "seated", display_name: "Seated", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["seatedForwardFold", "mountain"] },
    { name: "upDog", display_name: "Up Dog", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["downDog", "plank", "mountain", "standingForwardFold"] },
    { name: "cobra", display_name: "Cobra", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["upDog", "downDog", "plank"] },
    { name: "lizardR", display_name: "Lizard Right", rarity: 4, difficulty: "intermediate", mirror: "lizardL", neighbors: ["seated", "ragdoll", "plank"] },
    { name: "lizardL", display_name: "Lizard Left", rarity: 4, difficulty: "intermediate", mirror: "lizardR", neighbors: ["lizardR", "downDog", "plank"] },
    { name: "pigeonL", display_name: "Pigeon Left", rarity: 2, difficulty: "beginner", mirror: "pigeonR", neighbors: ["lizardL", "seated", "mountain"] },
    { name: "pigeonR", display_name: "Pigeon Right", rarity: 2, difficulty: "beginner", mirror: "pigeonL", neighbors: ["lizardR", "seated", "mountain"] },
    { name: "corpse", display_name: "Corpse", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["seated", "catCow", "mountain"] },
    { name: "happyBaby", display_name: "Happy Baby", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["corpse", "seated", "catCow", "plank"] },
    { name: "staff", display_name: "Staff", rarity: 2, difficulty: "beginner", mirror: "", neighbors: ["corpse", "happyBaby", "cobra", "seated", "halfwayLift", "plank", "mountain", "standingForwardFold", "ragdoll"] },
    { name: "kneesToChest", display_name: "Knees To Chest", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["corpse", "seated", "mountain"] },
    { name: "runnersLungeR", display_name: "Runner's Lunge Right", rarity: 1, difficulty: "beginner", mirror: "runnersLungeL", neighbors: ["staff", "kneesToChest", "pigeonR", "cobra", "upDog", "downDog"] },
    { name: "runnersLungeL", display_name: "Runner's Lunge Left", rarity: 1, difficulty: "beginner", mirror: "runnersLungeR", neighbors: ["runnersLungeR", "staff", "kneesToChest", "pigeonL", "cobra", "upDog", "downDog"] },
    { name: "bridge", display_name: "Bridge", rarity: 2, difficulty: "intermediate", mirror: "", neighbors: ["plank", "mountain"] },
    { name: "sphinx", display_name: "Sphinx", rarity: 1, difficulty: "beginner", mirror: "", neighbors: ["downDog", "plank", "mountain"] },
    { name: "headToKneeL", display_name: "Head To Knee Left", rarity: 1, difficulty: "beginner", mirror: "headToKneeR", neighbors: ["staff", "seatedForwardFold", "wildThingL", "supportedSidePlankL", "sidePlankL"] },
    { name: "headToKneeR", display_name: "Head to Knee Right", rarity: 1, difficulty: "beginner", mirror: "headToKneeL", neighbors: ["wildThingR", "supportedSidePlankR", "sidePlankR", "staff", "seatedForwardFold"] },
    { name: "treeL", display_name: "Tree Left", rarity: 2, difficulty: "beginner", mirror: "treeR", neighbors: ["mountain"] },
    { name: "treeR", display_name: "Tree Right", rarity: 2, difficulty: "beginner", mirror: "treeL", neighbors: ["mountain"] },
  ];

  const insertPose = rawDb!.prepare(
    'INSERT INTO poses (id, name, display_name, rarity, difficulty, mirror) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const insertNeighbor = rawDb!.prepare(
    'INSERT OR IGNORE INTO pose_neighbors (pose_id, neighbor_id) VALUES (?, ?)'
  );

  rawDb!.transaction(() => {
    for (const pose of seedPoses) {
      insertPose.run(pose.name, pose.name, pose.display_name, pose.rarity, pose.difficulty, pose.mirror || null);
    }
    for (const pose of seedPoses) {
      for (const neighborName of pose.neighbors) {
        insertNeighbor.run(pose.name, neighborName);
      }
    }
  })();
}
