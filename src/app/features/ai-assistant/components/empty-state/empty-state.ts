import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideBookOpen, lucidePalette, lucidePlug, lucideZap } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmIconImports } from '@spartan-ng/helm/icon';

/**
 * Suggested prompt interface
 */
interface SuggestedPrompt {
  icon: string;
  titleKey: string;
  promptKey: string;
}

@Component({
  selector: 'adm-assistant-empty-state',
  templateUrl: './empty-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideBookOpen,
      lucidePalette,
      lucideZap,
      lucidePlug,
    }),
  ],
  imports: [HlmEmptyImports, HlmCardImports, HlmIconImports, NgOptimizedImage, TranslocoModule],
})
export class AssistantEmptyState {
  readonly promptSelect = output<string>();

  readonly suggestedPrompts = signal<SuggestedPrompt[]>([
    {
      icon: 'lucideBookOpen',
      titleKey: 'suggestions.explainComponents.title',
      promptKey: 'suggestions.explainComponents.prompt',
    },
    {
      icon: 'lucidePalette',
      titleKey: 'suggestions.customizeStyling.title',
      promptKey: 'suggestions.customizeStyling.prompt',
    },
    {
      icon: 'lucideZap',
      titleKey: 'suggestions.performanceTips.title',
      promptKey: 'suggestions.performanceTips.prompt',
    },
    {
      icon: 'lucidePlug',
      titleKey: 'suggestions.integrationGuide.title',
      promptKey: 'suggestions.integrationGuide.prompt',
    },
  ]);

  handlePromptClick(prompt: string): void {
    this.promptSelect.emit(prompt);
  }
}
