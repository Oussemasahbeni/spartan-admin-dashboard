import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { DirectionalityService } from './core/config/directionality.service';

@Component({
  selector: 'adm-root',
  imports: [RouterOutlet, HlmToasterImports],
  template: `
    <hlm-toaster [position]="toastPosition()" />
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly _directionalityService = inject(DirectionalityService);

  readonly toastPosition = computed(() => {
    return this._directionalityService.isRtl() === true ? 'top-left' : 'top-right';
  });
}
