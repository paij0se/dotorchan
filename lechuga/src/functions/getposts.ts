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
  const files: string[] = [
    "1.png",
    "10.jpg",
    "100.png",
    "101.png",
    "102.jpg",
    "103.jpg",
    "104.jpg",
    "105.jpg",
    "106.jpg",
    "107.gif",
    "108.jpg",
    "109.jpg",
    "11.jpg",
    "110.gif",
    "111.gif",
    "112.png",
    "113.jpg",
    "114.png",
    "115.png",
    "116.jpg",
    "117.png",
    "118.jpg",
    "119.jpg",
    "12.png",
    "120.gif",
    "121.png",
    "122.png",
    "123.gif",
    "124.png",
    "125.png",
    "126.png",
    "127.png",
    "128.jpg",
    "129.png",
    "13.jpg",
    "130.gif",
    "131.png",
    "132.png",
    "133.png",
    "134.jpg",
    "135.jpg",
    "136.png",
    "137.png",
    "138.png",
    "139.jpg",
    "14.gif",
    "140.jpg",
    "141.jpg",
    "142.jpg",
    "143.gif",
    "144.jpg",
    "145.png",
    "146.png",
    "147.jpg",
    "148.jpg",
    "149.png",
    "15.gif",
    "150.jpg",
    "151.gif",
    "152.jpg",
    "153.jpg",
    "154.png",
    "155.jpg",
    "156.png",
    "157.jpg",
    "158.jpg",
    "159.jpg",
    "16.jpg",
    "160.jpg",
    "161.png",
    "162.gif",
    "163.jpg",
    "164.jpg",
    "165.jpg",
    "166.jpg",
    "167.jpg",
    "168.jpg",
    "169.jpg",
    "17.png",
    "170.jpg",
    "171.jpg",
    "172.png",
    "173.jpg",
    "174.jpg",
    "175.jpg",
    "176.jpg",
    "177.jpg",
    "178.jpg",
    "179.jpg",
    "18.jpg",
    "180.jpg",
    "181.jpg",
    "182.jpg",
    "183.gif",
    "184.jpg",
    "185.png",
    "186.png",
    "187.png",
    "188.png",
    "189.jpg",
    "19.jpg",
    "190.jpg",
    "191.png",
    "192.jpg",
    "193.gif",
    "194.jpg",
    "195.png",
    "196.jpg",
    "197.gif",
    "198.jpg",
    "199.gif",
    "2.jpg",
    "20.jpg",
    "200.jpg",
    "201.gif",
    "202.jpg",
    "203.jpg",
    "204.jpg",
    "205.jpg",
    "206.jpg",
    "207.png",
    "208.jpg",
    "209.jpg",
    "21.png",
    "210.jpg",
    "211.jpg",
    "212.gif",
    "213.gif",
    "214.png",
    "215.jpg",
    "216.png",
    "217.png",
    "218.png",
    "219.gif",
    "22.gif",
    "220.png",
    "221.gif",
    "222.gif",
    "223.jpg",
    "224.png",
    "225.gif",
    "226.gif",
    "227.gif",
    "228.gif",
    "229.gif",
    "23.gif",
    "230.gif",
    "231.gif",
    "232.jpg",
    "233.jpg",
    "234.gif",
    "235.gif",
    "236.gif",
    "237.jpg",
    "238.gif",
    "239.gif",
    "24.jpg",
    "240.gif",
    "241.gif",
    "242.png",
    "243.jpg",
    "244.gif",
    "25.jpg",
    "26.png",
    "27.jpg",
    "28.gif",
    "29.png",
    "3.png",
    "30.png",
    "31.jpg",
    "32.png",
    "33.png",
    "34.png",
    "35.png",
    "36.gif",
    "37.png",
    "38.png",
    "39.png",
    "4.jpg",
    "40.gif",
    "41.png",
    "42.gif",
    "43.jpg",
    "44.png",
    "45.gif",
    "46.jpg",
    "47.gif",
    "48.jpg",
    "49.png",
    "5.jpg",
    "50.png",
    "51.gif",
    "52.jpg",
    "53.jpg",
    "54.jpg",
    "55.jpg",
    "56.gif",
    "57.png",
    "58.jpg",
    "59.png",
    "6.jpg",
    "60.gif",
    "61.png",
    "62.gif",
    "63.png",
    "64.png",
    "65.png",
    "66.jpg",
  ];
  for (let i = 0; i < files.length; i++) {
    images.push(`https://dotorchan.s3.amazonaws.com/static+files/4chan+baners/${files[i]}`);
  }
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
