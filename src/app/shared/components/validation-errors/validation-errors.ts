import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldState } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { HlmFieldError } from '@spartan-ng/helm/field';

@Component({
  selector: 'adm-validation-errors',
  imports: [HlmFieldError, TranslocoModule],
  template: `
    @if (fieldState().touched() && fieldState().invalid()) {
      @for (error of fieldState().errors(); track error.kind) {
        @if (error.message) {
          <hlm-field-error>{{ error.message }}</hlm-field-error>
        } @else {
          <hlm-field-error *transloco="let t">{{ t('validation.' + error.kind, errorParams()) }}</hlm-field-error>
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationErrors {
  // ==========================================
  // Inputs
  // ==========================================
  public readonly fieldState = input.required<FieldState<unknown, string>>();
  public readonly errorParams = input<Record<string, unknown>>({});
}
