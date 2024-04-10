document.addEventListener("DOMContentLoaded", function () {
  const checkinId = getCookie("sessionToken"); // CookieからcheckinIdを取得

  // チェックイン/チェックアウトボタンを初期状態では非表示に設定
  const checkinButton = document.querySelector("button[onclick*='checkin']");
  const checkoutButton = document.querySelector("button[onclick*='checkout']");
  checkinButton.style.display = "none";
  checkoutButton.style.display = "none";

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

      // ローディングアニメーションを削除
      const spinner = document.querySelector(".loading-container");
      if (spinner) {
        spinner.remove();
      }

      // ユーザーが部屋にいるかどうかを表示し、対応するボタンを表示
      if (data.isUserInRoom) {
        document.getElementById("user-status").textContent =
          "あなたは現在部室にいます";
        checkoutButton.style.display = "block"; // ユーザーが部屋にいればチェックアウトボタンを表示
      } else {
        document.getElementById("user-status").textContent =
          "あなたは現在部室にいません";
        checkinButton.style.display = "block"; // ユーザーが部屋にいなければチェックインボタンを表示
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // エラーが発生した場合もローディングアニメーションを削除
      const spinner = document.querySelector(".spinner");
      if (spinner) {
        spinner.remove();
      }
    });
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
