export function isTopPage(slug: string): boolean {
  return slug === "index" || slug.endsWith("/index") || slug.startsWith("tags/") || slug === "tags";
}

export function IntroBody() {
  return (
    <p>
      単語の意味と相互関係の理解のための個人用ドキュメント<br />
      手元の板書等からピックアップまたは新たに知った単語を調べ，1ページ1単語にまとめていきます．
    </p>
  );
}