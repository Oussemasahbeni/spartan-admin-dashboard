import { BrnCalendarI18n } from '@spartan-ng/brain/calendar';

export const arabicCalendarI18n: Partial<BrnCalendarI18n> = {
  formatWeekdayName: (index: number) => {
    const weekdays = ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'];
    return weekdays[index];
  },
  months: () => [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
  formatHeader: (month: number, year: number) => {
    return new Date(year, month).toLocaleDateString('ar', {
      month: 'long',
      year: 'numeric',
    });
  },
  formatMonth: (month: number) => {
    return new Date(2000, month).toLocaleDateString('ar', {
      month: 'short',
    });
  },
  formatYear: (year: number): string => {
    return new Date(year, 0).toLocaleDateString('ar', {
      year: 'numeric',
    });
  },
  labelPrevious: () => 'انتقل إلى الشهر السابق',
  labelNext: () => 'انتقل إلى الشهر التالي',
  labelWeekday: (index: number) => {
    const weekdays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return weekdays[index];
  },
  firstDayOfWeek: () => 0,
};

export const frenchCalendarI18n: Partial<BrnCalendarI18n> = {
  formatWeekdayName: (index: number) => {
    const weekdays = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
    return weekdays[index];
  },
  months: () => ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
  formatHeader: (month: number, year: number) => {
    return new Date(year, month).toLocaleDateString('fr', {
      month: 'long',
      year: 'numeric',
    });
  },
  formatMonth: (month: number) => {
    return new Date(2000, month).toLocaleDateString('fr', {
      month: 'short',
    });
  },
  formatYear: (year: number): string => {
    return new Date(year, 0).toLocaleDateString('fr', {
      year: 'numeric',
    });
  },
  labelPrevious: () => 'Aller au mois précédent',
  labelNext: () => 'Aller au mois suivant',
  labelWeekday: (index: number) => {
    const weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return weekdays[index];
  },
  firstDayOfWeek: () => 1,
};

export const englishCalendarI18n: Partial<BrnCalendarI18n> = {
  formatWeekdayName: (index: number) => {
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return weekdays[index];
  },
  months: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  formatHeader: (month: number, year: number) => {
    return new Date(year, month).toLocaleDateString('en', {
      month: 'long',
      year: 'numeric',
    });
  },
  formatMonth: (month: number) => {
    return new Date(2000, month).toLocaleDateString('en', {
      month: 'short',
    });
  },
  formatYear: (year: number): string => {
    return new Date(year, 0).toLocaleDateString('en', {
      year: 'numeric',
    });
  },
  labelPrevious: () => 'Go to the previous month',
  labelNext: () => 'Go to the next month',
  labelWeekday: (index: number) => {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[index];
  },
  firstDayOfWeek: () => 0,
};
