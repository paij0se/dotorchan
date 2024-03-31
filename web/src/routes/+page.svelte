<script lang="ts">
  const url = "http://localhost:8080/api/v1/g";
  import { browser } from "$app/environment";
  interface Post {
    anon_id: string;
    content: string;
    created_at: string;
    id: number;
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
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (browser) {
        for (let i = 0; i < data.length; i++) {
          var objs: Post = data[i];
          document.getElementById("output")!.innerHTML +=
            `<p>${escapeHtml(objs.content)}<p>` +
            `<details>` +
            `<summary>More</summary>` +
            `<b><p>@${objs.anon_id}</p></b>` +
            `<p>${dateConverter(objs.created_at)}</p>` +
            `<p>${objs.id}</p>` +
            `</details>`+
            `<hr>`;
        }
      }
    });
</script>

<div id="output"></div>

<style>
  :global(body) {
    background-color: #313338;
    color: #dbdee1;
    transition: background-color 0.3s;
  }
  #output {
    margin: 0 auto;
    width: 80%;
    max-width: 800px;
    font-size: 1.5rem;
  }
</style>
