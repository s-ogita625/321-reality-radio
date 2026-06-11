import { Fragment } from "react";
import { loadDefaultJapaneseParser } from "budoux";

const parser = loadDefaultJapaneseParser();

/**
 * 日本語を読みやすく改行する。
 * - 文中の改行「\n」は強制改行(<br>)として扱い、指定どおりの行で表示（スマホ/PC統一）。
 * - 空行(\n\n)は段落間のスペースになる。
 * - 各行の中は BudouX で文節に分割し <wbr> を挿入。word-break:keep-all と
 *   組み合わせ、行が幅に収まらない場合のみ文節境界で折り返す（語の途中で切れない）。
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
  const lines = text.split("\n");
  return (
    <Tag className={className} style={{ wordBreak: "keep-all", overflowWrap: "anywhere" }}>
      {lines.map((line, li) => {
        const phrases = line ? parser.parse(line) : [];
        return (
          <Fragment key={li}>
            {li > 0 && <br />}
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
