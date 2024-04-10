document.addEventListener("DOMContentLoaded", function () {
  const checkinId = getCookie("sessionToken"); // CookieからcheckinIdを取得

  // チェックイン/チェックアウトボタンを初期状態では非表示に設定
  const checkinButton = document.querySelector("button[onclick*='checkin']");
  const checkoutButton = document.querySelector("button[onclick*='checkout']");
  checkinButton.style.display = "none";
  checkoutButton.style.display = "none";

  // URLからクエリパラメータを取得する
  const params = new URLSearchParams(window.location.search);
  const action = params.get("action");

  // URLからクエリパラメータを削除
  if (window.location.search) {
    const urlWithoutParams = window.location.pathname;
    window.history.replaceState({}, document.title, urlWithoutParams);
  }

  fetch(
    "https://script.google.com/macros/s/AKfycbyULbKzai6KYhNbPm9uQbwin3ylgMvzvxS-MhZsUCcaPRI0MJickCsS7Eb9rI0fizuF/exec" +
      "?checkinId=" +
      checkinId
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log("action:", action);

      // 入室/退室時は人数と入室確認をごまかす
      // GASの実行がとても遅いため、マクロの実行完了を待たずリダイレクトしている
      if (action === "checkin") {
        data.count += 1;
        data.isUserInRoom = true;
      } else if (action === "checkout") {
        data.count -= 1;
        data.isUserInRoom = false;
      }

      document.getElementById("counter").textContent =
        data.count > 0 ? `部室に${data.count}人います` : "部室に人は居ません";

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
