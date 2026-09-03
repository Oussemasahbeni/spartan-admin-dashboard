import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: '[hlmBubbleContent],hlm-bubble-content',
  host: { 'data-slot': 'bubble-content' },
})
export class HlmBubbleContent {
  constructor() {
    classes(
      () =>
        '[button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-ring/50 w-fit max-w-full min-w-0 overflow-hidden rounded-xl border border-transparent px-3 py-2 text-sm leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end [button]:text-start [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:ring-3'
    );
  }
}
