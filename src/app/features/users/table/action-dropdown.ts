import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsisVertical } from '@ng-icons/lucide';
import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { toast } from 'ngx-sonner';
import { UserService } from '../../../core/user/user.service';
import { ConfirmationDialogService } from '../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { UserForm } from '../form/user-form';
import { User } from '../model/user';

@Component({
  selector: 'adm-action-dropdown',
  imports: [
    HlmButtonImports,
    HlmIconImports,
    HlmDropdownMenuImports,
    BrnAlertDialogImports,
    HlmAlertDialogImports,
    TranslocoModule,
  ],
  providers: [provideIcons({ lucideEllipsisVertical })],
  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <button type="button" hlmBtn variant="ghost" size="icon" align="end" [hlmDropdownMenuTrigger]="menu">
      <ng-icon hlmIcon size="sm" name="lucideEllipsisVertical" />
    </button>
    <ng-template #menu>
      <ng-container *transloco="let t; prefix: 'actionDropdown'">
        <hlm-dropdown-menu>
          <hlm-dropdown-menu-group>
            <button type="button" hlmDropdownMenuItem (click)="onEditUser()">
              {{ t('edit') }}
            </button>
            <button type="button" hlmDropdownMenuItem>
              {{ t('makeCopy') }}
            </button>
            <button type="button" hlmDropdownMenuItem>
              {{ t('favorite') }}
            </button>
          </hlm-dropdown-menu-group>
          <hlm-dropdown-menu-separator />
          <hlm-dropdown-menu-group>
            <button type="button" variant="destructive" hlmDropdownMenuItem (click)="openConfirmationDialog()">
              {{ t('delete') }}
            </button>
          </hlm-dropdown-menu-group>
        </hlm-dropdown-menu>
      </ng-container>
    </ng-template>
  `,
})
export class ActionDropdown {
  private readonly _userService = inject(UserService);
  private readonly _transloco = inject(TranslocoService);
  private readonly _hlmDialogService = inject(HlmDialogService);
  private readonly _context = injectFlexRenderContext<CellContext<User, unknown>>();
  private readonly _confirmationDialogService = inject(ConfirmationDialogService);

  openConfirmationDialog() {
    const dialogRef = this._confirmationDialogService.open({
      title: this._transloco.translate('users.confirmationDialog.deleteTitle'),
      message: this._transloco.translate('users.confirmationDialog.deleteMessage'),
      confirmText: this._transloco.translate('buttons.confirm'),
      cancelText: this._transloco.translate('buttons.cancel'),
      variant: 'destructive',
    });
    dialogRef.closed$.subscribe((result) => {
      if (result === 'confirm') {
        const user = this._context.row.original;
        this._userService.deleteUser(user.id);
        toast.success(this._transloco.translate('users.toast.userDeleted'));
      }
    });
  }

  onEditUser() {
    const user = this._context.row.original;
    this._hlmDialogService.open(UserForm, {
      context: { user },
      contentClass: 'max-w-3xl',
      autoFocus: 'dialog',
    });
  }
}
