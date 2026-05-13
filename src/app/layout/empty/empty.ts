import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'adm-empty',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-full w-full flex-auto flex-col">
      <div class="flex flex-auto flex-col">
        <router-outlet />
      </div>
    </div>
  `,
})
export class EmptyLayout {}
