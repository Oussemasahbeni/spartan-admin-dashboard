import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsisVertical } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import {
  type CellContext,
  injectFlexRenderContext,
} from '@tanstack/angular-table';
import { User } from './user.type';

@Component({
  selector: 'spartan-action-dropdown',
  imports: [HlmButtonImports, HlmIconImports, HlmDropdownMenuImports],
  providers: [provideIcons({ lucideEllipsisVertical })],
  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <button
      type="button"
      hlmBtn
      variant="ghost"
      size="icon"
      align="end"
      [hlmDropdownMenuTrigger]="menu"
    >
      <ng-icon hlmIcon size="sm" name="lucideEllipsisVertical" />
    </button>
    <ng-template #menu>
      <hlm-dropdown-menu>
        <hlm-dropdown-menu-group>
          <button type="button" hlmDropdownMenuItem>Edit</button>
          <button type="button" hlmDropdownMenuItem>Make a copy</button>
          <button type="button" hlmDropdownMenuItem>Favorite</button>
        </hlm-dropdown-menu-group>
        <hlm-dropdown-menu-separator />
        <hlm-dropdown-menu-group>
          <button type="button" hlmDropdownMenuItem>
            Delete
            <span class="ml-auto text-xs tracking-widest opacity-60">⌘⌫</span>
          </button>
        </hlm-dropdown-menu-group>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class ActionDropdown {
  private readonly _context =
    injectFlexRenderContext<CellContext<User, unknown>>();

  copyPaymentId() {
    const payment = this._context.row.original;
    navigator.clipboard.writeText(payment.id);
  }
}
