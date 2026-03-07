import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WINDOW } from '@core/config/tokens';
import { TranslocoModule } from '@jsverse/transloco';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'adm-service-unavailable',
  imports: [HlmButtonImports, RouterLink, NgOptimizedImage, TranslocoModule],
  host: {
    class: 'block h-full',
  },
  templateUrl: './service-unavailable.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ServiceUnavailable {
  private window = inject(WINDOW);

  onRetry(): void {
    this.window?.location.reload();
  }
}
