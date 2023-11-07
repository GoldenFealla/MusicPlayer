<script>
  import "@material/web/icon/icon.js";
  import { MdIconButton } from "@material/web/iconbutton/icon-button.js";
  import { MdMenu } from "@material/web/menu/menu.js";

  import { createEventDispatcher, onMount } from "svelte";
  let dispatch = createEventDispatcher();

  /**
   * @type {string} iconName
   */
  export let iconName = "play_arrow";

  /**
   * @type {"small" | "medium" | "large"} size
   */
  export let size = "medium";

  /**
   * @type {MdIconButton}
   */
  let button;

  /**
   * @type {MdMenu}
   */
  let menu;

  onMount(() => {
    if (menu) {
      menu.anchorElement = button;

      const menuStyleElement = document.createElement("style");

      //Bug menu using the wrong variable
      //--md-sys-color-surface-container instead of --md-sys-color-surface
      menuStyleElement.innerHTML = `
        .items {
          background-color: var(--md-menu-container-color, var(--md-sys-color-surface, #f3edf7)) !important;
        }
      `;

      menu.shadowRoot.appendChild(menuStyleElement);
    }

    button.addEventListener("click", async () => {
      dispatch("click");

      if (menu) {
        menu.open = !menu.open;
      }
    });

    const styleElement = document.createElement("style");

    styleElement.innerHTML = `
      .touch {
        width: 100% !important;
        height: 100% !important;
      }
    `;

    button.shadowRoot.appendChild(styleElement);
  });
</script>

<md-icon-button
  bind:this={button}
  class:small={size === "small"}
  class:medium={size === "medium"}
  class:large={size === "large"}
  id="usage-anchor"
>
  {#key iconName}
    <md-icon>
      {iconName}
    </md-icon>
  {/key}
</md-icon-button>
{#if $$slots.menu}
  <md-menu bind:this={menu}>
    <slot name="menu" />
  </md-menu>
{/if}

<style lang="scss">
  .small {
    width: 3rem;
    height: 3rem;
    --md-icon-button-icon-size: 2rem;
  }

  .medium {
    width: 3.75rem;
    height: 3.75rem;
    --md-icon-button-icon-size: 2.5rem;
  }

  .large {
    width: 4.5rem;
    height: 4.5rem;
    --md-icon-button-icon-size: 3rem;
  }
</style>
