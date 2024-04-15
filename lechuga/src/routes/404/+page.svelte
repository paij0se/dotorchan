<script lang="ts">
  import { browser } from "$app/environment";
  if (browser) {
    document.title = "404 - Not Found";
  }
  const images: string[] = [
    "https://dotorchan.s3.amazonaws.com/static+files/404-Anonymous.jpg",
    "https://dotorchan.s3.amazonaws.com/static+files/404-Anonymous-5.png",
    "https://dotorchan.s3.amazonaws.com/static+files/404-Anonymous-6.png",
  ];
  const randomImage = images[Math.floor(Math.random() * images.length)];
</script>

<h1>404 - Not Found</h1>
<button on:click={() => (window.location.href = "/")}>Go back home</button>
<div id="c">
  <img src={randomImage} alt="logo" id="logo" />
</div>

<style>
  h1 {
    text-align: center;
    font-family: "gg sans Normal";
  }
  button {
    display: block;
    margin: 0 auto;
  }
  #c {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  :global(body) {
    background: #ffe
      url("https://dotorchan.s3.amazonaws.com/static+files/fade.png") top
      repeat-x;
    color: #800;
  }
</style>
