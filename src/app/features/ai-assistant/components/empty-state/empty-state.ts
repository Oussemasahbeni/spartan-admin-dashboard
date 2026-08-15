import { NgOptimizedImage } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookOpen, lucidePalette, lucidePlug, lucideZap } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';

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
  providers: [
    provideIcons({
      lucideBookOpen,
      lucidePalette,
      lucideZap,
      lucidePlug,
    }),
  ],
  imports: [HlmEmptyImports, HlmCardImports, NgIcon, NgOptimizedImage, TranslocoModule],
  template: `
    <div *transloco="let t; prefix: 'aiAssistant.emptyState'" hlmEmpty>
      <div hlmEmptyHeader>
        <div hlmEmptyMedia variant="default">
          <img
            class="me-2 aspect-square size-16 dark:hidden"
            ngSrc="/images/logo/logo.svg"
            width="64"
            height="64"
            priority
            alt=""
          />
          <img
            class="me-2 hidden aspect-square size-16 dark:inline-block"
            ngSrc="/images/logo/logo-white.svg"
            width="64"
            height="64"
            priority
            alt=""
          />
        </div>
        <div hlmEmptyTitle>{{ t('title') }}</div>
        <div hlmEmptyDescription>{{ t('description') }}</div>
      </div>
      <div hlmEmptyContent class="max-w-full">
        <div class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          @for (prompt of suggestedPrompts(); track prompt.titleKey) {
            <button
              type="button"
              class="hover:border-secondary-foreground p-4 transition-colors duration-200 ease-in-out"
              hlmCard
              (click)="handlePromptClick(t(prompt.promptKey))"
            >
              <div class="flex flex-col items-start gap-1 text-left">
                <span hlmCardTitle class="flex items-center gap-2">
                  <ng-icon [name]="prompt.icon" />
                  {{ t(prompt.titleKey) }}
                </span>
                <span hlmCardDescription class="text-start">
                  {{ t(prompt.promptKey) }}
                </span>
              </div>
            </button>
          }
        </div>
      </div>
      <p class="text-foreground-muted text-xs opacity-60">{{ t('disclaimer') }}</p>
    </div>
  `,
})
export class AssistantEmptyState {
  // ==========================================
  // Outputs
  // ==========================================

  public readonly promptSelect = output<string>();

  // ==========================================
  // State
  // ==========================================

  public readonly suggestedPrompts = signal<SuggestedPrompt[]>([
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

  // ==========================================
  // Public Methods
  // ==========================================

  handlePromptClick(prompt: string): void {
    this.promptSelect.emit(prompt);
  }
}
