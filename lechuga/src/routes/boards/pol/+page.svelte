<script lang="ts">
  import { GetPosts } from "../../../functions/getposts";
  import Files from "../../../components/Files.svelte";
  import Post from "../../../components/Post.svelte";
  import Footer from "../../../components/Footer.svelte";
  GetPosts();
</script>

<svelte:head>
  <style>
    @import url("https://fonts.cdnfonts.com/css/gg-sans-2");
  </style>
</svelte:head>
[<a href="/">Home</a>]
<Post />
<hr />
<Files />
<Footer />

<style>
  @import "../../../style.css";
</style>
