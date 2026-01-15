import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideBot } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
  selector: 'adm-typing-indicator',
  templateUrl: './typing-indicator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmAvatarImports, HlmIconImports],
  providers: [provideIcons({ lucideBot })],
  host: {
    '[attr.role]': '"status"',
    '[attr.aria-label]': '"AI is typing"',
  },
})
export class TypingIndicatorComponent {
  readonly dotCount = input<number>(3);
  readonly showBackground = input<boolean>(true);
  readonly animation = input<'shimmer' | 'wave'>('shimmer');

  readonly dots = computed(() => {
    return Array.from({ length: this.dotCount() }, (_, i) => i);
  });

  /** Get animation delay for each dot */
  getDotDelay(index: number): string {
    return `${index * 0.2}s`;
  }
}
