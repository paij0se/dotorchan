<script lang="ts">
  import services from "../services.json";
  const baseURL = services["dotorchan-api"];
  const s3URL = services["dotochan-aws"];
  const url = baseURL + "stats";
  import { browser } from "$app/environment";
  if (browser) {
    document.title = "dotorchan";
  }
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
  const totalSizeUrl = s3URL + "/totalSize";
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
<img
  src="https://dotorchan.s3.amazonaws.com/static+files/Brown_Minimalist_Podcast_Promotion_Youtube_Thumbnail-removebg-preview.png"
  alt="logo"
/>
<br />
<div id="boards">
  <h2>Boards</h2>
  <a href="/boards/g">Technology</a>
  <a href="/boards/pol">Politically Incorrect</a>
</div>
<br />
<div id="other">
  <div id="stats"></div>
  <div id="total-size"></div>
</div>

<style>
  :global(body) {
    background: #ffe
      url("https://dotorchan.s3.amazonaws.com/static+files/fade.png") top
      repeat-x;
    color: #800;
    font-family: "gg sans Normal";
  }
  #other {
    margin: auto;
    border: 0.5px solid #880000;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #boards {
    margin: auto;
    border: 0.5px solid #880000;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  a {
    color: #880000;
    text-decoration: none;
    font-size: 20px;
  }
  h2 {
    color: #880000;
    font-size: 30px;
  }
  img {
    display: block;
    height: 50%;
    margin-left: auto;
    margin-right: auto;
    width: 20%;
  }
  #stats,
  #total-size {
    margin-top: 20px;
    text-align: center;
  }
</style>
