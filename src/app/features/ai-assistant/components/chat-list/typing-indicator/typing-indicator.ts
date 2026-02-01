import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
  selector: 'adm-typing-indicator',
  templateUrl: './typing-indicator.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmAvatarImports],
  host: {
    '[attr.role]': '"status"',
    '[attr.aria-label]': '"AI is typing"',
  },
})
export class TypingIndicator {
  // ==========================================
  // Inputs
  // ==========================================

  readonly dotCount = input<number>(3);
  readonly animation = input<'shimmer' | 'wave'>('shimmer');

  // ==========================================
  // State
  // ==========================================

  readonly dots = computed(() => {
    return Array.from({ length: this.dotCount() }, (_, i) => i);
  });

  // ==========================================
  // Public Methods
  // ==========================================

  /** Get animation delay for each dot */
  getDotDelay(index: number): string {
    return `${index * 0.2}s`;
  }
}
