# 日常清單｜個人行程與任務管理

以原生 HTML、CSS、JavaScript 製作的繁體中文靜態個人行程面板。不使用框架、外部 API、登入、資料庫或 API Key。

## 本機開啟

直接以瀏覽器開啟 `index.html` 即可，不需安裝相依套件或啟動伺服器。新增行程與勾選待辦的變更僅存在目前頁面記憶體；重新整理後會回到預設內容，不會寫入資料庫或瀏覽器儲存空間。

## 發佈到 GitHub Pages

1. 將本專案的 `index.html`、`styles.css`、`script.js`、`README.md` 推送到 `yingchen921102-max/1016` repository 的預設分支（通常為 `main`）。請勿提交密碼、API Key 或其他機密。
2. 在 GitHub 開啟該 repository 的 **Settings → Pages**。
3. 在 **Build and deployment** 選擇 **Deploy from a branch**，將 branch 設為 `main`（或實際存放網站檔案的預設分支）、資料夾選 `/ (root)`，按 **Save**。
4. 等 Pages 部署完成後，網址預期為 <https://yingchen921102-max.github.io/1016/>。可於 Pages 設定頁確認實際部署狀態與網址。

網站入口位於 repository 根目錄的 `index.html`，CSS 與 JavaScript 皆使用相對路徑，可在 GitHub Pages 的專案子路徑中載入。
