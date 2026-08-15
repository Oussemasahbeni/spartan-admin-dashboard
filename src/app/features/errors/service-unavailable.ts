import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WINDOW } from '@core/config/tokens';
import { TranslocoModule } from '@jsverse/transloco';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'adm-service-unavailable',
  imports: [HlmButtonImports, RouterLink, NgOptimizedImage, TranslocoModule],
  host: {
    class: 'block h-full',
  },
  template: `
    <main *transloco="let t; prefix: 'system.serviceUnavailable'" class="flex h-screen items-center justify-center">
      <div class="flex max-w-md flex-col gap-6 px-4 text-center">
        <div class="flex flex-col gap-2">
          <h1 class="text-primary text-9xl font-bold">503</h1>
          <h2 class="text-3xl font-semibold tracking-tight">{{ t('heading') }}</h2>
          <p class="text-muted-foreground text-lg">
            {{ t('message') }}
          </p>
        </div>
        <div class="flex justify-center gap-4">
          <button type="button" hlmBtn (click)="onRetry()">{{ t('retry') }}</button>
          <a hlmBtn variant="outline" [routerLink]="['/']">
            {{ t('goToDashboard') }}
          </a>
        </div>
      </div>
      <div class="absolute top-0 right-0 w-full max-w-62.5 xl:max-w-112.5">
        <img ngSrc="/images/auth/shape.svg" width="450" height="254" priority alt="" />
      </div>
      <div class="absolute bottom-0 left-0 w-full max-w-62.5 rotate-180 xl:max-w-112.5">
        <img ngSrc="/images/auth/shape.svg" width="450" height="254" priority alt="" />
      </div>
    </main>
  `,
})
export default class ServiceUnavailable {
  private window = inject(WINDOW);

  onRetry(): void {
    this.window?.location.reload();
  }
}
