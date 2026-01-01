import { Pipe, PipeTransform } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideCircleX, lucideLoader } from '@ng-icons/lucide';
import { UserStatus } from '../model/user';

@Pipe({ name: 'statusUI' })
export class StatusUIPipe implements PipeTransform {
  transform(value: UserStatus) {
    const configs: Record<UserStatus, { icon: string; class: string }> = {
      active: { icon: 'lucideCircleCheck', class: 'text-green-600 ' },
      inactive: { icon: 'lucideCircleX', class: 'text-destructive border-destructive' },
      pending: { icon: 'lucideLoader', class: 'text-amber-600 border-amber-600' },
    };
    return configs[value] ?? { icon: 'lucideCircleHelp', class: 'text-muted-foreground' };
  }
}

export function provideUserStatusIcons() {
  return provideIcons({
    lucideCircleCheck,
    lucideCircleX,
    lucideLoader,
  });
}
