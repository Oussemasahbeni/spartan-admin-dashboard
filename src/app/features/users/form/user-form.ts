import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, Field, form, required } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { UserRole } from '../../../core/user/user.type';

@Component({
  selector: 'app-user-form',
  imports: [
    BrnDialogImports,
    HlmDialogImports,
    HlmLabelImports,
    HlmInputImports,
    HlmFieldImports,
    HlmButtonImports,
    HlmIconImports,
    HlmButtonImports,
    BrnSelectImports,
    HlmSelectImports,
    TranslocoModule,
    Field,
  ],
  host: {
    class: 'flex flex-col gap-4 min-w-lg',
  },
  templateUrl: './user-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForm {
  protected readonly _rolesList = signal(['admin', 'user', 'manager'] satisfies UserRole[]);

  private readonly userModel = signal({
    name: '',
    email: '',
    phoneNumber: '',
    country: '',
    role: '',
  });

  readonly userForm = form(this.userModel, (schema) => {
    required(schema.name, { message: 'nameRequired' });
    required(schema.email, { message: 'emailRequired' });
    email(schema.email, { message: 'emailInvalid' });
    required(schema.phoneNumber, { message: 'phoneNumberRequired' });
    required(schema.role, { message: 'roleRequired' });
  });
}
