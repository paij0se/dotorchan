import { writable, derived } from "svelte/store";
interface Post {
  comments: string[] | string
  user_id: string;
  post_id: string;
  content: string;
  title: string;
  created_at: string;
  file: {
    filename: string;
    dimensions: {
      width: number;
      height: number;
    };
    format: string;
    url: string;
    size: number;
  };
}
export const apiData = writable([]);

export const boardPosts = derived(apiData, ($apiData) => {
  return $apiData.map((post: Post) => post);
});

export function dateConverter(date: string) {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

/*
{#if post.file.size > 1024 && post.file.size < 1048576}
        <a href={post.file.url} download
          >{(post.file.size / 1024).toFixed(2)} KB</a
        >
      {:else if post.file.size > 1048576}
        <a href={post.file.url} download
          >{(post.file.size / 1048576).toFixed(2)} MB</a
        >
*/
export function sizeConverter(size: number) {
  if (size > 1024 && size < 1048576) {
    return (size / 1024).toFixed(2) + " KB";
  } else if (size > 1048576) {
    return (size / 1048576).toFixed(2) + " MB";
  } else {
    return size + " B";
  }
}
