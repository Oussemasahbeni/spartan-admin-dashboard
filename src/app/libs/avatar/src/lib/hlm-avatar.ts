import { Directive, input } from '@angular/core';
import { BrnAvatar } from '@spartan-ng/brain/avatar';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: '[hlmAvatar],hlm-avatar',
  exportAs: 'hlmAvatar',
  hostDirectives: [BrnAvatar],
  host: {
    'data-slot': 'avatar',
    '[attr.data-size]': 'size()',
  },
})
export class HlmAvatar {
  public readonly size = input<'default' | 'sm' | 'lg'>('default');

  constructor() {
    classes(
      () =>
        'group/avatar after:border-border relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten'
    );
  }
}
