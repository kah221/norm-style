import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";
import { classNames } from "../util/lang";
import style from "./styles/normIntro.scss";
import { isTopPage, IntroBody } from "./shared/introContent";

export interface NormIntroOptions {
  className?: string;
}

export default ((opts?: NormIntroOptions) => {
  const { className = "norm-intro-bottom" } = opts ?? {};

  const Component: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const slug = (fileData.slug as string) ?? "";
    if (isTopPage(slug)) {
      return null;
    }

    return (
      <div class={classNames(displayClass, className)}>
        <details>
          <summary>このページについて</summary>
          <IntroBody />
        </details>
        <ul class="norm-intro-credit">
          <li>
            制作：<a href="http://discordapp.com/users/473663926538600448">kah221</a>
          </li>
          <li>
            GitHub：<a href="https://github.com/kah221/norm">norm</a>，<a href="https://github.com/kah221/norm-style">norm-style</a>
          </li>
        </ul>
      </div>
    );
  };

  Component.css = style;
  return Component;
}) satisfies QuartzComponentConstructor;