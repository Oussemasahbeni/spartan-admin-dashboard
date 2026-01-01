import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'adm-empty',
  imports: [RouterOutlet],
  templateUrl: './empty.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyLayout {}
