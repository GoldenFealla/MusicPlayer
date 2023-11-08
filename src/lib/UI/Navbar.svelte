<script>
  import { onMount } from "svelte";

  import "@material/web/button/filled-button.js";
  import { MdDialog } from "@material/web/dialog/dialog.js";

  import IconButton from "./shared/IconButton.svelte";
  import Theme from "./Theme.svelte";
  import Input from "./Input.svelte";
  import Settings from "./Settings.svelte";

  /**
   * @type {MdDialog}
   */
  let dialogEl;

  onMount(() => {
    const dialogStyleElement = document.createElement("style");

    //Bug menu using the wrong variable (Fuck bug)
    //--md-sys-color-surface-container instead of --md-sys-color-surface
    dialogStyleElement.innerHTML = `
      .container::before {
        background-color: var(--md-sys-color-surface, #f3edf7) !important;
      }

      .container .scroller {
        overflow: hidden !important;
      }
    `;

    dialogEl.shadowRoot.appendChild(dialogStyleElement);
  });
</script>

<div class="main">
  <span>
    <IconButton
      on:click={async () => {
        await dialogEl.show();
      }}
      iconName="settings"
      size="small"
    />
    <md-dialog bind:this={dialogEl}>
      <div class="settings-content" slot="content">
        <Settings />
      </div>
    </md-dialog>
  </span>

  <span>
    <IconButton iconName="palette" size="small">
      <svelte:fragment slot="menu">
        <div class="menu-card">
          <Theme />
        </div>
      </svelte:fragment>
    </IconButton>
  </span>

  <span>
    <Input />
  </span>
</div>

<style lang="scss">
  .main {
    width: 100%;
    padding: 1rem;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    gap: 1rem;
  }

  .main > span {
    position: relative;
  }

  .settings-content {
    padding: 2rem;
  }

  .menu-card {
    padding: 1rem;
  }
</style>
