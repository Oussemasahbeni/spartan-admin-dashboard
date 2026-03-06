import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WINDOW } from '@core/config/tokens';
import { TranslocoModule } from '@jsverse/transloco';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'adm-not-found',
  imports: [HlmButtonImports, RouterLink, NgOptimizedImage, TranslocoModule],
  host: {
    class: 'block h-full',
  },
  templateUrl: './not-found.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotFound {
  private window = inject(WINDOW);

  onGoBack(): void {
    this.window?.history.back();
  }
}
