import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { email, form, FormField, required, submit, validate } from '@angular/forms/signals';
import { provideTranslocoScope, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CountryPicker } from '@shared/components/country-picker/country-picker';
import { PhoneNumberPicker } from '@shared/components/phone-number-picker/phone-number-picker';
import { countries, Country } from '@shared/countries';
import { BrnDialogImports, BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';
import { toast } from 'ngx-sonner';
import { User, USER_ROLES, UserRole } from '../../model/user';
import { UserService } from '../../service/user.service';

export interface UserFormModel {
  name: string;
  email: string;
  phoneNumber: string;
  country: Country | null;
  role: UserRole;
}

@Component({
  selector: 'adm-user-form',
  imports: [
    BrnDialogImports,
    HlmDialogImports,
    HlmLabelImports,
    HlmInputImports,
    HlmFieldImports,
    HlmButtonImports,
    HlmSpinnerImports,
    HlmIconImports,
    HlmButtonImports,
    BrnSelectImports,
    HlmSelectImports,
    HlmIconImports,
    TranslocoModule,
    FormField,
    CountryPicker,
    PhoneNumberPicker,
  ],
  host: {
    class: 'flex flex-col gap-4 sm:min-w-lg',
  },
  providers: [provideTranslocoScope('users')],
  templateUrl: './user-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForm implements OnInit {
  private readonly _userService = inject(UserService);
  private readonly _transloco = inject(TranslocoService);
  private readonly _dialogRef = inject<BrnDialogRef>(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<{ user?: User }>();

  protected readonly rolesList = signal([...USER_ROLES]);
  protected readonly isEditMode = signal<boolean>(!!this._dialogContext.user);
  protected readonly isSubmitting = signal(false);

  private readonly userModel = signal<UserFormModel>({
    name: '',
    email: '',
    phoneNumber: '',
    country: null,
    role: 'user',
  });

  readonly userForm = form(this.userModel, (schema) => {
    required(schema.name);
    required(schema.email);
    email(schema.email);
    required(schema.phoneNumber);
    required(schema.role);
    validate(schema.phoneNumber, ({ value }) => {
      if (!value()) {
        return null;
      }
      const phoneNumber = parsePhoneNumberFromString(value());

      return phoneNumber && phoneNumber.isValid()
        ? null
        : {
            kind: 'invalid',
          };
    });
  });

  ngOnInit(): void {
    const user = this._dialogContext.user;
    if (user) {
      this.userModel.set({
        ...user,
        country: countries.find((c) => c.iso === user.country) || null,
      });
    }
  }

  onSubmit() {
    submit(this.userForm, async () => {
      if (!this.userForm().dirty()) {
        this._dialogRef.close(false);
        return;
      }
      this.onSaveUser();
    });
  }

  onSaveUser() {
    this.isSubmitting.set(true);
    const payload = this._mapFormToUser();
    const userId = this._dialogContext.user?.id;

    const request$ =
      this.isEditMode() && userId ? this._userService.updateUser(userId, payload) : this._userService.createUser(payload);

    request$.subscribe({
      next: () => {
        this.showToast();
        this._dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        toast.error('Save failed');
        this.isSubmitting.set(false);
      },
    });
  }

  private _mapFormToUser(): Partial<User> {
    const val = this.userForm;
    return {
      name: val.name().value(),
      email: val.email().value(),
      phoneNumber: val.phoneNumber().value(),
      country: val.country().value()?.iso ?? null,
      role: val.role().value(),
      status: this._dialogContext.user?.status ?? 'active',
    };
  }

  showToast() {
    const message = this.isEditMode()
      ? this._transloco.translate('users.toast.userUpdated')
      : this._transloco.translate('users.toast.userCreated');
    toast.success(message);
  }

  protected closeDialog(): void {
    const isDirty = this.userForm().dirty();

    if (isDirty) {
      // TODO: replace with a translation and a proper confirmation dialog
      const confirmDiscard = confirm('You have unsaved changes. Are you sure you want to discard them?');
      if (!confirmDiscard) {
        return;
      }
    }

    // If not dirty OR user confirmed discard, close the dialog
    this._dialogRef.close();
  }
}
