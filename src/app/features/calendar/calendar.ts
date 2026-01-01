import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'adm-calendar',
  imports: [],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calendar {}
