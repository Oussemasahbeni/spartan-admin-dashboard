import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: '[hlmInputGroupText],hlm-input-group-text',
})
export class HlmInputGroupText {
  constructor() {
    classes(
      () =>
        "text-muted-foreground flex items-center gap-2 text-sm [&_ng-icon]:pointer-events-none [&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)]"
    );
  }
}
