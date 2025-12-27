import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-unauthorized',
  imports: [HlmButtonImports, RouterLink, TranslocoModule],
  host: {
    class: 'block h-full',
  },
  templateUrl: './unauthorized.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Unauthorized {
  onGoBack(): void {
    window.history.back();
  }
}
