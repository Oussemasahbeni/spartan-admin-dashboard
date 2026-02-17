import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { WINDOW } from '@shared/tokens';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'adm-unauthorized',
  imports: [HlmButtonImports, RouterLink, NgOptimizedImage, TranslocoModule],
  host: {
    class: 'block h-full',
  },
  templateUrl: './unauthorized.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Unauthorized {
  private window = inject(WINDOW);

  onGoBack(): void {
    this.window?.history.back();
  }
}
