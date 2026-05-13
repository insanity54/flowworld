import { h as head, F as FILENAME } from './renderer-Bvyq1msV.js';
import { p as push_element, a as pop_element } from './dev-Bxel_zGI.js';

_layout[FILENAME] = "src/routes/+layout.svelte";
function _layout($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { children } = $$props;
      head("12qhfyh", $$renderer2, ($$renderer3) => {
        $$renderer3.push(`<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"/>`);
        push_element($$renderer3, "link", 8, 2);
        pop_element();
        $$renderer3.push(` `);
        $$renderer3.push(`<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" defer=""><\/script>`);
      });
      $$renderer2.push(`<div class="container-fluid p-0">`);
      push_element($$renderer2, "div", 16, 0);
      if (children) {
        $$renderer2.push("<!--[0-->");
        children($$renderer2);
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
    },
    _layout
  );
}
_layout.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _layout as default };
//# sourceMappingURL=_layout.svelte-Dw_AgKcD.js.map
