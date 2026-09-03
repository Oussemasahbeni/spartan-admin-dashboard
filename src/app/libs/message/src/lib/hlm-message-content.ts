import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: '[hlmMessageContent],hlm-message-content',
  host: { 'data-slot': 'message-content' },
})
export class HlmMessageContent {
  constructor() {
    classes(
      () => 'flex w-full min-w-0 flex-col gap-2.5 wrap-break-word group-data-[align=end]/message:*:data-slot:self-end'
    );
  }
}
