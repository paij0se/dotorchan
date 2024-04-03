<script lang="ts">
  const url = "http://192.168.1.6:8080/api/v1/stats";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const stats = document.getElementById("stats");
      if (stats) {
        stats.innerHTML = `
          <b>Total posts:</b> <p>${data}</p>
        `;
      }
    })
    .catch((err) => console.error(err));
  //////////////////////////////////////////////////
  const totalSizeUrl = "http://192.168.1.6:5000/totalSize";
  fetch(totalSizeUrl)
    .then((res) => res.json())
    .then((data) => {
      const size = data.bucketTotalSize;
      if (size > 1024 && size < 1048576) {
        document.getElementById("total-size")!.innerHTML +=
          `<b>Active Content:</b> <p>${(size / 1024).toFixed(2)} KB</p>`;
      } else if (size > 1048576) {
        document.getElementById("total-size")!.innerHTML +=
          `<b>Active Content:</b> <p>${(size / 1048576).toFixed(2)} MB</p>`;
      }
    })
    .catch((err) => console.error(err));
</script>

<svelte:head>
  <style>
    @import url("https://fonts.cdnfonts.com/css/gg-sans-2");
  </style>
</svelte:head>

<div id="boards">
  <h1>Boards</h1>
  <a href="/boards/g">/g/</a>
  <a href="/boards/pol">/pol/</a>
  <a href="/boards/qst">/qst/</a>
</div>
<div id="stats"></div>
<div id="total-size"></div>

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
    align-items: center;
  }
  a {
    color: #c20505;
    text-decoration: none;
    font-size: 30px;
  }
  h1 {
    color: #c20505;
  }
  #stats,
  #total-size {
    margin-top: 20px;
    text-align: center;
  }
</style>
