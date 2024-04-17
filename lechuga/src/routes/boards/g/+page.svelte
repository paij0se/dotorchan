<script lang="ts">
  import { postToDotorChan } from "../../../functions/post";
  import type { PostToS3 } from "../../../functions/post";
  import {
    apiData,
    boardPosts,
    dateConverter,
    sizeConverter,
    safeTextWithLineBreaks,
  } from "../../../functions/getposts";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import url from "../../../services.json";
  const baseURL = url["dotorchan-api"];
  const s3URL = url["dotochan-aws"];
  let fileInput: any;
  let files: any;
  let avatar: any;
  let userUniqueID: any;
  let fileS3: any;
  if (browser) {
    userUniqueID = localStorage.getItem("user_id");
  }

  if (browser) {
    document.title = "/g/ - Technology";
  }
  onMount(async () => {
    fetch(baseURL + "g")
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
  function RandomBanner(): string {
    const images: string[] = [
      "https://dotorchan.s3.amazonaws.com/static+files/board-titles/1.gif",
      "https://dotorchan.s3.amazonaws.com/static+files/board-titles/2.gif",
      "https://dotorchan.s3.amazonaws.com/static+files/board-titles/3.gif",
      "https://dotorchan.s3.amazonaws.com/static+files/board-titles/4.gif",
      "https://dotorchan.s3.amazonaws.com/static+files/board-titles/5.gif",
      "https://dotorchan.s3.amazonaws.com/static+files/board-titles/6.gif",
    ];
    return images[Math.floor(Math.random() * images.length)];
  }
</script>

<svelte:head>
  <style>
    @import url("https://fonts.cdnfonts.com/css/gg-sans-2");
  </style>
</svelte:head>
[<a href="/">Home</a>]
<div id="center">
  <img src={RandomBanner()} alt="banner" />
  <h1>/g/ - Technology</h1>
  <details>
    <summary><span>[</span>Start a New Thread<span>]</span></summary>
    <input type="text" placeholder="Title (optional)" id="title" />
    <br />
    <textarea name="" id="" placeholder="Post to /g/"></textarea>
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
          "g",
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
<hr />
{#each $boardPosts as post}
  <span>
    {#if post.title}
      <span id="title-post">{post.title}</span>
    {/if}
    <span id="anon">Anonymous @{post.user_id}</span>
    {dateConverter(post.created_at)}
    No. {post.post_id}
    [<a href={"/boards/g/thread?id=" + post.post_id}>Reply</a>]
  </span>
  <!-- FILE  #########################################################################3 -->
  {#if post.file}
    {#if post.file.format === "png" || post.file.format === "jpg" || post.file.format === "jpeg" || post.file.format === "gif"}
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
  <p>{@html safeTextWithLineBreaks(post.content)}</p>
  <hr />
  <!-- Comments ############################################################################ -->
  {#if post.comments}
    {#each post.comments.slice(0, 10) as comment}
      <p id="separator">>></p>
      <div class="comment">
        <span>
          <span id="anon">Anonymous @{comment.user_id}</span>
          {dateConverter(comment.created_at)}
          No.
          <a
            id="replies"
            title="Reply to this post"
            href={"/boards/g/thread?id=" + post.post_id}>{comment.comment_id}</a
          >
        </span>
        <div id="blockquote">
          <p>{@html safeTextWithLineBreaks(comment.content)}</p>
          {#if comment.file}
            {#if comment.file.format === "png" || comment.file.format === "jpg" || comment.file.format === "jpeg" || comment.file.format === "gif"}
              File:
              <a href={comment.file.url} download>{comment.file.filename}</a>
              ({sizeConverter(comment.file.size)}, {comment.file.dimensions
                .width}x{comment.file.dimensions.height})
              {#if (comment.file.dimensions.height > 500 && comment.file.dimensions.height < 1080) || (comment.file.dimensions.width > 500 && comment.file.dimensions.width <= 1920)}
                <br />
                <img
                  src={comment.file.url}
                  alt="file"
                  width={comment.file.dimensions.width / 2}
                  height={comment.file.dimensions.height / 2}
                />
              {:else if comment.file.dimensions.height > 1080 || comment.file.dimensions.width > 1920}
                <br />
                <img
                  src={comment.file.url}
                  alt="file"
                  width="680"
                  height="420"
                />
              {:else}
                <br />
                <img src={comment.file.url} alt="file" />
              {/if}
              <!-- VIDEO #########################################################################3 -->
            {:else if comment.file.format === "mp4"}
              File:
              <a href={comment.file.url} download>{comment.file.filename}</a>
              ({sizeConverter(comment.file.size)})
              <br />
              <video controls>
                <source src={comment.file.url} type="video/mp4" />
                <track kind="captions" />
              </video>
            {/if}
          {/if}
        </div>
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
  @import "../../../style.css";
  #replies {
    color: #880000;
    text-decoration: none;
  }
</style>
