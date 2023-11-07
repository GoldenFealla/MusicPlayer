<script>
  import Display from "./lib/UI/Display.svelte";
  import Controller from "./lib/UI/Controller.svelte";
  import Navbar from "./lib/UI/Navbar.svelte";
</script>

<main class="main">
  <div id="display">
    <Display />
  </div>

  <div id="controller">
    <Controller />
  </div>

  <div id="navbar">
    <Navbar />
  </div>
</main>

<style lang="scss">
  .main {
    width: 100%;
    height: 100%;

    background-color: grey;
  }

  #display,
  #controller {
    width: 100%;
    height: 100%;

    position: absolute;
  }

  #navbar {
    width: 100%;
    height: auto;
    position: absolute;
  }
</style>
