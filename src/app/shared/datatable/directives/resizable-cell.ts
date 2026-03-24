import { computed, Directive, input } from '@angular/core';
import { toCssVarToken } from '../utils/css-var-token';

@Directive({
  selector: '[tableResizableHeader]',
  host: {
    '[style.width]': 'width()',
  },
})
export class TableResizableHeader {
  readonly cellId = input.required<string>({
    alias: 'tableResizableHeader',
  });

  readonly width = computed(() => `calc(var(--header-${toCssVarToken(this.cellId())}-size) * 1px)`);
}

@Directive({
  selector: '[tableResizableCell]',
  host: {
    '[style.width]': 'width()',
  },
  standalone: true,
})
export class TableResizableCell {
  readonly cellId = input.required<string>({
    alias: 'tableResizableCell',
  });

  readonly width = computed(() => `calc(var(--col-${toCssVarToken(this.cellId())}-size) * 1px)`);
}
