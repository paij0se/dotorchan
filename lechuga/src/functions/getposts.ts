import { writable, derived } from "svelte/store";
interface CommentFile {
  filename: string;
  dimensions: {
    width: number;
    height: number;
  };
  format: string;
  url: string;
  size: number;
}
interface Comment {
  comment_id: string;
  content: string;
  created_at: string;
  user_id: string;
  file: CommentFile;
}
export interface Post {
  comments: Comment[];
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
export function safeTextWithLineBreaks(text: string) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML
    .replace(/\n/g, "<br />") // space lines
    .replace(/```(.*?)```/g, "<code>$1</code>") // code blocks
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // italic
    .replace(/__(.*?)__/g, "<u>$1</u>") // underline
    .replace(/~~(.*?)~~/g, "<del>$1</del>"); // strikethrough
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

export function sizeConverter(size: number) {
  if (size > 1024 && size < 1048576) {
    return (size / 1024).toFixed(2) + " KB";
  } else if (size > 1048576) {
    return (size / 1048576).toFixed(2) + " MB";
  } else {
    return size + " B";
  }
}
