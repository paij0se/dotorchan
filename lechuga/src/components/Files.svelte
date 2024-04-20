<script lang="ts">
  import {
    boardPosts,
    dateConverter,
    sizeConverter,
    safeTextWithLineBreaks,
  } from "../functions/getposts";
  import { checkWhatBoardIs } from "../functions/post";
</script>

{#each $boardPosts as post}
  <span>
    {#if post.title}
      <span id="title-post">{post.title}</span>
    {/if}
    <span id="anon">Anonymous @{post.user_id}</span>
    {dateConverter(post.created_at)}
    No. {post.post_id}
    [<a href={`/boards/${checkWhatBoardIs()}/thread?id=` + post.post_id}
      >Reply</a
    >]
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

  <!-- Comments ############################################################################ -->
  {#if post.comments}
    {#each post.comments as comment}
      <p id="separator">>></p>
      <div class="comment">
        <span>
          <span id="anon">Anonymous @{comment.user_id}</span>
          {dateConverter(comment.created_at)}
          No.
          <a
            id="replies"
            title="Reply to this post"
            href={`/boards/${checkWhatBoardIs()}/thread?id=` + post.post_id}
            >{comment.comment_id}</a
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

<style>
  @import "../style.css";
</style>
