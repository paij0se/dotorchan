<script lang="ts">
  const url = "http://192.168.1.6:8080/api/v1/stats";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const stats = document.getElementById("stats");
      if (stats) {
        stats.innerHTML = `
          <b>Total posts: ${data}</b>
        `;
      }
    })
    .catch((err) => console.error(err));
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
<div id="stats"></div>

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
    color: #c20505;
  }
  #stats {
    margin-top: 20px;
  }
</style>
