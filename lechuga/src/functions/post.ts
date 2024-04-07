import { browser } from "$app/environment";
export async function postToDotorChan(
  baseURL: string,
  fileS3: string,
  board: string
) {
  const captchaUrl = "http://192.168.1.6:5000/captcha";
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
  // get the captcha http://192.168.1.6:5000/captcha
  (document.getElementById("captcha") as HTMLImageElement).src = captchaUrl;
  const postButton = document.getElementById("verify") as HTMLButtonElement;
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
      .then((data) => {
        console.log(data);
        if (data == false) {
          alert("Captcha is incorrect");
          location.reload();
        } else {
          fetch(baseURL + board, {
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
      });
  };
}
