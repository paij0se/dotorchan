<script lang="ts">
  import { postToDotorChan } from "../../../functions/post";
  import type { PostToS3 } from "../../../functions/post";
  import {
    apiData,
    boardPosts,
    dateConverter,
  } from "../../../functions/getposts";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import url from "../../../services.json";
  const baseURL = url["dotorchan-api"];
  const s3URL = url["dotochan-aws"];
  let fileInput: any;
  let files: any;
  let avatar: any;
  let fileS3: any;

  if (browser) {
    document.title = "/mu/ - Music";
  }
  onMount(async () => {
    fetch(baseURL + "mu")
      .then((response) => response.json())
      .then((data): ReturnType<() => void> => {
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
          if (imgData[1].length > 26214400) {
            alert("File is too large, max size is 25MB");
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

<svelte:head>
  <style>
    @import url("https://fonts.cdnfonts.com/css/gg-sans-2");
  </style>
</svelte:head>
<img
  src="https://media.discordapp.net/attachments/1216124670957326407/1225532039646679202/Brown_Minimalist_Podcast_Promotion_Youtube_Thumbnail-removebg-preview.png?ex=662178a7&is=660f03a7&hm=bc8c6ad0c93ceadb0e8d1acc29ae5668a6f2e7a3bf373dc2dff357c231e0eb41&=&format=webp&quality=lossless&width=832&height=468"
  alt="logo"
  id="logo"
/>
<button class="upload-btn" on:click={() => (window.location.href = "/")}
  >back</button
>

<h1>/mu/ - Music</h1>
<input type="text" placeholder="Title (optional)" id="title" />
<br />
<textarea name="" id="" placeholder="Post to /mu/"></textarea>
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
  id="post-btn"
  on:click={async () =>
    await postToDotorChan(
      baseURL,
      fileS3,
      "mu",
      `${url["dotochan-aws"]}/captcha`
    )}>post</button
>

<div class="captcha-container">
  <!-- svelte-ignore a11y-missing-attribute -->
  <img id="captcha" src="" />
  <input type="text" id="captcha-input" placeholder="TYPE THE CAPTCHA HERE" />
  <button class="upload-btn" id="verify">verify</button>
</div>

<h1>Posts</h1>
<hr />
{#each $boardPosts as post}
  {#if post.title}
    <h2>{post.title}</h2>
  {/if}
  <p>{post.content}</p>
  {#if post.file}
    {#if post.file.format === "png" || post.file.format === "jpg" || post.file.format === "gif"}
      {#if (post.file.dimensions.height > 500 && post.file.dimensions.height < 1080) || (post.file.dimensions.width > 500 && post.file.dimensions.width <= 1920)}
        <a href={post.file.url} download
          >{post.file.dimensions.width}x{post.file.dimensions.height}</a
        >
        <br />
        <img
          src={post.file.url}
          alt="file"
          width={post.file.dimensions.width / 2}
          height={post.file.dimensions.height / 2}
        />
      {:else if post.file.dimensions.height > 1080 || post.file.dimensions.width > 1920}
        <a href={post.file.url} download
          >{post.file.dimensions.width}x{post.file.dimensions.height}</a
        >
        <br />
        <img src={post.file.url} alt="file" width="680" height="420" />
      {:else}
        <a href={post.file.url} download>{post.file.filename}</a>
        <br />
        <img src={post.file.url} alt="file" />
      {/if}
    {:else if post.file.format === "mp4"}
      {#if post.file.size > 1024 && post.file.size < 1048576}
        <a href={post.file.url} download
          >{(post.file.size / 1024).toFixed(2)}} KB</a
        >
      {:else if post.file.size > 1048576}
        <a href={post.file.url} download
          >{(post.file.size / 1048576).toFixed(2)} MB</a
        >
      {/if}
      <br />
      <video controls>
        <source src={post.file.url} type="video/mp4" />
        <track kind="captions" />
      </video>
    {:else}
      <a href={post.file.url} download>{post.file.filename}</a>
      {#if post.file.size > 1024 && post.file.size < 1048576}
        <p>{(post.file.size / 1024).toFixed(2)} KB</p>
      {:else if post.file.size > 1048576}
        <p>{(post.file.size / 1048576).toFixed(2)} MB</p>
      {:else}
        <p>{post.file.size} B</p>
      {/if}
    {/if}
  {/if}
  <p>{dateConverter(post.created_at)}</p>
  <p>Anon: @{post.user_id}</p>
  <hr />
{/each}
<footer>
  <p>
    All trademarks and copyrights on this page are owned by their respective
    parties. Images uploaded are the responsibility of the Poster. Comments are
    owned by the Poster.
  </p>
</footer>

<style>
  @import "../../../style.css";
</style>
