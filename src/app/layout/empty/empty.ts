import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'adm-empty',
  imports: [RouterOutlet],
  template: `
    <div class="flex h-full w-full flex-auto flex-col">
      <div class="flex flex-auto flex-col">
        <router-outlet />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyLayout {}
