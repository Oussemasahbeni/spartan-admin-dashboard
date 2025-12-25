import { Direction, Directionality } from '@angular/cdk/bidi';
import { isPlatformBrowser } from '@angular/common';

import {
  computed,
  DOCUMENT,
  inject,
  Injectable,
  PLATFORM_ID,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DirectionalityService {
  private readonly _document = inject(DOCUMENT);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _dir = inject(Directionality);

  readonly isRtl = computed(() => this._dir.valueSignal() === 'rtl');

  updateDirection(dir: Direction) {
    this._dir.change.emit(dir);
    this._dir.valueSignal.set(dir);
    if (isPlatformBrowser(this._platformId)) {
      this._document.documentElement.dir = dir;
    }
  }
}
