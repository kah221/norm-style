import { QuartzComponent } from '@quartz-community/types';
export { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps, StringResource } from '@quartz-community/types';

interface NormDashboardOptions {
    className?: string;
}
declare const _default$1: (opts?: NormDashboardOptions) => QuartzComponent;

interface NormIntroOptions {
    className?: string;
}
declare const _default: (opts?: NormIntroOptions) => QuartzComponent;

export { _default$1 as NormDashboard, type NormDashboardOptions, _default as NormIntro, type NormIntroOptions };
