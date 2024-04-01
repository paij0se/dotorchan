import { browser } from "$app/environment";
const url = "http://192.168.1.6:8080/api/v1/";
interface Post {
  message_id: string;
  user_id: string;
  content: string;
  created_at: string;
  id: number;
  file: {
    filename: string;
    url: string;
    size: number;
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
function getPosts(board: string) {
  fetch(`${url}${board}`)
    .then((res) => res.json())
    .then((data) => {
      if (browser) {
        for (let i = 0; i < data.length; i++) {
          var objs: Post = data[i];

          document.getElementById("output")!.innerHTML +=
            `<hr>` + `<p>${escapeHtml(objs.content)}<p>`;
          // If the post has a file, display it
          if (objs.file.url) {
            const fileType = objs.file.filename.split(".").pop();
            const size = objs.file.size; // Bytes
            switch (fileType) {
              case "mp4":
                if (size > 10485760) {
                  document.getElementById(
                    "output"
                  )!.innerHTML += `<a href="${objs.file.url}">${objs.file.filename}</a>`;
                  document.getElementById("output")!.innerHTML += `<p>${(
                    size / 1048576
                  ).toFixed(2)} MB</p>`;
                } else {
                  document.getElementById("output")!.innerHTML +=
                    `<video width="600" height="400" controls>` +
                    `<source src="${objs.file.url}" type="video/mp4">` +
                    `Your browser does not support the video tag.` +
                    `</video>`;
                }
                break;
              case "png":
                document.getElementById(
                  "output"
                )!.innerHTML += `<img src="${objs.file.url}" width=600 height=400 alt="image">`;
                break;
              case "webp":
                document.getElementById(
                  "output"
                )!.innerHTML += `<img src="${objs.file.url}" width=600 height=400 alt="image">`;
                break;
              case "jpg":
                document.getElementById(
                  "output"
                )!.innerHTML += `<img src="${objs.file.url}" width=600 height=400 alt="image">`;
                break;
              case "jpeg":
                document.getElementById(
                  "output"
                )!.innerHTML += `<img src="${objs.file.url}" width=600 height=400 alt="image">`;
                break;
              case "gif":
                document.getElementById(
                  "output"
                )!.innerHTML += `<img src="${objs.file.url}" width=600 height=400 alt="image">`;
                break;
              case "mp3":
                document.getElementById("output")!.innerHTML +=
                  `<audio controls>` +
                  `<source src="${objs.file.url}" type="audio/mpeg">` +
                  `Your browser does not support the audio tag.` +
                  `</audio>`;
                break;
              /*
              case "py":
                // TODO: Add a code block
                break;
                */
              default:
                document.getElementById(
                  "output"
                )!.innerHTML += `<a href="${objs.file.url}">${objs.file.filename}</a>`;

                if (size > 1024 && size < 1048576) {
                  document.getElementById("output")!.innerHTML += `<p>${(
                    size / 1024
                  ).toFixed(2)} KB</p>`;
                } else if (size > 1048576) {
                  document.getElementById("output")!.innerHTML += `<p>${(
                    size / 1048576
                  ).toFixed(2)} MB</p>`;
                } else if (size < 1024) {
                  document.getElementById(
                    "output"
                  )!.innerHTML += `<p>${size} B</p>`;
                }
                break;
            }
          }
          document.getElementById("output")!.innerHTML +=
            `<details>` +
            `<summary>More</summary>` +
            `<b><p>@${objs.user_id}</p></b>` +
            `<p>${dateConverter(objs.created_at)}</p>` +
            `<p>${objs.message_id}</p>` +
            `</details>`;
        }
      }
    });
}

export { getPosts };
