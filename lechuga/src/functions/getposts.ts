import { writable, derived } from "svelte/store";
import { onMount } from "svelte";
import url from "../services.json";
import { checkWhatBoardIs } from "./post";

const baseURL = url["dotorchan-api"];

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
/**
 *
 * @param text
 * @returns text with line breaks
 * @description this function is used to convert text with line breaks to html
 */
export function safeTextWithLineBreaks(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return (
    div.innerHTML
      .replace(/\n/g, "<br />") // space lines
      // code block
      .replace(
        /```(.*?)```/g,
        `<pre style="background-color: #fff;"><code>$1</code></pre>`
      )
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // italic
      .replace(/__(.*?)__/g, "<u>$1</u>") // underline
      .replace(/~~(.*?)~~/g, "<del>$1</del>") // strikethrough
      // spoiler tag
      .replace(
        /\|\|(.*?)\|\|/g,
        `<span style="background-color: black; color: black;" onmouseover="this.style.color=''; this.style.backgroundColor='';" onmouseout="this.style.color='black'; this.style.backgroundColor='black';" >$1</span>`
      )
  );
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
export function RandomBanner(): string {
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
export function sizeConverter(size: number) {
  if (size > 1024 && size < 1048576) {
    return (size / 1024).toFixed(2) + " KB";
  } else if (size > 1048576) {
    return (size / 1048576).toFixed(2) + " MB";
  } else {
    return size + " B";
  }
}
export function GetPosts() {
  onMount(async () => {
    fetch(baseURL + checkWhatBoardIs())
      .then((response) => response.json())
      .then((data): ReturnType<() => void> => {
        apiData.set(data);
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  });
}
