import { af as ssr_context, h as head, ag as ensure_array_like, ah as attr_style, ai as stringify, ad as derived, c as escape_html, F as FILENAME } from './renderer-Bvyq1msV.js';
import { p as push_element, a as pop_element } from './dev-Bxel_zGI.js';
import { Howl } from 'howler';

function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
YogaPose[FILENAME] = "src/lib/components/YogaPose.svelte";
function YogaPose($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { pose } = $$props;
      if (pose) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="yoga-pose">`);
        push_element($$renderer2, "div", 6, 2);
        $$renderer2.push(`<h1 class="display-3 fw-bold text-white">`);
        push_element($$renderer2, "h1", 7, 4);
        $$renderer2.push(`${escape_html(pose.displayName)}</h1>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    },
    YogaPose
  );
}
YogaPose.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
const sprite = {
  headToKneeR: [0, 1080],
  headToKneeL: [1090, 1210],
  sphinx: [2300, 751],
  bridge: [3051, 689],
  runnersLungeL: [3740, 1599],
  runnersLungeR: [5338, 1506],
  kneesToChest: [6844, 1539],
  staff: [8383, 959],
  happyBaby: [9344, 1190],
  corpse: [10534, 850],
  pigeonR: [11384, 959],
  pigeonL: [12343, 1066],
  lizardL: [13409, 1151],
  lizardR: [14560, 1050],
  cobra: [15610, 619],
  upDog: [16229, 859],
  seated: [17088, 822],
  seatedForwardFold: [17910, 1447],
  warriorOneR: [19356, 1494],
  warriorOneL: [20850, 1375],
  threeLeggedDogR: [22226, 1590],
  threeLeggedDogL: [23815, 1832],
  downDog: [25647, 960],
  catCow: [26608, 1308],
  halfwayLift: [27915, 1466],
  wildThingL: [29381, 1308],
  wildThingR: [30689, 1530],
  supportedSidePlankL: [32219, 2161],
  supportedSidePlankR: [34380, 2050],
  sidePlankR: [36430, 1332],
  sidePlankL: [37762, 1605],
  plank: [39367, 693],
  ragdoll: [40060, 777],
  standingForwardFold: [40837, 1826],
  mountain: [42670, 693],
  count1: [43363, 351],
  count2: [43713, 322],
  count3: [44043, 297],
  count4: [44345, 300],
  count5: [44653, 237],
  count6: [44887, 451],
  count7: [45341, 367],
  count8: [45710, 280],
  count9: [45980, 227],
  count10: [46209, 250],
  count11: [46459, 395],
  count12: [46864, 290],
  count13: [47155, 474],
  count14: [47636, 543],
  count15: [48189, 459],
  count16: [48660, 560],
  count17: [49228, 538],
  count18: [49771, 436],
  count19: [50212, 489],
  count20: [50709, 392],
  count21: [51109, 614],
  count22: [51725, 606],
  count23: [52342, 645],
  count24: [52984, 667],
  count25: [53659, 563],
  count26: [54214, 780],
  count27: [55001, 655],
  count28: [55661, 576],
  count29: [56234, 596],
  count30: [56831, 265],
  count31: [57096, 532],
  count32: [57628, 482],
  count33: [58109, 471],
  count34: [58606, 512],
  count35: [59126, 482],
  count36: [59613, 685],
  count37: [60302, 577],
  count38: [60879, 531],
  count39: [61417, 506],
  count40: [61947, 294],
  count41: [62234, 527],
  count42: [62769, 552],
  count43: [63317, 531],
  count44: [63841, 556],
  count45: [64393, 520],
  count46: [64920, 732],
  count47: [65652, 628],
  count48: [66272, 531],
  count49: [66799, 491],
  count50: [67287, 333],
  count51: [67617, 463],
  count52: [68070, 505],
  count53: [68569, 464],
  count54: [69034, 545],
  count55: [69574, 515],
  count56: [70089, 707],
  count57: [70790, 565],
  count58: [71361, 525],
  count59: [71880, 535],
  count60: [72415, 368],
  count61: [72779, 606],
  count62: [73369, 656],
  count63: [74016, 606],
  count64: [74616, 722],
  count65: [75323, 671],
  count66: [75974, 924],
  count67: [76877, 757],
  count68: [77619, 707],
  count69: [78316, 631],
  count70: [78927, 409],
  count71: [79305, 611],
  count72: [79931, 586],
  count73: [80522, 621],
  count74: [81137, 656],
  count75: [81789, 602],
  count76: [82420, 814],
  count77: [83227, 681],
  count78: [83898, 641],
  count79: [84577, 604],
  count80: [85176, 250],
  count81: [85423, 466],
  count82: [85887, 507],
  count83: [86391, 494],
  count84: [86883, 510],
  count85: [87392, 606],
  count86: [87991, 718],
  count87: [88704, 611],
  count88: [89313, 543],
  count89: [89858, 538],
  count90: [90386, 385],
  count91: [90765, 532],
  count92: [91291, 699],
  count93: [91976, 592],
  count94: [92550, 653],
  count95: [93199, 620],
  count96: [93809, 825],
  count97: [94619, 728],
  count98: [95344, 656],
  count99: [96003, 567],
  count100: [96556, 581],
  greatJob: [97126, 663],
  excellent: [97800, 917],
  excellentJob: [98718, 839],
  niceWork: [99567, 971],
  youreDoingReallyGood: [100546, 983],
  keepItUp: [101558, 674],
  clap: [102327, 2835],
  hyperClap: [105389, 1357]
};
class SoundManager {
  voice;
  music;
  soundQueue = [];
  currentSound = null;
  _voiceEnabled = true;
  _voiceVolume = 0.8;
  _voiceCounter = false;
  _musicEnabled = false;
  _musicVolume = 0.5;
  _counter = 0;
  _lastPoseName = null;
  constructor() {
    this.voice = new Howl({
      src: ["/voice.ogg", "/voice.mp3"],
      sprite,
      autoUnlock: true,
      onend: () => {
        if (this.soundQueue.length > 0) {
          const nextSprite = this.soundQueue.shift();
          this.queueSprite(nextSprite);
        }
      }
    });
    this.music = new Howl({
      src: ["/TEMPHUiBIS - Dreamy Yoga.mp3"],
      loop: true,
      autoUnlock: true
    });
  }
  get voiceEnabled() {
    return this._voiceEnabled;
  }
  set voiceEnabled(val) {
    this._voiceEnabled = val;
  }
  get voiceVolume() {
    return this._voiceVolume;
  }
  set voiceVolume(val) {
    this._voiceVolume = val;
    this.voice.volume(val);
  }
  get voiceCounter() {
    return this._voiceCounter;
  }
  set voiceCounter(val) {
    this._voiceCounter = val;
  }
  get musicEnabled() {
    return this._musicEnabled;
  }
  set musicEnabled(val) {
    this._musicEnabled = val;
    if (val) {
      this.music.play();
    } else {
      this.music.stop();
    }
  }
  get musicVolume() {
    return this._musicVolume;
  }
  set musicVolume(val) {
    this._musicVolume = val;
    this.music.volume(val);
  }
  get counter() {
    return this._counter;
  }
  onPose(poseName) {
    if (!this._voiceEnabled) return;
    this._counter++;
    this._lastPoseName = poseName;
    if (this._voiceCounter) {
      const countKey = `count${this._counter}`;
      if (sprite[countKey]) {
        this.queueSprite(countKey);
      }
    }
    this.queueSprite(poseName);
  }
  queueSprite(spriteName) {
    if (this.currentSound && this.voice.playing(this.currentSound)) {
      this.soundQueue.push(spriteName);
    } else {
      this.currentSound = spriteName;
      this.voice.play(spriteName);
    }
  }
}
new SoundManager();
_page[FILENAME] = "src/routes/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let pose = null;
      (() => {
        try {
          return JSON.parse(localStorage.getItem("flowworld-prefs") ?? "{}").color;
        } catch {
          return null;
        }
      })();
      let sessionId = null;
      let sessions = [];
      let cleanup = null;
      onDestroy(() => cleanup?.());
      let remoteSessions = derived(() => sessions.filter((s) => s.id !== sessionId));
      let remoteCount = derived(() => remoteSessions().length);
      function remotePos(i, n) {
        const a = i / n * Math.PI * 2 - Math.PI / 2;
        return { x: Math.cos(a) * 200, y: Math.sin(a) * 200 };
      }
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        head("1uha8ag", $$renderer3, ($$renderer4) => {
          $$renderer4.title(($$renderer5) => {
            $$renderer5.push(`<title>multiplayer.yoga</title>`);
          });
        });
        $$renderer3.push(`<audio src="/void.mp3" autoplay="" class="d-none">`);
        push_element($$renderer3, "audio", 97, 0);
        $$renderer3.push(`</audio>`);
        pop_element();
        $$renderer3.push(` <div class="position-relative vh-100 overflow-hidden bg-dark">`);
        push_element($$renderer3, "div", 99, 0);
        $$renderer3.push(`<div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style="background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 50px 50px;">`);
        push_element($$renderer3, "div", 100, 2);
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(remoteSessions());
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          let remote = each_array[i];
          const pos = remotePos(i, remoteCount());
          $$renderer3.push(`<div class="position-absolute rounded-circle remote-circle svelte-1uha8ag"${attr_style(`left: calc(50% + ${stringify(pos.x)}px); top: calc(50% + ${stringify(pos.y)}px); width: 28px; height: 28px; margin-left: -14px; margin-top: -14px; background: ${stringify(remote.color)}; opacity: 0.6; border: 2px solid ${stringify(remote.color)};`)}>`);
          push_element($$renderer3, "div", 103, 6);
          $$renderer3.push(`</div>`);
          pop_element();
        }
        $$renderer3.push(`<!--]--> `);
        {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div class="text-secondary small">`);
          push_element($$renderer3, "div", 114, 6);
          $$renderer3.push(`Connecting...</div>`);
          pop_element();
        }
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
        $$renderer3.push(` <div class="position-relative z-1 h-100 d-flex flex-column">`);
        push_element($$renderer3, "div", 118, 2);
        $$renderer3.push(`<header class="d-flex justify-content-end align-items-start p-3">`);
        push_element($$renderer3, "header", 119, 4);
        $$renderer3.push(`<div class="d-flex gap-2">`);
        push_element($$renderer3, "div", 120, 6);
        $$renderer3.push(`<button class="btn btn-outline-light btn-sm rounded-pill">`);
        push_element($$renderer3, "button", 121, 8);
        $$renderer3.push(`Settings</button>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(`</header>`);
        pop_element();
        $$renderer3.push(` <div class="mt-auto p-3">`);
        push_element($$renderer3, "div", 124, 4);
        YogaPose($$renderer3, { pose });
        $$renderer3.push(`<!----></div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` `);
        {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-vot32Wdz.js.map
