import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsisVertical } from '@ng-icons/lucide';
import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialog, HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user.type';

@Component({
  selector: 'spartan-action-dropdown',
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
      <ng-container *transloco="let t; prefix: 'users.actionDropdown'">
        <hlm-dropdown-menu>
          <hlm-dropdown-menu-group>
            <button type="button" hlmDropdownMenuItem>
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
            <button type="button" variant="destructive" hlmDropdownMenuItem (click)="openDialog()">
              {{ t('delete') }}
            </button>
          </hlm-dropdown-menu-group>
        </hlm-dropdown-menu>
      </ng-container>
    </ng-template>
    <hlm-alert-dialog *transloco="let t; prefix: 'users.confirmationDialog'">
      <hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>{{ t('deleteTitle') }}</h2>
          <p hlmAlertDialogDescription>
            {{ t('deleteMessage') }}
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer *transloco="let t; prefix: 'buttons'">
          <button type="button" hlmAlertDialogCancel (click)="ctx.close()">{{ t('cancel') }}</button>
          <button type="button" variant="destructive" hlmAlertDialogAction (click)="ctx.close('confirm')">
            {{ t('confirm') }}
          </button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class ActionDropdown {
  private readonly _userService = inject(UserService);
  private readonly _context = injectFlexRenderContext<CellContext<User, unknown>>();
  readonly aletDialog = viewChild.required(HlmAlertDialog);

  openDialog() {
    this.aletDialog().open();

    this.aletDialog().closed.subscribe((result) => {
      if (result === 'confirm') {
        const user = this._context.row.original;
        this._userService.deleteUser(user.id);
      }
    });
  }
}
