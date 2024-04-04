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
<img
  src="https://media.discordapp.net/attachments/1216124670957326407/1225532039646679202/Brown_Minimalist_Podcast_Promotion_Youtube_Thumbnail-removebg-preview.png?ex=662178a7&is=660f03a7&hm=bc8c6ad0c93ceadb0e8d1acc29ae5668a6f2e7a3bf373dc2dff357c231e0eb41&=&format=webp&quality=lossless&width=832&height=468"
  alt="logo"
/>

<br />

<div id="boards">
  <h2>Boards</h2>
  <a href="/boards/g">/g/</a>
  <a href="/boards/pol">/pol/</a>
  <a href="/boards/qst">/qst/</a>
</div>

<br />

<div id="other">
  <div id="stats"></div>
  <div id="total-size"></div>
</div>

<style>
  :global(body) {
    background-color: #313338;
    color: #dbdee1;
    transition: background-color 0.3s;
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
    color: #c20505;
    text-decoration: none;
    font-size: 20px;
  }
  h2 {
    color: #c20505;
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
