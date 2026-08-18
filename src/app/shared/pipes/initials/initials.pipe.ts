import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe that derives up to two uppercase initials from a person's name.`
 */
@Pipe({
  name: 'initials',
})
export class InitialsPipe implements PipeTransform {
  /**
   * Extracts the first letter of the first two words, uppercased.
   *
   * @param value - Full name; empty or nullish values yield an empty string
   * @returns Up to two uppercase initials
   */
  transform(value: string | null | undefined): string {
    if (!value) return '';

    return value
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }
}
