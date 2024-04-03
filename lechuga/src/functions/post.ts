import { browser } from "$app/environment";
export async function postToDotorChan(baseURL: string, fileS3: string, board: string) {
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
const s3URL = "http://192.168.1.6:5000";

export async function handleFileUpload(
  files: FileList | null,
  browser: boolean
) {
  if (!files || files.length === 0) return;

  const file = files[0];
  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = async (e) => {
    if (e.target) {
      const avatar = e.target.result;
      if (typeof avatar === "string") {
        const imgData = avatar.split(",");
        const data = { image: imgData[1] };

        if (imgData[1].length > 20971520) {
          alert("File is too large, max size is 20MB");
          return;
        }

        const res = await fetch(s3URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: file.name,
            data: data["image"],
          }),
        });

        const s3Url = await res.json();
        if (browser) {
          document.getElementById("fileName")!.innerText = file.name;
        }
        return s3Url;
      }
    }
  };
}

