import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'adm-tasks',
  imports: [],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tasks {}
