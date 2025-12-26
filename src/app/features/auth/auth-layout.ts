import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-auth-layout',
  imports: [NgOptimizedImage, TranslocoModule],
  template: `
    <div
      *transloco="let t; prefix: 'auth.forgetPassword'"
      class="bg-background h-full en border shadow-md block md:shadow-xl"
    >
      <div
        class="relative container h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
      >
        <!-- Form Section -->
        <div class="lg:p-8">
          <div class="mb-4 flex items-center gap-3 absolute top-0 left-0 p-6">
            <img
              class="aspect-square size-8 me-2 dark:hidden"
              ngSrc="/images/logo/logo.svg"
              width="32"
              height="32"
              priority
              alt="logo"
            />

            <img
              class="aspect-square size-8 me-2 hidden dark:inline-block"
              ngSrc="/images/logo/logo-white.svg"
              width="32"
              height="32"
              priority
              alt="logo"
            />
            <span class="text-white text-xl"> Acme Inc </span>
          </div>

          <!-- Content Projection for Form -->
          <ng-content />
        </div>

        <!-- Illustration Section -->
        <div
          class="bg-muted text-primary relative hidden h-full flex-col border-r p-10 lg:flex dark:border-r-zinc-800"
        >
          <div class="flex items-center pt-20 h-full justify-center z-1">
            <div
              class="absolute right-0 top-0 w-full max-w-62.5 xl:max-w-112.5"
            >
              <img
                ngSrc="/images/auth/shape.svg"
                width="450"
                height="254"
                priority
                alt="grid"
              />
            </div>
            <div
              class="absolute bottom-0 left-0 w-full max-w-62.5 rotate-180 xl:max-w-112.5"
            >
              <img
                ngSrc="/images/auth/shape.svg"
                width="450"
                height="254"
                priority
                alt="grid"
              />
            </div>

            <div
              class="flex justify-center my-auto flex-col items-center max-w-xs"
            >
              <p class="text-center text-gray-400 dark:text-white/60">
                "{{ t('testimonial') }}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {}
