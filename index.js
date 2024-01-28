document.addEventListener("DOMContentLoaded", function () {
  const checkinId = getCookie("sessionToken"); // CookieからcheckinIdを取得

  fetch(
    "https://script.google.com/macros/s/AKfycbyULbKzai6KYhNbPm9uQbwin3ylgMvzvxS-MhZsUCcaPRI0MJickCsS7Eb9rI0fizuF/exec" +
      "?checkinId=" +
      checkinId
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.getElementById("counter").textContent = data.count
        ? `部室に${data.count}人います`
        : "部室に人は居ません";

      // ユーザーが部屋にいるかどうかを表示
      if (data.isUserInRoom) {
        document.getElementById("user-status").textContent =
          "あなたは現在部室にいます";
      } else {
        document.getElementById("user-status").textContent =
          "あなたは現在部室にいません";
      }
    })
    .catch((error) => console.error("Error:", error));
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
