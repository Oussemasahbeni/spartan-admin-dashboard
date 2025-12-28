import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { email, Field, form, required, validate } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { BrnDialogImports, BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';
import { UserService } from '../../../core/user/user.service';
import { User, UserRole } from '../../../core/user/user.type';
import { CountryPicker } from '../../../shared/components/country-picker/country-picker';
import { PhoneNumberPicker } from '../../../shared/components/phone-number-picker/phone-number-picker';
import { countries, Country } from '../../../shared/countries';

export interface UserFormModel {
  name: string;
  email: string;
  phoneNumber: string;
  country: Country | null;
  role: UserRole;
}

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
    HlmIconImports,
    TranslocoModule,
    Field,
    CountryPicker,
    PhoneNumberPicker,
  ],
  host: {
    class: 'flex flex-col gap-4 min-w-lg',
  },

  templateUrl: './user-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForm implements OnInit {
  private readonly _userService = inject(UserService);
  private readonly _dialogRef = inject<BrnDialogRef<UserForm>>(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<{ user?: User }>();

  protected readonly rolesList = signal(['admin', 'user', 'manager'] satisfies UserRole[]);
  protected readonly isEditMode = signal<boolean>(!!this._dialogContext.user);
  
  private readonly userModel = signal<UserFormModel>({
    name: '',
    email: '',
    phoneNumber: '',
    country: null,
    role: 'user',
  });

  readonly userForm = form(this.userModel, (schema) => {
    required(schema.name, { message: 'nameRequired' });
    required(schema.email, { message: 'emailRequired' });
    email(schema.email, { message: 'emailInvalid' });
    required(schema.phoneNumber, { message: 'phoneNumberRequired' });
    required(schema.role, { message: 'roleRequired' });
    validate(schema.phoneNumber, ({ value }) => {
      if (!value()) {
        return null;
      }
      const phoneNumber = parsePhoneNumberFromString(value());

      return phoneNumber && phoneNumber.isValid()
        ? null
        : {
            kind: 'phoneNumberInvalid',
            message: 'phoneNumberInvalid',
          };
    });
  });

  ngOnInit(): void {
    const user = this._dialogContext.user;
    if (user) {
      this.userModel.set({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        country: countries.find((c) => c.iso === user.country) || null,
      });
    }
  }
  onSaveUser(event: Event) {
    event.preventDefault();

    if (this.userForm().valid()) {
      if (this.isEditMode()) {
        this.editUser();
      } else {
        this.createUser();
      }
    } else {
      this.userForm().markAsTouched();
      this.userForm.email().markAsTouched();
      this.userForm.name().markAsTouched();
      this.userForm.phoneNumber().markAsTouched();
      this.userForm.role().markAsTouched();
    }
  }

  createUser() {
    const user: User = {
      id: crypto.randomUUID(),
      avatar: '',
      name: this.userForm.name().value(),
      email: this.userForm.email().value(),
      phoneNumber: this.userForm.phoneNumber().value(),
      country: this.userForm.country().value()?.iso ?? null,
      role: this.userForm.role().value(),
      status: 'active',
      createdAt: new Date(),
    };
    this._userService.addUser(user);
    this._dialogRef.close();
  }

  editUser() {
    if (this._dialogContext.user) {
      const updatedUser: User = {
        ...this._dialogContext.user,
        name: this.userForm.name().value(),
        email: this.userForm.email().value(),
        phoneNumber: this.userForm.phoneNumber().value(),
        country: this.userForm.country().value()?.iso ?? null,
        role: this.userForm.role().value(),
      };
      this._userService.updateUser(updatedUser);
      this._dialogRef.close();
    }
  }
}
