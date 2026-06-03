import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideHome } from '@ng-icons/lucide';
import { ThemeSwitch } from '@shared/components/theme-switch/theme-switch';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
  selector: 'adm-auth-layout',
  imports: [HlmButtonImports, HlmIconImports, RouterLink, NgOptimizedImage, TranslocoModule, ThemeSwitch],
  providers: [
    provideIcons({
      lucideHome,
    }),
  ],
  template: `
    <div *transloco="let t" class="bg-background block h-screen overflow-hidden">
      <div class="relative flex h-full flex-col md:grid lg:max-w-none lg:px-0 xl:grid-cols-2">
        <div class="absolute top-6 left-6 flex space-x-2">
          <a routerLink="/" hlmBtn variant="outline" size="icon" [aria-label]="t('breadcrumbs.home')">
            <ng-icon hlmIcon size="sm" name="lucideHome" />
          </a>

          <adm-theme-switch />
        </div>

        <!-- Form Section -->
        <main class="my-auto w-full overflow-y-auto">
          <ng-content />
        </main>

        <!-- Illustration Section -->
        <div
          class="dark:bg-card text-primary relative hidden h-full flex-col border-r bg-slate-950 p-10 xl:flex dark:border-r-zinc-800"
        >
          <div class="z-1 flex h-full items-center justify-center pt-20">
            <div class="absolute top-0 right-0 w-full max-w-62.5 xl:max-w-112.5">
              <img ngSrc="/images/auth/shape.svg" width="450" height="254" priority alt="grid" />
            </div>
            <div class="absolute bottom-0 left-0 w-full max-w-62.5 rotate-180 xl:max-w-112.5">
              <img ngSrc="/images/auth/shape.svg" width="450" height="254" priority alt="grid" />
            </div>

            <div class="flex max-w-sm flex-col items-center justify-center gap-3">
              <div class="flex items-center gap-3">
                <img
                  class="aspect-square size-12"
                  ngSrc="/images/logo/logo-white.svg"
                  width="32"
                  height="32"
                  priority
                  alt="logo"
                />
                <span class="text-xl text-white"> Acme Inc </span>
              </div>
              <p class="text-center text-gray-400 dark:text-white/60">"{{ t('auth.testimonial') }}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AuthLayout {}
