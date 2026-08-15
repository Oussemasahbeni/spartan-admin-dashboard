import { Component, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsisVertical } from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

import { DataTableFeatures } from '@shared/datatable/table/table-features';
import { User } from '@shared/models/user';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { Row } from '@tanstack/angular-table';
import { UserService } from '../../service/user-service';
import { UserForm } from '../form/user-form';

@Component({
  selector: 'adm-action-dropdown',
  imports: [HlmButtonImports, NgIcon, HlmDropdownMenuImports, HlmAlertDialogImports, HlmTooltipImports, TranslocoModule],
  providers: [provideIcons({ lucideEllipsisVertical })],

  template: `
    <button type="button" hlmBtn variant="ghost" size="icon" align="end" [hlmDropdownMenuTrigger]="menu">
      <span *transloco="let t" class="sr-only">{{ t('common.openRowActions') }}</span>
      <ng-icon name="lucideEllipsisVertical" />
    </button>
    <ng-template #menu>
      <ng-container *transloco="let t; prefix: 'actionDropdown'">
        <hlm-dropdown-menu>
          <hlm-dropdown-menu-group>
            <button type="button" hlmDropdownMenuItem (click)="onEditUser()">
              {{ t('edit') }}
            </button>
          </hlm-dropdown-menu-group>
          <hlm-dropdown-menu-separator />
          <hlm-dropdown-menu-group>
            <button type="button" variant="destructive" hlmDropdownMenuItem [hlmAlertDialogTriggerFor]="dialog">
              {{ t('delete') }}
            </button>
          </hlm-dropdown-menu-group>
        </hlm-dropdown-menu>
      </ng-container>
    </ng-template>

    <hlm-alert-dialog #dialog>
      <hlm-alert-dialog-content *hlmAlertDialogPortal="let ctx">
        <hlm-alert-dialog-header *transloco="let t; prefix: 'users.confirmationDialog'">
          <h2 hlmAlertDialogTitle>{{ t('deleteTitle') }}</h2>
          <p hlmAlertDialogDescription>{{ t('deleteMessage') }}</p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer *transloco="let t; prefix: 'buttons'">
          <button type="button" hlmAlertDialogCancel>{{ t('cancel') }}</button>
          <button type="button" hlmAlertDialogAction (click)="deleteUser(); ctx.close()">
            {{ t('confirm') }}
          </button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class ActionDropdown {
  // ==========================================
  // Services
  // ==========================================

  private readonly _userService = inject(UserService);
  private readonly _transloco = inject(TranslocoService);
  private readonly _hlmDialogService = inject(HlmDialogService);
  private readonly _destroyRef = inject(DestroyRef);

  // ==========================================
  // Inputs
  // ==========================================

  public readonly row = input.required<Row<DataTableFeatures, User>>();
  public readonly onSuccess = input<() => void>();

  // ==========================================
  // Public Methods
  // ==========================================

  deleteUser() {
    const user = this.row().original;

    this._userService
      .deleteUser(user.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
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
    const user = this.row().original;
    const dialogRef = this._hlmDialogService.open(UserForm, {
      context: { user },
      autoFocus: 'dialog',
      contentClass: 'sm:min-w-lg',
    });

    dialogRef.closed$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
      if (result) {
        const refresh = this.onSuccess();
        if (refresh) refresh();
      }
    });
  }
}
