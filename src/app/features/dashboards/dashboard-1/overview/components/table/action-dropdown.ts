import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsisVertical } from '@ng-icons/lucide';
import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';

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
    <button
      type="button"
      hlmBtn
      variant="ghost"
      size="icon"
      align="end"
      aria-label="Open actions"
      [hlmDropdownMenuTrigger]="menu"
    >
      <ng-icon hlmIcon size="sm" name="lucideEllipsisVertical" />
    </button>
    <ng-template #menu>
      <ng-container *transloco="let t; prefix: 'actionDropdown'">
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
            <button type="button" variant="destructive" hlmDropdownMenuItem>
              {{ t('delete') }}
            </button>
          </hlm-dropdown-menu-group>
        </hlm-dropdown-menu>
      </ng-container>
    </ng-template>
  `,
})
export class PaymentsActionDropdown {}
