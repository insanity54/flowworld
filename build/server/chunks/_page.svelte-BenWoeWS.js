import { h as head, ag as ensure_array_like, aj as attr, c as escape_html, ak as attr_class, al as clsx, ah as attr_style, ai as stringify, ad as derived, F as FILENAME } from './renderer-Bvyq1msV.js';
import { p as push_element, a as pop_element } from './dev-Bxel_zGI.js';

_page[FILENAME] = "src/routes/poses/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { data } = $$props;
      let poses = derived(() => data.poses);
      let selectedId = null;
      let selectedPose = derived(() => poses().find((p) => p.name === selectedId) ?? null);
      let centerX = 400;
      let centerY = 350;
      let radius = Math.min(260, poses().length * 30);
      function nodePos(i) {
        const a = i / poses().length * Math.PI * 2 - Math.PI / 2;
        return {
          x: centerX + Math.cos(a) * radius,
          y: centerY + Math.sin(a) * radius
        };
      }
      let positions = derived(() => poses().map((_, i) => nodePos(i)));
      function getNeighborEdges() {
        const edges2 = [];
        for (let i = 0; i < poses().length; i++) {
          for (const nId of poses()[i].neighbors) {
            const j = poses().findIndex((p) => p.name === nId);
            if (j > i) edges2.push({ from: i, to: j });
          }
        }
        return edges2;
      }
      let edges = derived(getNeighborEdges);
      function rarityColor(r) {
        const colors = ["#22cc66", "#44aaff", "#ffaa00", "#ff5500", "#ff0055"];
        return colors[Math.min(r - 1, colors.length - 1)];
      }
      head("76fsop", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Poses — multiplayer.yoga</title>`);
        });
      });
      $$renderer2.push(`<div class="d-flex vh-100">`);
      push_element($$renderer2, "div", 48, 0);
      $$renderer2.push(`<div class="flex-grow-1 position-relative overflow-hidden bg-dark">`);
      push_element($$renderer2, "div", 49, 2);
      $$renderer2.push(`<svg width="100%" height="100%" viewBox="0 0 800 700" class="position-absolute top-0 start-0">`);
      push_element($$renderer2, "svg", 50, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(edges());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let e = each_array[$$index];
        $$renderer2.push(`<line${attr("x1", positions()[e.from].x)}${attr("y1", positions()[e.from].y)}${attr("x2", positions()[e.to].x)}${attr("y2", positions()[e.to].y)} stroke="rgba(255,255,255,0.15)" stroke-width="1.5">`);
        push_element($$renderer2, "line", 52, 8);
        $$renderer2.push(`</line>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--><!--[-->`);
      const each_array_1 = ensure_array_like(poses());
      for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
        let pose = each_array_1[i];
        const pos = positions()[i];
        $$renderer2.push(`<g style="cursor: pointer;" class="node-group svelte-76fsop">`);
        push_element($$renderer2, "g", 60, 8);
        $$renderer2.push(`<circle${attr("cx", pos.x)}${attr("cy", pos.y)} r="14"${attr("fill", selectedId === pose.name ? rarityColor(pose.rarity) : "rgba(255,255,255,0.1)")}${attr("stroke", selectedId === pose.name ? "#fff" : rarityColor(pose.rarity))}${attr("stroke-width", selectedId === pose.name ? 3 : 2)} class="svelte-76fsop">`);
        push_element($$renderer2, "circle", 61, 10);
        $$renderer2.push(`</circle>`);
        pop_element();
        $$renderer2.push(`<text${attr("x", pos.x)}${attr("y", pos.y + 28)} text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="10" font-family="sans-serif">`);
        push_element($$renderer2, "text", 67, 10);
        $$renderer2.push(`${escape_html(pose.displayName)}</text>`);
        pop_element();
        $$renderer2.push(`</g>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></svg>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="border-start" style="width: 360px; overflow-y: auto; background: var(--bs-body-bg);">`);
      push_element($$renderer2, "div", 75, 2);
      $$renderer2.push(`<div class="p-3 border-bottom">`);
      push_element($$renderer2, "div", 76, 4);
      $$renderer2.push(`<h5 class="mb-0">`);
      push_element($$renderer2, "h5", 77, 6);
      $$renderer2.push(`Pose Reference</h5>`);
      pop_element();
      $$renderer2.push(` <small class="text-muted">`);
      push_element($$renderer2, "small", 78, 6);
      $$renderer2.push(`${escape_html(poses().length)} poses</small>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (selectedPose()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="p-3">`);
        push_element($$renderer2, "div", 82, 6);
        $$renderer2.push(`<h6>`);
        push_element($$renderer2, "h6", 83, 8);
        $$renderer2.push(`${escape_html(selectedPose().displayName)}</h6>`);
        pop_element();
        $$renderer2.push(` <table class="table table-sm small mb-2">`);
        push_element($$renderer2, "table", 84, 8);
        $$renderer2.push(`<tbody>`);
        push_element($$renderer2, "tbody", 85, 10);
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 86, 12);
        $$renderer2.push(`<td class="text-muted">`);
        push_element($$renderer2, "td", 86, 16);
        $$renderer2.push(`Name</td>`);
        pop_element();
        $$renderer2.push(`<td>`);
        push_element($$renderer2, "td", 86, 48);
        $$renderer2.push(`${escape_html(selectedPose().name)}</td>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 87, 12);
        $$renderer2.push(`<td class="text-muted">`);
        push_element($$renderer2, "td", 87, 16);
        $$renderer2.push(`Rarity</td>`);
        pop_element();
        $$renderer2.push(`<td>`);
        push_element($$renderer2, "td", 87, 50);
        $$renderer2.push(`${escape_html(selectedPose().rarity)}</td>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 88, 12);
        $$renderer2.push(`<td class="text-muted">`);
        push_element($$renderer2, "td", 88, 16);
        $$renderer2.push(`Difficulty</td>`);
        pop_element();
        $$renderer2.push(`<td>`);
        push_element($$renderer2, "td", 88, 54);
        $$renderer2.push(`${escape_html(selectedPose().difficulty)}</td>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 89, 12);
        $$renderer2.push(`<td class="text-muted">`);
        push_element($$renderer2, "td", 89, 16);
        $$renderer2.push(`Mirror</td>`);
        pop_element();
        $$renderer2.push(`<td>`);
        push_element($$renderer2, "td", 89, 50);
        $$renderer2.push(`${escape_html(selectedPose().mirror || "—")}</td>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 90, 12);
        $$renderer2.push(`<td class="text-muted">`);
        push_element($$renderer2, "td", 90, 16);
        $$renderer2.push(`Neighbors</td>`);
        pop_element();
        $$renderer2.push(`<td>`);
        push_element($$renderer2, "td", 90, 53);
        $$renderer2.push(`${escape_html(selectedPose().neighbors.length)}</td>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
        $$renderer2.push(`</tbody>`);
        pop_element();
        $$renderer2.push(`</table>`);
        pop_element();
        $$renderer2.push(` <details class="small">`);
        push_element($$renderer2, "details", 93, 8);
        $$renderer2.push(`<summary class="text-muted">`);
        push_element($$renderer2, "summary", 94, 10);
        $$renderer2.push(`Neighbor list</summary>`);
        pop_element();
        $$renderer2.push(` <ul class="list-unstyled mt-1 mb-0">`);
        push_element($$renderer2, "ul", 95, 10);
        $$renderer2.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(selectedPose().neighbors);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let nId = each_array_2[$$index_2];
          $$renderer2.push(`<li>`);
          push_element($$renderer2, "li", 97, 14);
          $$renderer2.push(`${escape_html(nId)}</li>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></ul>`);
        pop_element();
        $$renderer2.push(`</details>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="p-3">`);
        push_element($$renderer2, "div", 103, 6);
        $$renderer2.push(`<table class="table table-sm small">`);
        push_element($$renderer2, "table", 104, 8);
        $$renderer2.push(`<thead>`);
        push_element($$renderer2, "thead", 105, 10);
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 106, 12);
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 107, 14);
        $$renderer2.push(`Pose</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 108, 14);
        $$renderer2.push(`R</th>`);
        pop_element();
        $$renderer2.push(`<th>`);
        push_element($$renderer2, "th", 109, 14);
        $$renderer2.push(`Difficulty</th>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
        $$renderer2.push(`</thead>`);
        pop_element();
        $$renderer2.push(`<tbody>`);
        push_element($$renderer2, "tbody", 112, 10);
        $$renderer2.push(`<!--[-->`);
        const each_array_3 = ensure_array_like(poses());
        for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
          let pose = each_array_3[$$index_3];
          $$renderer2.push(`<tr style="cursor:pointer;"${attr_class(clsx(selectedId === pose.name ? "table-active" : ""))}>`);
          push_element($$renderer2, "tr", 114, 14);
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 115, 16);
          $$renderer2.push(`${escape_html(pose.displayName)}</td>`);
          pop_element();
          $$renderer2.push(`<td>`);
          push_element($$renderer2, "td", 116, 16);
          $$renderer2.push(`<span class="badge"${attr_style(`background:${stringify(rarityColor(pose.rarity))}`)}>`);
          push_element($$renderer2, "span", 117, 18);
          $$renderer2.push(`${escape_html(pose.rarity)}</span>`);
          pop_element();
          $$renderer2.push(`</td>`);
          pop_element();
          $$renderer2.push(`<td class="text-capitalize">`);
          push_element($$renderer2, "td", 119, 16);
          $$renderer2.push(`${escape_html(pose.difficulty)}</td>`);
          pop_element();
          $$renderer2.push(`</tr>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></tbody>`);
        pop_element();
        $$renderer2.push(`</table>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-BenWoeWS.js.map
