import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideGauge, lucidePalette, lucidePanelsTopLeft } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';

export interface PromptSuggestion {
  labelKey: string;
  promptKey: string;
  icon?: string;
}

@Component({
  selector: 'adm-prompt-suggestions',
  imports: [HlmButtonImports, HlmIconImports, TranslocoModule],
  templateUrl: './prompt-suggestions.html',
  providers: [provideIcons({ lucidePanelsTopLeft, lucidePalette, lucideGauge })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptSuggestions {
  readonly suggestionSelected = output<string>();

  readonly suggestions = signal<PromptSuggestion[]>([
    {
      icon: 'lucidePanelsTopLeft',
      labelKey: 'promptSuggestions.explainComponents.label',
      promptKey: 'promptSuggestions.explainComponents.prompt',
    },
    {
      icon: 'lucidePalette',
      labelKey: 'promptSuggestions.customizeStyling.label',
      promptKey: 'promptSuggestions.customizeStyling.prompt',
    },
    {
      icon: 'lucideGauge',
      labelKey: 'promptSuggestions.performanceTips.label',
      promptKey: 'promptSuggestions.performanceTips.prompt',
    },
  ]);

  handleClick(prompt: string): void {
    this.suggestionSelected.emit(prompt);
  }
}
