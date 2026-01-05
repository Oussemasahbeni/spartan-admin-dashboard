import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, DestroyRef, inject, Pipe, PipeTransform, PLATFORM_ID } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { interval, Subscription } from 'rxjs';

interface TimeAgoLabels {
  prefix: string;
  suffix: string;
  futurePrefix: string;
  futureSuffix: string;
  justNow: string;
  second: string;
  seconds: string;
  minute: string;
  minutes: string;
  hour: string;
  hours: string;
  day: string;
  days: string;
  week: string;
  weeks: string;
  month: string;
  months: string;
  year: string;
  years: string;
}

const TIME_UNITS = [
  { unit: 'year', seconds: 31536000 },
  { unit: 'month', seconds: 2592000 },
  { unit: 'week', seconds: 604800 },
  { unit: 'day', seconds: 86400 },
  { unit: 'hour', seconds: 3600 },
  { unit: 'minute', seconds: 60 },
  { unit: 'second', seconds: 1 },
] as const;

/**
 * Transforms a date into a human-readable relative time string with i18n support.
 * Uses Transloco for translations, automatically updating when language changes.
 *
 * @usageNotes
 * ```html
 * {{ createdAt | timeAgo }}        → "2 hours ago" / "منذ ساعتين"
 * {{ futureDate | timeAgo }}       → "in 3 days" / "بعد 3 أيام"
 * {{ createdAt | timeAgo:false }}  → Static, no live updates
 * ```
 */
@Pipe({
  name: 'timeAgo',
  pure: false,
})
export class TimeAgoPipe implements PipeTransform {
  private readonly cd = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);

  private clockSubscription: Subscription | null = null;
  private lastValue: string | Date | null = null;

  transform(value: string | Date | null | undefined, live = true): string {
    if (!value) {
      return '';
    }

    const timestamp = this.getTimestamp(value);
    if (isNaN(timestamp)) {
      return '';
    }

    // Start live updates if enabled and in browser
    if (live && isPlatformBrowser(this.platformId) && this.lastValue !== value) {
      this.lastValue = value;
      this.startUpdateTimer(timestamp);
    }

    return this.constructResponse(timestamp);
  }

  private startUpdateTimer(then: number): void {
    // Clean up existing subscription
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }

    // Calculate appropriate update interval based on time difference
    const diff = Math.abs(Date.now() - then);
    const intervalMs = diff < 60000 ? 1000 : diff < 3600000 ? 60000 : 3600000;

    this.clockSubscription = interval(intervalMs).subscribe(() => {
      this.cd.markForCheck();
    });

    // Cleanup on destroy
    this.destroyRef.onDestroy(() => {
      this.clockSubscription?.unsubscribe();
    });
  }

  private getLabels(): TimeAgoLabels {
    // Default labels (fallback if translations aren't loaded)
    const defaults: TimeAgoLabels = {
      prefix: '',
      suffix: 'ago',
      futurePrefix: 'in',
      futureSuffix: '',
      justNow: 'just now',
      second: 'second',
      seconds: 'seconds',
      minute: 'minute',
      minutes: 'minutes',
      hour: 'hour',
      hours: 'hours',
      day: 'day',
      days: 'days',
      week: 'week',
      weeks: 'weeks',
      month: 'month',
      months: 'months',
      year: 'year',
      years: 'years',
    };

    // Use translateObject to get all timeAgo translations at once
    const translations = this.transloco.translateObject<Partial<TimeAgoLabels>>('timeAgo');

    // Merge translations with defaults, preferring translations when available
    return { ...defaults, ...translations };
  }

  private constructResponse(timestamp: number): string {
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);
    const isFuture = diff < 0;
    const absDiff = Math.abs(diff);

    const labels = this.getLabels();

    // Just now (within 5 seconds)
    if (absDiff < 5) {
      return labels.justNow;
    }

    // Find the appropriate time unit
    for (const { unit, seconds } of TIME_UNITS) {
      const count = Math.floor(absDiff / seconds);
      if (count >= 1) {
        const unitLabel = count === 1 ? labels[unit as keyof TimeAgoLabels] : labels[`${unit}s` as keyof TimeAgoLabels];

        const timeString = `${count} ${unitLabel}`;

        if (isFuture) {
          return this.buildString(labels.futurePrefix, timeString, labels.futureSuffix);
        } else {
          return this.buildString(labels.prefix, timeString, labels.suffix);
        }
      }
    }

    return labels.justNow;
  }

  private buildString(prefix: string, time: string, suffix: string): string {
    // Filter out empty values AND values that are translation keys (start with 'timeAgo.')
    const isValidPart = (part: string): boolean => {
      return Boolean(part) && !part.startsWith('timeAgo.');
    };
    return [prefix, time, suffix].filter(isValidPart).join(' ').trim();
  }

  private getTimestamp(value: string | Date): number {
    if (value instanceof Date) {
      return value.getTime();
    }
    return new Date(value).getTime();
  }
}
