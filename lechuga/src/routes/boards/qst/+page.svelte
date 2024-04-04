<script lang="ts">
  import { postToDotorChan } from "../../../functions/post";
  import {
    apiData,
    boardPosts,
    dateConverter,
  } from "../../../functions/getposts";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  const baseURL = "http://192.168.1.6:8080/api/v1/";
  const s3URL = "http://192.168.1.6:5000";
  let fileInput: any;
  let files: any;
  let avatar: any;
  let fileS3: any;
  interface PostToS3 {
    filename: string;
    format: string;
    size: number;
    url: string;
  }

  onMount(async () => {
    fetch(baseURL + "qst")
      .then((response) => response.json())
      .then((data) => {
        apiData.set(data);
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  });

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
          if (imgData[1].length > 20971520) {
            alert("File is too large, max size is 20MB");
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
          console.log(fileS3.url);
          if (browser) {
            document.getElementById("fileName")!.innerText = files[0].name;
          }
        }
      }
    };
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
<h1>/qst/ - Quests</h1>

<textarea name="" id="" placeholder="Post to /qst/"></textarea>
<div class="container">
  <input
    class="hidden"
    id="file-to-upload"
    type="file"
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
  class="upload-btn"
  on:click={async () => await postToDotorChan(baseURL, fileS3, "qst")}
  >post</button
>
<h1>Posts</h1>
<hr />
{#each $boardPosts as post}
  <p>{post.content}</p>
  {#if post.file}
    {#if post.file.format === "png" || post.file.format === "jpg" || post.file.format === "jpeg" || post.file.format === "gif" || post.file.format === "webp"}
      <img src={post.file.url} alt="file" />
    {:else if post.file.format === "mp4"}
      <video controls>
        <source src={post.file.url} type="video/mp4" />
        <track kind="captions" />
      </video>
    {:else}
      <a href={post.file.url} download>{post.file.filename}</a>
    {/if}
  {/if}
  <p>{dateConverter(post.created_at)}</p>
  <details>
    <summary>More</summary>
    <p>{post.message_id}</p>
    <p>@{post.user_id}</p>
  </details>
  <hr />
{/each}

<style>
  hr {
    border-color: #717780;
  }
  :global(body) {
    background-color: #313338;
    color: #dbdee1;
    transition: background-color 0.3s;
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
