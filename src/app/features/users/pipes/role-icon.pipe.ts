import { Pipe, type PipeTransform } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideBriefcase, lucideShieldCheck, lucideUser } from '@ng-icons/lucide';
import { UserRole } from '../../../shared/models/user';

@Pipe({
  name: 'roleIcon',
})
export class RoleIconPipe implements PipeTransform {
  transform(value: UserRole): string {
    switch (value) {
      case 'admin':
        return 'lucideShieldCheck';
      case 'manager':
        return 'lucideBriefcase';
      case 'user':
        return 'lucideUser';
      default:
        return 'lucideUser';
    }
  }
}

export function provideUserRoleIcons() {
  return provideIcons({
    lucideBriefcase,
    lucideShieldCheck,
    lucideUser,
  });
}
