import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-not-found',
  imports: [HlmButtonImports, RouterLink, TranslocoModule],
  host: {
    class: 'block h-full',
  },
  templateUrl: './not-found.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  onGoBack(): void {
    window.history.back();
  }
}
