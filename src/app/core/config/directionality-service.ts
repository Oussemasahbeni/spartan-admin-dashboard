import { Direction, Directionality } from '@angular/cdk/bidi';
import { isPlatformBrowser } from '@angular/common';

import { computed, DOCUMENT, inject, PLATFORM_ID, Service } from '@angular/core';

@Service()
export class DirectionalityService {
  private readonly _document = inject(DOCUMENT);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _dir = inject(Directionality);

  public readonly isRtl = computed(() => this._dir.valueSignal() === 'rtl');

  updateDirection(dir: Direction) {
    this._dir.valueSignal.set(dir);
    this._dir.change.emit(dir);
    if (isPlatformBrowser(this._platformId)) {
      this._document.documentElement.dir = dir;
    }
  }
}
