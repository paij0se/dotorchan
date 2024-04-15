<script lang="ts">
  import {
    apiData,
    boardPosts,
    dateConverter,
    sizeConverter,
  } from "../../../../functions/getposts";
  import { postReply } from "../../../../functions/post";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import url from "../../../../services.json";
  const baseURL = url["dotorchan-api"];
  let userUniqueID: any;
  if (browser) {
    document.title = "/pol/ - Politically Incorrect";
    userUniqueID = localStorage.getItem("user_id");
    const urlParams = new URLSearchParams(window.location.search);
    const threadID = urlParams.get("id");
    console.log(threadID);
    onMount(async () => {
      fetch(`${baseURL}pol/${threadID}`)
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
[<a href="/boards/pol">Back</a>]
<div id="center">
  <h1>/pol/ - Politically Incorrect</h1>
  <details>
    <summary><span>[</span>Post a Reply<span>]</span></summary>
    <textarea name="" id=""></textarea>
    <br />
    <button id="post-btn" on:click={() => postReply(baseURL, "pol")}
      >Post</button
    >
  </details>
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
    {#if post.file.format === "png" || post.file.format === "jpg" || post.file.format === "gif" || post.file.format === "jpeg"}
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
      <br />
      File: <a href={post.file.url} download>{post.file.filename}</a>
      ({sizeConverter(post.file.size)})
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
  @import "../../../../style-replies.css";
</style>
