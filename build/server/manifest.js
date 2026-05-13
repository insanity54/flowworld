const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["Free_Pack_-_Male_Base_Mesh.blend","Man.blend","Man.blend1","Man.glb","TEMPHUiBIS - Dreamy Yoga.mp3","Taekwondo_fighter.fbx","ambient.mp3","blender_assets.cats.txt","blender_assets.cats.txt~","chris-2.jpg","chris2.jpg","favicon.ico","howler.js","human.blend","human.blend1","human.fbx","human.glb","human2.glb","humans.txt","main.audio.position.worklet.js","main.audio.worklet.js","main.html","main.js","main.pck","main.png","main.wasm","man_12.gltf","man_14.gltf","poses.mp3","poses.ogg","spruit_sunrise_1k_HDR.hdr","style.glb","texture.png","voice.mp3","voice.ogg","void.mp3"]),
	mimeTypes: {".glb":"model/gltf-binary",".mp3":"audio/mpeg",".txt":"text/plain",".jpg":"image/jpeg",".js":"text/javascript",".html":"text/html",".png":"image/png",".wasm":"application/wasm",".gltf":"model/gltf+json",".ogg":"audio/ogg"},
	_: {
		client: {start:"_app/immutable/entry/start.DV9hMEPG.js",app:"_app/immutable/entry/app.WUB7iMRQ.js",imports:["_app/immutable/entry/start.DV9hMEPG.js","_app/immutable/chunks/Bh_u1XAf.js","_app/immutable/chunks/C2kisQC0.js","_app/immutable/entry/app.WUB7iMRQ.js","_app/immutable/chunks/BjlYZYhD.js","_app/immutable/chunks/C2kisQC0.js","_app/immutable/chunks/PuUWOmIN.js","_app/immutable/chunks/Bp6xhLHJ.js","_app/immutable/chunks/Ci4kQzfr.js","_app/immutable/chunks/CatQ5K7I.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-DJfsLyNS.js')),
			__memo(() => import('./chunks/1-RNIkIKoT.js')),
			__memo(() => import('./chunks/2-BtLV7bit.js')),
			__memo(() => import('./chunks/3-dE7cT4u_.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/color",
				pattern: /^\/api\/color\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-MzIfIVQ-.js'))
			},
			{
				id: "/api/count",
				pattern: /^\/api\/count\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BgUWP6HU.js'))
			},
			{
				id: "/api/heartbeat",
				pattern: /^\/api\/heartbeat\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DZihRrDV.js'))
			},
			{
				id: "/api/ln/invoice",
				pattern: /^\/api\/ln\/invoice\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CMV9j6Ta.js'))
			},
			{
				id: "/api/ln/status",
				pattern: /^\/api\/ln\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-D6anCC2p.js'))
			},
			{
				id: "/api/pose",
				pattern: /^\/api\/pose\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-D7vj--eF.js'))
			},
			{
				id: "/api/realtime",
				pattern: /^\/api\/realtime\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CYbYtaF2.js'))
			},
			{
				id: "/poses",
				pattern: /^\/poses\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
