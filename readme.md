260705_1821  

# メモ

## ファイル改変後の適用法
【norm-style側】  
1. cmdを開く
2. 「_Project\norm-style\dashboard」で npm run build
3. VSCodeターミナルから，git add → commit → push  
【norm側】  
4. cmdを開く
5. npx quartz plugin remove norm-dashboard で一度プラグインを削除しておく
6. npx quartz plugin install --from-config で再度プラグインをインストール（quartz.config.yamlファイルのplugins:部分が参照される）
7. _Obsidian\norm\.quartz\plugins\norm-dashboard\dist\components\styles\normDashboard.scss を確認し，今回追加したクラス名が含まれているか確認（最新のリポジトリが取り込まれているかどうか）
8. npx quartz build -d . --serve でローカルビルドし確認（http://localhost:8080）
9. VSCodeターミナルから，git add → commit → push  

## 操作するファイル
- index.mdに挿入される要素：_Project\norm-style\dashboard\src\components\NormDashboard.tsx
- ↑のスタイル：_Project\norm-style\dashboard\src\components\styles\normDashboard.scss
- ↑の関連処理：_Project\norm-style\dashboard\src\components\scripts\normDashboard.inline.ts