import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-service-unavailable',
  imports: [HlmButtonImports, RouterLink, TranslocoModule],
  host: {
    class: 'block h-full',
  },
  templateUrl: './service-unavailable.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceUnavailable {
  onRetry(): void {
    window.location.reload();
  }
}
