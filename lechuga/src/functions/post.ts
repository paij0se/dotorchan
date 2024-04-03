import { browser } from "$app/environment";
export async function postToDotorChan(
  baseURL: string,
  fileS3: string,
  board: string
) {
  const contentTextarea = document.querySelector("textarea")!;
  const content = contentTextarea.value;

  if (content.trim() === "") {
    alert("Content can't be empty");
    return;
  }

  if (content.length > 8000 || content.length < 1) {
    alert("Content is too long or too short");
    return;
  }

  if (browser) {
    console.log(document.cookie);
    await fetch(baseURL + board, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content,
        file: fileS3,
      }),
    });

    location.reload();
  }
}
