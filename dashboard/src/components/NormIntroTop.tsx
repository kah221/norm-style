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
  const { className = "norm-intro-top" } = opts ?? {};

  const Component: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const slug = (fileData.slug as string) ?? "";
    if (!isTopPage(slug)) {
      return null;
    }

    return (
      <details class={classNames(displayClass, className)}>
        <summary>このページについて</summary>
        <IntroBody />
      </details>
    );
  };

  Component.css = style;
  return Component;
}) satisfies QuartzComponentConstructor;