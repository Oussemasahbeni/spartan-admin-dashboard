import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { TimeAgoPipe } from './time-ago.pipe';

const SEC = 1_000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;
const BASE_NOW = new Date('2026-01-15T12:00:00.000Z');

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;
  let activeLang: WritableSignal<string>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(BASE_NOW);
    activeLang = signal('en');

    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslocoService,
          useValue: {
            activeLang: vi.fn(() => activeLang()),
          },
        },
      ],
    });

    pipe = TestBed.runInInjectionContext(() => new TimeAgoPipe());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  // ── Null / invalid inputs
  it('returns empty string for nullish/invalid values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });

  it('should handle invalid dates gracefully', () => {
    expect(pipe.transform('invalid-date')).toBe('');
  });

  // ── "now" threshold (< 5 s)
  it('should return "now" for dates very close to the current time', () => {
    const nowTs = BASE_NOW.getTime();
    expect(pipe.transform(BASE_NOW)).toBe('now');
    expect(pipe.transform(new Date(nowTs - 3 * SEC))).toBe('now');
    expect(pipe.transform(new Date(nowTs + 4 * SEC))).toBe('now');
  });

  // ── Past dates

  it('formats seconds ago', () => {
    const result = pipe.transform(new Date(BASE_NOW.getTime() - 30 * SEC));
    expect(result).toBe('30 seconds ago');
  });

  it('formats 1 minute ago', () => {
    const result = pipe.transform(new Date(BASE_NOW.getTime() - MIN));
    expect(result).toBe('1 minute ago');
  });

  it('formats minutes ago', () => {
    const result = pipe.transform(new Date(BASE_NOW.getTime() - 45 * MIN));
    expect(result).toBe('45 minutes ago');
  });

  it('formats hours ago', () => {
    const result = pipe.transform(new Date(BASE_NOW.getTime() - 3 * HOUR));
    expect(result).toBe('3 hours ago');
  });

  it('formats days ago', () => {
    const result = pipe.transform(new Date(BASE_NOW.getTime() - 5 * DAY));
    expect(result).toBe('5 days ago');
  });

  it('formats weeks ago', () => {
    const result = pipe.transform(new Date(BASE_NOW.getTime() - 2 * WEEK));
    expect(result).toBe('2 weeks ago');
  });

  it('formats months ago', () => {
    const result = pipe.transform(new Date(BASE_NOW.getTime() - 3 * MONTH));
    expect(result).toBe('3 months ago');
  });

  it('formats years ago', () => {
    const result = pipe.transform(new Date(BASE_NOW.getTime() - 2 * YEAR));
    expect(result).toBe('2 years ago');
  });

  // ── Future dates

  it('formats seconds in the future', () => {
    const result = pipe.transform(new Date(BASE_NOW.getTime() + 10 * SEC));
    expect(result).toBe('in 10 seconds');
  });

  it('formats hours in the future', () => {
    const result = pipe.transform(new Date(BASE_NOW.getTime() + 2 * HOUR));
    expect(result).toBe('in 2 hours');
  });

  // ── Accepts a date string

  it('accepts an ISO date string', () => {
    const date = new Date(BASE_NOW.getTime() - HOUR);
    expect(pipe.transform(date.toISOString())).toBe('1 hour ago');
  });

  // ── Language reactivity

  it('re-formats in French when the active language signal changes', () => {
    const date = new Date(BASE_NOW.getTime() - 2 * HOUR);

    const english = pipe.transform(date);
    expect(english).toBe('2 hours ago');

    activeLang.set('fr');

    const french = pipe.transform(date);
    expect(french).toBe('il y a 2 heures');
  });

  it('re-formats in Arabic when the active language signal changes', () => {
    const date = new Date(BASE_NOW.getTime() - 2 * HOUR);

    const english = pipe.transform(date);
    expect(english).toBe('2 hours ago');

    activeLang.set('ar');

    const arabic = pipe.transform(date);
    expect(arabic).toBe('قبل ساعتين');
  });
});
