import { Pipe, type PipeTransform } from '@angular/core';
import { UserRole } from '../../../core/user/user.type';

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
        return 'lucideUser'; // Default icon if not recognized
    }
  }
}
