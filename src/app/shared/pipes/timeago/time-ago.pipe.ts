import { inject, Pipe, PipeTransform } from '@angular/core';
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

interface TimeAgoFormatters {
  always: Intl.RelativeTimeFormat;
  justNow: Intl.RelativeTimeFormat;
}

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  private readonly transloco = inject(TranslocoService);

  private readonly formatters = new Map<string, TimeAgoFormatters>();

  transform(value: string | Date | null | undefined, lang?: string): string {
    const timestamp = this.toTimestamp(value);

    if (timestamp === null) {
      return '';
    }
    const { always, justNow } = this.formattersFor(lang ?? this.transloco.activeLang());
    const diffSeconds = Math.round((timestamp - Date.now()) / 1000);
    const absDiff = Math.abs(diffSeconds);

    if (absDiff < 5) return justNow.format(0, 'second');

    for (const { unit, seconds } of TIME_UNITS) {
      if (absDiff >= seconds) {
        return always.format(Math.round(diffSeconds / seconds), unit);
      }
    }

    return always.format(diffSeconds, 'second');
  }

  private formattersFor(lang: string): TimeAgoFormatters {
    let formatters = this.formatters.get(lang);
    if (!formatters) {
      formatters = {
        always: new Intl.RelativeTimeFormat(lang, { numeric: 'always', style: 'long' }),
        justNow: new Intl.RelativeTimeFormat(lang, { numeric: 'auto', style: 'long' }),
      };
      this.formatters.set(lang, formatters);
    }
    return formatters;
  }

  private toTimestamp(value: string | Date | null | undefined): number | null {
    if (!value) return null;
    const ts = value instanceof Date ? value.getTime() : new Date(value).getTime();
    return Number.isNaN(ts) ? null : ts;
  }
}
