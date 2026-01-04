import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'adm-root',
  imports: [RouterOutlet, HlmToasterImports, NgScrollbarModule, HlmScrollAreaImports],
  template: `
    <hlm-toaster position="top-center" />
    <ng-scrollbar hlm [withButtons]="true">
      <router-outlet />
    </ng-scrollbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
