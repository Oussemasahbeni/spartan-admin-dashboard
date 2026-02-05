import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'adm-calendar',
  imports: [],
  templateUrl: './calendar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Calendar {}
