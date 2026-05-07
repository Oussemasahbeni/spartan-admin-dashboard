import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { ConfirmDialogData } from './confirmation-dialog.service';

@Component({
  selector: 'adm-confirmation-dialog',
  imports: [TranslocoModule, BrnAlertDialogImports, HlmAlertDialogImports],
  host: {
    class: 'sm:max-w-lg',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *transloco="let t; prefix: 'users.confirmationDialog'">
      <hlm-alert-dialog-header>
        <h2 hlmAlertDialogTitle>{{ ctx.title }}</h2>
        <p hlmAlertDialogDescription>{{ ctx.message }}</p>
      </hlm-alert-dialog-header>
      <hlm-alert-dialog-footer *transloco="let t; prefix: 'buttons'" class="mt-4">
        <button type="button" hlmAlertDialogCancel (click)="close()">{{ ctx.cancelText || 'Cancel' }}</button>
        <button type="button" hlmAlertDialogAction [variant]="ctx.variant || 'default'" (click)="confirm()">
          {{ ctx.confirmText || 'Confirm' }}
        </button>
      </hlm-alert-dialog-footer>
    </div>
  `,
})
export class ConfirmationDialog {
  // ==========================================
  // Services
  // ==========================================
  protected readonly ctx = injectBrnDialogContext<ConfirmDialogData>();
  private readonly _dialogRef = inject(BrnDialogRef);

  // ==========================================
  // Public Methods
  // ==========================================
  protected close() {
    this._dialogRef.close();
  }

  protected confirm() {
    this._dialogRef.close('confirm');
  }
}
