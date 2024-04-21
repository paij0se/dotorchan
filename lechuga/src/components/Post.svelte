<script lang="ts">
  import { postToDotorChan, checkWhatBoardIs, putH1 } from "../functions/post";
  import type { PostToS3 } from "../functions/post";
  import { RandomBanner } from "../functions/getposts";
  import { browser } from "$app/environment";
  import url from "../services.json";
  const baseURL = url["dotorchan-api"];
  const s3URL = url["dotochan-aws"];
  let fileInput: any;
  let files: any;
  let avatar: any;
  let fileS3: any;
  function UploadtoS3(image: Blob) {
    let avatar: any;
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = async (e) => {
      if (e.target) {
        avatar = e.target.result;
        if (typeof e.target.result === "string") {
          const imgData = e.target.result.split(",");
          const data = { image: imgData[1] };
          // max size is 4MB
          if (imgData[1].length > 4194304) {
            alert("File is too large, max size is 4MB");
            return;
          }
          const res = await fetch(s3URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: files[0].name,
              data: data["image"],
            }),
          });
          const s3Url: PostToS3 = await res.json();
          fileS3 = s3Url;
          if (browser) {
            document.getElementById("fileName")!.innerText = files[0].name;
          }
        }
      }
    };
  }
</script>

<div id="center">
  <img src={RandomBanner()} alt="banner" />
  <h1>{putH1()}</h1>
  <details>
    <summary><span>[</span>Start a New Thread<span>]</span></summary>
    <input type="text" placeholder="Title (optional)" id="title" />
    <br />
    <textarea name="" id="" placeholder="Post to /{checkWhatBoardIs()}/"
    ></textarea>
    <div class="container">
      <input
        class="hidden"
        type="file"
        accept="image/png, image/jpeg, image/gif, video/mp4"
        bind:files
        bind:this={fileInput}
        on:change={() => UploadtoS3(files[0])}
      />
      <button class="upload-btn" on:click={() => fileInput.click()}
        >Upload file</button
      >
    </div>
    <div id="fileName"></div>
    <br />
    <button
      id="post-btn"
      on:click={async () =>
        await postToDotorChan(
          baseURL,
          fileS3,
          checkWhatBoardIs(),
          `${url["dotochan-aws"]}/captcha`
        )}>post</button
    >

    <div class="captcha-container">
      <!-- svelte-ignore a11y-missing-attribute -->
      <img id="captcha" src="" />
      <input
        type="text"
        id="captcha-input"
        placeholder="TYPE THE CAPTCHA HERE"
      />
      <button class="upload-btn" id="verify">verify</button>
    </div>
  </details>
</div>

<style>
  @import "../style.css";
</style>
