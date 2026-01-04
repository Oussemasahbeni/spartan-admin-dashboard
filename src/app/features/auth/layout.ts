import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'adm-auth-layout',
  imports: [NgOptimizedImage, TranslocoModule],
  template: `
    <div *transloco="let t" class="bg-background block border shadow-md md:shadow-xl">
      <div class="relative flex min-h-screen flex-col md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <!-- Form Section -->
        <div class="flex flex-col px-6 py-8 sm:px-8 lg:p-8">
          <div class="mb-8 flex items-center gap-3 lg:absolute lg:top-0 lg:left-0 lg:mb-0 lg:p-6">
            <img
              class="aspect-square size-8 dark:hidden"
              ngSrc="/images/logo/logo.svg"
              width="32"
              height="32"
              priority
              alt="logo"
            />

            <img
              class="hidden aspect-square size-8 dark:inline-block"
              ngSrc="/images/logo/logo-white.svg"
              width="32"
              height="32"
              priority
              alt="logo"
            />
            <span class="text-xl"> Acme Inc </span>
          </div>

          <!-- Content Projection for Form -->
          <div class="my-auto w-full">
            <ng-content />
          </div>
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
              <p class="text-center text-gray-400 dark:text-white/60">"{{ t('auth.testimonial') }}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {}
