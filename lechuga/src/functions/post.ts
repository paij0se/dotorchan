export interface PostToS3 {
  filename: string;
  format: string;
  size: number;
  url: string;
}
export function postReply(baseURL: string, board: string) {
  const urlParams = new URLSearchParams(window.location.search);
  const threadID = urlParams.get("id");
  const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
  if (textarea.value.trim() == "" || textarea.value.length < 1) {
    alert("Content can't be empty");
    window.location.reload();
    return;
  }
  if (textarea.value.length > 200) {
    alert("Content is too long");
    window.location.reload();
    return;
  }
  const postBtn = document.getElementById("post-btn") as HTMLButtonElement;
  postBtn.disabled = true;
  const data = {
    content: textarea.value,
  };
  fetch(`${baseURL}${board}/${threadID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
export async function postToDotorChan(
  baseURL: string,
  fileS3: string,
  board: string,
  captchaUrl: string
) {
  const contentTextarea = document.querySelector("textarea")!;
  const content = contentTextarea.value;
  const title = document.getElementById("title") as HTMLInputElement;
  const postButton1 = document.getElementById("post-btn") as HTMLButtonElement;
  if (content.trim() === "") {
    alert("Content can't be empty");
    location.reload();
    return;
  }

  if (content.length > 8000 || content.length < 1) {
    alert("Content is too long or too short");
    location.reload();
    return;
  }
  // get the captcha http://192.168.1.6:5000/captcha
  (document.getElementById("captcha") as HTMLImageElement).src = captchaUrl;
  // set the width and height of the captcha
  (document.getElementById("captcha") as HTMLImageElement).width = 400;
  (document.getElementById("captcha") as HTMLImageElement).height = 150;
  const postButton = document.getElementById("verify") as HTMLButtonElement;
  postButton1.remove();
  postButton.innerText = "post";
  postButton.style.backgroundColor = "#898f9c";
  postButton.style.color = "white";
  postButton.onclick = () => {
    const captchaInput = document.getElementById(
      "captcha-input"
    ) as HTMLInputElement;
    const captchaValue = captchaInput.value;
    console.log(captchaValue);
    if (captchaValue.length < 6) {
      alert("Captcha is too short");
      return;
    }
    if (captchaValue.trim() === "") {
      alert("Captcha can't be empty");
      return;
    }
    fetch(captchaUrl + `/verify?text=${captchaValue}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        if (data == false) {
          alert("Captcha is incorrect");
          location.reload();
        } else {
          const postToDotorChan = await fetch(baseURL + board, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: title.value,
              content: content,
              file: fileS3,
            }),
          });

          const re = await postToDotorChan.json();
          // save the user id to local storage
          localStorage.setItem("user_id", re.user_id);
          location.reload();
        }
      });
  };
}
