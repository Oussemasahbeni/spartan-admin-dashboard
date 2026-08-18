import { InitialsPipe } from './initials.pipe';

describe('InitialsPipe', () => {
  let pipe: InitialsPipe;

  beforeEach(() => {
    pipe = new InitialsPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return two initials for a full name', () => {
    expect(pipe.transform('Oussmema Sahbeni')).toBe('OS');
  });

  it('should return a single initial for a single name', () => {
    expect(pipe.transform('Cher')).toBe('C');
  });

  it('should use only the first two words', () => {
    expect(pipe.transform('Ada M. Lovelace')).toBe('AM');
  });

  it('should uppercase lowercase names', () => {
    expect(pipe.transform('jane doe')).toBe('JD');
  });

  it('should ignore extra whitespace between words', () => {
    expect(pipe.transform('  Jane   Doe  ')).toBe('JD');
  });

  it('should return an empty string for empty input', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should return an empty string for null or undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
