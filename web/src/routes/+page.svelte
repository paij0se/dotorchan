<script lang="ts">
</script>

<svelte:head>
  <style>
    @import url("https://fonts.cdnfonts.com/css/gg-sans-2");
  </style>
</svelte:head>

<!--
  red
-->
<h1>Boards</h1>
<div id="boards">
  <a href="/boards/g">/g/</a>
  <a href="/boards/pol">/pol/</a>
  <a href="/boards/qst">/qst/</a>
</div>
<b>Total posts:</b>
<style>
  :global(body) {
    background-color: #313338;
    color: #dbdee1;
    transition: background-color 0.3s;
    font-family: "gg sans Normal";
  }
  #boards {
    margin: auto;
    border: 3px solid #424549;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  a {
    color: #c20505;
    text-decoration: none;
    font-size: 30px;
  }
  h1 {
    color : #c20505;
  }
</style>
