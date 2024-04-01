<script lang="ts">
  import { getPosts } from "../../../functions/getposts";
  import { browser } from "$app/environment";
  getPosts("pol");
  const url = "http://192.168.1.6:8080/api/v1/pol";
  let fileInput: any;
  let files: any;
  let avatar: any;
  let fileS3: any;
  function getBase64(image: Blob) {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      if (e.target) {
        avatar = e.target.result;
        if (e.target && typeof e.target.result === "string") {
          uploadFunction(e.target.result);
        }
      }
    };
  }
  async function uploadFunction(imgBase64: string) {
    const data: { image?: string } = {};
    const imgData = imgBase64.split(",");
    data["image"] = imgData[1];
    if (imgData[1].length > 419430400) {
      alert("file is too large, max size is 400mb");
      return;
    }
    // TODO: Upload file to S3
    const apiS3 = "http://192.168.1.6:5000";
    const res = await fetch(apiS3, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: files[0].name,
        data: data["image"],
      }),
    });
    const s3Url = await res.json();
    fileS3 = s3Url;
    if (browser) {
      document.getElementById("fileName")!.innerText = files[0].name;
    }
  }
  async function post() {
    const content = document.querySelector("textarea")!.value;
    if (content.trim() === "") {
      alert("Content can't be empty");
      return;
    }
    if (content.length > 8000 || content.length < 1) {
      alert("Content is too long or too short");
      return;
    }
    if (browser) {
      // TODO: Unique ID with cookie
      console.log(document.cookie);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: document.querySelector("textarea")!.value,
          file: fileS3,
        }),
      });
      location.reload();
    }
  }
</script>

<svelte:head>
  <style>
    @import url("https://fonts.cdnfonts.com/css/gg-sans-2");
  </style>
</svelte:head>
<button class="upload-btn" on:click={() => (window.location.href = "/")}
  >back</button
>

<h1>Political Incorrect - /pol/</h1>
<textarea name="" id="" placeholder="Post to /pol/"></textarea>
<div class="container">
  <input
    class="hidden"
    id="file-to-upload"
    type="file"
    bind:files
    bind:this={fileInput}
    on:change={() => getBase64(files[0])}
  />
  <button class="upload-btn" on:click={() => fileInput.click()}
    >Upload file</button
  >
</div>
<div id="fileName"></div>
<br />
<button class="upload-btn" on:click={async () => await post()}>post</button>
<h1>Posts</h1>
<div id="output"></div>
<div id="codeblock"></div>

<style>
  :global(body) {
    background-color: #313338;
    color: #dbdee1;
    transition: background-color 0.3s;
  }
  #output {
    width: 80%;
    max-width: 800px;
    font-size: 20;
    font-family: "gg sans Normal";
  }
  .container {
    display: flex;
    flex-direction: column;
  }

  .hidden {
    display: none;
  }

  .upload-btn {
    width: 128px;
    height: 32px;
    background-color: black;
    font-family: sans-serif;
    color: white;
    font-weight: bold;
    border: none;
  }

  .upload-btn:hover {
    background-color: white;
    color: black;
    outline: black solid 2px;
  }
</style>
