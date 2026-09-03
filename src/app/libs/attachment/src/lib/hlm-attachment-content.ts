import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: '[hlmAttachmentContent],hlm-attachment-content',
  host: { 'data-slot': 'attachment-content' },
})
export class HlmAttachmentContent {
  constructor() {
    classes(() => 'max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1');
  }
}
