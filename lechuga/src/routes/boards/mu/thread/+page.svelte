<script lang="ts">
  import { PostReplyIdk, checkWhatBoardIs } from "../../../../functions/post";
  import Files from "../../../../components/Files.svelte";
  import PostReply from "../../../../components/PostReply.svelte";
  import Footer from "../../../../components/Footer.svelte";
  PostReplyIdk();
</script>

<svelte:head>
  <style>
    @import url("https://fonts.cdnfonts.com/css/gg-sans-2");
  </style>
</svelte:head>
[<a href="/boards/{checkWhatBoardIs()}">Back</a>]
<PostReply />
<hr />
<Files />
<Footer />

<style>
  @import "../../../../style-replies.css";
</style>
