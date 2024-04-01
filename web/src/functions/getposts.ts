import { browser } from "$app/environment";
const url = "http://192.168.1.6:8080/api/v1/g";
interface Post {
  anon_id: string;
  content: string;
  created_at: string;
  id: number;
  file: {
    url: string;
  };
}

function dateConverter(date: string) {
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
function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function getPosts() {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (browser) {
        for (let i = 0; i < data.length; i++) {
          var objs: Post = data[i];
          if (objs.file.url) {
            const fileType = objs.file.url.split(".").pop();
            switch (fileType) {
              case "mp4":
                document.getElementById("output")!.innerHTML +=
                  `<video width="400" height="400" controls>` +
                  `<source src="${objs.file.url}" type="video/mp4">` +
                  `Your browser does not support the video tag.` +
                  `</video>`;
                break;
              default:
                document.getElementById(
                  "output"
                )!.innerHTML += `<img src="${objs.file.url}" alt="image" width="400" height="400">`;
                break;
            }
          }
          document.getElementById("output")!.innerHTML +=
            `<p>${escapeHtml(objs.content)}<p>` +
            `<details>` +
            `<summary>More</summary>` +
            `<b><p>@${objs.anon_id}</p></b>` +
            `<p>${dateConverter(objs.created_at)}</p>` +
            `<p>${objs.id}</p>` +
            `</details>` +
            `<hr>`;
        }
      }
    });
}

export { getPosts };
