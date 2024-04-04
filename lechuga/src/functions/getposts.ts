import { writable, derived } from "svelte/store";

interface Post {
  message_id: string;
  user_id: string;
  content: string;
  created_at: string;
  file: {
    filename: string;
    dimensions: {
      width: number;
      height: number;
    }
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
export function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
