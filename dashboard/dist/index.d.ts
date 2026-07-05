import { QuartzComponent } from '@quartz-community/types';
export { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps, StringResource } from '@quartz-community/types';

interface NormDashboardOptions {
    className?: string;
}
declare const _default: (opts?: NormDashboardOptions) => QuartzComponent;

export { _default as NormDashboard, type NormDashboardOptions };
