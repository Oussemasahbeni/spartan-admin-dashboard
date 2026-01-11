import { type BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuItemCheckbox } from '@angular/cdk/menu';
import { Directive, booleanAttribute, computed, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmDropdownMenuCheckbox]',
  hostDirectives: [
    {
      directive: CdkMenuItemCheckbox,
      inputs: ['cdkMenuItemDisabled: disabled', 'cdkMenuItemChecked: checked'],
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
  ],
  host: {
    'data-slot': 'dropdown-menu-checkbox-item',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-checked]': 'checked() ? "" : null',
    '[attr.data-align]': 'checkBoxAlign()',
    '[class]': '_computedClass()',
  },
})
export class HlmDropdownMenuCheckbox {
  private readonly _cdkMenuItem = inject(CdkMenuItemCheckbox);

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground group relative flex w-full cursor-default items-center rounded-sm py-1.5 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'data-[align=start]:ps-8 data-[align=start]:pe-2',
      'data-[align=end]:pe-8 data-[align=end]:ps-2 data-[align=end]:[&>hlm-dropdown-menu-checkbox-indicator]:start-auto data-[align=end]:[&>hlm-dropdown-menu-checkbox-indicator]:end-2',
      this.userClass()
    )
  );

  public readonly checked = input<boolean, BooleanInput>(this._cdkMenuItem.checked, { transform: booleanAttribute });
  public readonly disabled = input<boolean, BooleanInput>(this._cdkMenuItem.disabled, { transform: booleanAttribute });
  public readonly checkBoxAlign = input<'start' | 'end'>('start');
}
