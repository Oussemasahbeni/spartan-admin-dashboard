import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';

@Component({
  selector: 'adm-root',
  imports: [RouterOutlet, HlmToasterImports],
  template: `
    <hlm-toaster position="top-center" />
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
