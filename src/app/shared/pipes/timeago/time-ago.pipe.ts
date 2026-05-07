import { computed, inject, Pipe, PipeTransform, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

const TIME_UNITS: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
  { unit: 'year', seconds: 365 * 24 * 3600 },
  { unit: 'month', seconds: 30 * 24 * 3600 },
  { unit: 'week', seconds: 7 * 24 * 3600 },
  { unit: 'day', seconds: 24 * 3600 },
  { unit: 'hour', seconds: 3_600 },
  { unit: 'minute', seconds: 60 },
  { unit: 'second', seconds: 1 },
];

@Pipe({
  name: 'timeAgo',
  pure: false,
})
export class TimeAgoPipe implements PipeTransform {
  private readonly transloco = inject(TranslocoService);

  protected readonly activeLang = computed(() => this.transloco.activeLang());

  private readonly formatter = computed(
    () => new Intl.RelativeTimeFormat(this.activeLang(), { numeric: 'always', style: 'long' })
  );
  private readonly justNowFormatter = computed(
    () => new Intl.RelativeTimeFormat(this.activeLang(), { numeric: 'auto', style: 'long' })
  );

  private readonly now = signal(Date.now());

  transform(value: string | Date | null | undefined): string {
    const timestamp = this.toTimestamp(value);

    if (timestamp === null) {
      return '';
    }
    const now = this.now();
    const diffSeconds = Math.round((timestamp - now) / 1000);
    const absDiff = Math.abs(diffSeconds);

    if (absDiff < 5) return this.justNowFormatter().format(0, 'second');

    for (const { unit, seconds } of TIME_UNITS) {
      if (absDiff >= seconds) {
        return this.formatter().format(Math.round(diffSeconds / seconds), unit);
      }
    }

    return this.formatter().format(diffSeconds, 'second');
  }

  private toTimestamp(value: string | Date | null | undefined): number | null {
    if (!value) return null;
    const ts = value instanceof Date ? value.getTime() : new Date(value).getTime();
    return Number.isNaN(ts) ? null : ts;
  }
}
