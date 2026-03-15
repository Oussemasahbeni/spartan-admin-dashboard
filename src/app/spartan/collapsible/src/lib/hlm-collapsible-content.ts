import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnCollapsibleContent } from '@spartan-ng/brain/collapsible';

@Component({
  selector: '[hlmCollapsibleContent],hlm-collapsible-content',
  hostDirectives: [{ directive: BrnCollapsibleContent, inputs: ['id'] }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-0 overflow-hidden">
      <ng-content />
    </div>
  `,
  host: {
    'data-slot': 'collapsible-content',
    class: ' data-[state=closed]:grid-rows-[0fr]',
  },
})
export class HlmCollapsibleContent {}
