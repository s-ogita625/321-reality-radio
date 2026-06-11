import { Fragment } from "react";
import { loadDefaultJapaneseParser } from "budoux";

const parser = loadDefaultJapaneseParser();

/**
 * 日本語を文節単位で改行する。
 * BudouX で文節に分割し、境界に <wbr>（改行候補）を挿入。
 * word-break:keep-all と組み合わせることで、文節の途中では改行されず
 * 読みやすい位置でのみ折り返す（iOS Safari 等も含め全ブラウザ対応）。
 *
 * 改行(\n\n)を含む文章は段落ごとに分けて描画。
 */
export function JpText({
  text,
  className = "",
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  as?: "p" | "span" | "div";
}) {
  const paragraphs = text.split(/\n\n+/);
  return (
    <Tag className={className} style={{ wordBreak: "keep-all", overflowWrap: "anywhere" }}>
      {paragraphs.map((para, pi) => {
        const phrases = parser.parse(para);
        return (
          <Fragment key={pi}>
            {pi > 0 && (
              <>
                <br />
                <br />
              </>
            )}
            {phrases.map((phrase, i) => (
              <Fragment key={i}>
                {phrase}
                {i < phrases.length - 1 && <wbr />}
              </Fragment>
            ))}
          </Fragment>
        );
      })}
    </Tag>
  );
}
