import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DirectionalityService } from '@core/config/directionality.service';
import { ToasterProps } from '@spartan-ng/brain/sonner';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';

@Component({
  selector: 'adm-root',
  imports: [RouterOutlet, HlmToasterImports],
  template: `
    <hlm-toaster [position]="position()" />
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly _dir = inject(DirectionalityService);

  protected readonly position = computed<ToasterProps['position']>(() => (this._dir.isRtl() ? 'top-left' : 'top-right'));
}
