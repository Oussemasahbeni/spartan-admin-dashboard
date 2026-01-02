import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'adm-auth-layout',
  imports: [NgOptimizedImage, TranslocoModule],
  template: `
    <div
      *transloco="let t; prefix: 'auth.forgotPassword'"
      class="bg-background en block h-full border shadow-md md:shadow-xl"
    >
      <div
        class="relative container flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
      >
        <!-- Form Section -->
        <div class="lg:p-8">
          <div class="absolute top-0 left-0 mb-4 flex items-center gap-3 p-6">
            <img
              class="me-2 aspect-square size-8 dark:hidden"
              ngSrc="/images/logo/logo.svg"
              width="32"
              height="32"
              priority
              alt="logo"
            />

            <img
              class="me-2 hidden aspect-square size-8 dark:inline-block"
              ngSrc="/images/logo/logo-white.svg"
              width="32"
              height="32"
              priority
              alt="logo"
            />
            <span class="text-xl text-white"> Acme Inc </span>
          </div>

          <!-- Content Projection for Form -->
          <ng-content />
        </div>

        <!-- Illustration Section -->
        <div class="bg-muted text-primary relative hidden h-full flex-col border-r p-10 lg:flex dark:border-r-zinc-800">
          <div class="z-1 flex h-full items-center justify-center pt-20">
            <div class="absolute top-0 right-0 w-full max-w-62.5 xl:max-w-112.5">
              <img ngSrc="/images/auth/shape.svg" width="450" height="254" priority alt="grid" />
            </div>
            <div class="absolute bottom-0 left-0 w-full max-w-62.5 rotate-180 xl:max-w-112.5">
              <img ngSrc="/images/auth/shape.svg" width="450" height="254" priority alt="grid" />
            </div>

            <div class="my-auto flex max-w-xs flex-col items-center justify-center">
              <p class="text-center text-gray-400 dark:text-white/60">"{{ t('testimonial') }}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {}
