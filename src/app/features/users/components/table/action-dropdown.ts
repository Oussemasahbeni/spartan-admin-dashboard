import { ChangeDetectionStrategy, Component, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsisVertical } from '@ng-icons/lucide';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog/confirmation-dialog.service';
import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { exhaustMap, filter } from 'rxjs';
import { User } from '../../../../shared/models/user';
import { UserService } from '../../service/user.service';
import { UserForm } from '../form/user-form';

@Component({
  selector: 'adm-action-dropdown',
  imports: [
    HlmButtonImports,
    HlmIconImports,
    HlmDropdownMenuImports,
    BrnAlertDialogImports,
    HlmAlertDialogImports,
    HlmTooltipImports,
    TranslocoModule,
  ],
  providers: [provideIcons({ lucideEllipsisVertical })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      hlmBtn
      variant="ghost"
      size="icon"
      align="end"
      aria-label="Open row actions"
      [hlmDropdownMenuTrigger]="menu"
    >
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
  // ==========================================
  // Services
  // ==========================================

  private readonly _userService = inject(UserService);
  private readonly _transloco = inject(TranslocoService);
  private readonly _hlmDialogService = inject(HlmDialogService);
  private readonly _context = injectFlexRenderContext<CellContext<User, unknown>>();
  private readonly _confirmationDialogService = inject(ConfirmationDialogService);
  private readonly _destroyRef = inject(DestroyRef);

  // ==========================================
  // Inputs
  // ==========================================

  public readonly onSuccess = input<() => void>();

  // ==========================================
  // Public Methods
  // ==========================================

  openConfirmationDialog() {
    const user = this._context.row.original;

    this._confirmationDialogService
      .open({
        title: this._transloco.translate('users.confirmationDialog.deleteTitle'),
        message: this._transloco.translate('users.confirmationDialog.deleteMessage'),
        confirmText: this._transloco.translate('buttons.confirm'),
        cancelText: this._transloco.translate('buttons.cancel'),
        variant: 'destructive',
      })
      .closed$.pipe(
        filter((result) => result === 'confirm'),
        exhaustMap(() => this._userService.deleteUser(user.id))
      )
      .subscribe({
        next: () => {
          toast.success(this._transloco.translate('users.toast.userDeleted'));
          const refresh = this.onSuccess();
          if (refresh) refresh();
        },
        error: (err) => {
          console.error('Delete failed', err);
          toast.error('Could not delete user');
        },
      });
  }

  onEditUser() {
    const user = this._context.row.original;
    const dialogRef = this._hlmDialogService.open(UserForm, {
      context: { user },
      contentClass: 'max-w-3xl',
      autoFocus: 'dialog',
    });

    dialogRef.closed$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
      console.log(result);
      if (result) {
        const refresh = this.onSuccess();
        if (refresh) refresh();
      }
    });
  }
}
