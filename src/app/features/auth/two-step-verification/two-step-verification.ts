import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LOCAL_STORAGE } from '@core/config/tokens';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideMail } from '@ng-icons/lucide';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { HlmInputOtpImports } from '@spartan-ng/helm/input-otp';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { AuthLayout } from '../layout';

@Component({
  selector: 'adm-two-step-verification',
  imports: [
    HlmButtonImports,
    HlmInputOtpImports,
    HlmSpinnerImports,
    HlmAlertImports,
    HlmCard,
    ReactiveFormsModule,
    TranslocoModule,
    AuthLayout,
    BrnInputOtp,
  ],
  providers: [provideIcons({ lucideMail })],
  templateUrl: './two-step-verification.html',
})
export default class TwoStepVerification {
  // ==========================================
  // Services
  // ==========================================

  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _localStorage = inject(LOCAL_STORAGE);

  // ==========================================
  // State
  // ==========================================

  protected readonly isLoading = signal(false);
  protected readonly showError = signal(false);
  protected readonly countdown = signal(60);
  protected readonly maxLength = 6;
  protected readonly email = signal('user@example.com');

  private _intervalId?: ReturnType<typeof setInterval>;

  public readonly otpForm = this._formBuilder.group({
    otp: ['', [Validators.required, Validators.minLength(this.maxLength), Validators.maxLength(this.maxLength)]],
  });

  constructor() {
    this.startCountdown();

    this._destroyRef.onDestroy(() => {
      this.stopCountdown();
    });
  }

  // ==========================================
  // Public Methods
  // ==========================================

  protected readonly isResendDisabled = () => this.countdown() > 0;

  /** Handles paste by removing dashes */
  protected transformPaste = (pastedText: string) => pastedText.replaceAll('-', '');

  protected onOtpComplete(): void {
    if (this.otpForm.valid) {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    if (this.otpForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.showError.set(false);

    // Simulate API call for OTP verification
    setTimeout(() => {
      this.isLoading.set(false);
      const otp = this.otpForm.value.otp;

      // Simulate verification
      if (otp === '123456') {
        this._localStorage?.setItem('token', 'dummy-jwt-token');
        this._router.navigate(['/dashboard/dashboard-1']);
      } else {
        this.showError.set(true);
        this.otpForm.reset();
      }
    }, 1500);
  }

  resendOtp(): void {
    if (this.isResendDisabled()) {
      return;
    }

    this.isLoading.set(true);

    // Simulate resend API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.resetCountdown();
    }, 1000);
  }

  // ==========================================
  // Private Methods
  // ==========================================

  private resetCountdown(): void {
    this.countdown.set(60);
    this.startCountdown();
  }

  private startCountdown(): void {
    this.stopCountdown();
    this._intervalId = setInterval(() => {
      this.countdown.update((countdown) => Math.max(0, countdown - 1));
      if (this.countdown() === 0) {
        this.stopCountdown();
      }
    }, 1000);
  }

  private stopCountdown(): void {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = undefined;
    }
  }
}
