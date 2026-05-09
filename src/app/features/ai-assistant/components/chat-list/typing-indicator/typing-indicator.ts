import { ChangeDetectionStrategy, Component, computed, input, numberAttribute } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
  selector: 'adm-typing-indicator',
  templateUrl: './typing-indicator.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmAvatarImports],
  styles: `
    .typing-dot-wave {
      animation: typing-wave 1s infinite ease-in-out;
    }

    @keyframes typing-wave {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-4px);
      }
    }

    .typing-dot {
      animation: typing-bounce 1.4s infinite ease-in-out both;
    }

    @keyframes typing-bounce {
      0%,
      80%,
      100% {
        transform: scale(0.6);
        opacity: 0.4;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,
  host: {
    '[attr.role]': '"status"',
    '[aria-label]': '"AI is typing"',
  },
})
export class TypingIndicator {
  // ==========================================
  // Inputs
  // ==========================================

  public readonly dotCount = input(3, { transform: numberAttribute });
  public readonly animation = input<'shimmer' | 'wave'>('shimmer');

  // ==========================================
  // State
  // ==========================================

  public readonly dots = computed(() => {
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
