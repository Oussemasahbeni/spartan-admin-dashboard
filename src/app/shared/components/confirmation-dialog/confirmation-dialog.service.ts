import { inject, Injectable } from '@angular/core';
import { ButtonVariants } from '@spartan-ng/helm/button';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { ConfirmationDialog } from './confirmation-dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ButtonVariants['variant'];
}

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {
  private readonly _hlmDialogService = inject(HlmDialogService);

  open(data: ConfirmDialogData) {
    const dialogRef = this._hlmDialogService.open(ConfirmationDialog, {
      context: data,
      role: 'alertdialog',
    });

    return dialogRef;
  }
}
