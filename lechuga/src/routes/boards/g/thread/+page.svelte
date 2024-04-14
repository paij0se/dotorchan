<script lang="ts">
  import {
    apiData,
    boardPosts,
    dateConverter,
    sizeConverter,
  } from "../../../../functions/getposts";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import url from "../../../../services.json";
  const baseURL = url["dotorchan-api"];
  let userUniqueID: any;
  if (browser) {
    document.title = "/g/ - Technology";
    userUniqueID = localStorage.getItem("user_id");
    const urlParams = new URLSearchParams(window.location.search);
    const threadID = urlParams.get("id");
    console.log(threadID);
    onMount(async () => {
      fetch(`${baseURL}g/${threadID}`)
        .then((response) => response.json())
        .then((data): ReturnType<() => void> => {
          apiData.set(data);
        })
        .catch((_) => {
          window.location.href = "/404";
        });
    });
  }
</script>

<svelte:head>
  <style>
    @import url("https://fonts.cdnfonts.com/css/gg-sans-2");
  </style>
</svelte:head>
[<a href="/boards/g">Back</a>]
<div id="center">
  <h1>/g/ - Technology</h1>
</div>

<hr />
{#each $boardPosts as post}
  <span>
    {#if post.title}
      <span id="title-post">{post.title}</span>
    {/if}
    <span id="anon">Anonymous @{post.user_id}</span>
    {dateConverter(post.created_at)}
    No. {post.post_id}
  </span>
  {#if post.file}
    {#if post.file.format === "png" || post.file.format === "jpg" || post.file.format === "gif"}
      <br />
      File: <a href={post.file.url} download>{post.file.filename}</a>
      ({sizeConverter(post.file.size)}, {post.file.dimensions.width}x{post.file
        .dimensions.height})

      {#if (post.file.dimensions.height > 500 && post.file.dimensions.height < 1080) || (post.file.dimensions.width > 500 && post.file.dimensions.width <= 1920)}
        <br />
        <img
          src={post.file.url}
          alt="file"
          width={post.file.dimensions.width / 2}
          height={post.file.dimensions.height / 2}
        />
      {:else if post.file.dimensions.height > 1080 || post.file.dimensions.width > 1920}
        <br />
        <img src={post.file.url} alt="file" width="680" height="420" />
      {:else}
        <br />
        <img src={post.file.url} alt="file" />
      {/if}
      <!-- VIDEO #########################################################################3 -->
    {:else if post.file.format === "mp4"}
      {#if post.file.size > 1024 && post.file.size < 1048576}
        <a href={post.file.url} download
          >{(post.file.size / 1024).toFixed(2)} KB</a
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
    {/if}
  {/if}
  <p>{post.content}</p>
  <br />
  <!-- Comments ############################################################################ -->
  {#if post.comments}
    {#each post.comments as comment}
      <p id="separator">>></p>
      <div class="comment">
        <span>
          <span id="anon">Anonymous @{comment.user_id}</span>
          {dateConverter(comment.created_at)}
          No. {comment.comment_id}
        </span>
        <p>{comment.content}</p>
      </div>
      <br />
    {/each}
  {/if}
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
  .comment {
    background-color: #f0e0d6;
    border: 1px solid #d9bfb7;
    border-left: none;
    border-top: none;
    display: table;
    padding: 2px;
  }
  #separator {
    color: #e0bfb7;
    float: left;
    margin-right: 2px;
    margin-top: 0;
    margin-left: 2px;
  }
  #title-post {
    color: #cc1105;
    font-weight: 700;
  }
  video {
    width: auto;
    height: auto;
    max-width: 100%;
  }
  footer {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "gg sans normal";
  }
  #anon {
    color: #117743;
    font-weight: 700;
  }
  :global(body) {
    background: #ffe url("../src/images/fade.png") top repeat-x;
    color: #800;
    font-family: "gg sans Normal";
  }
  #center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
