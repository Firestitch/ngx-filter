import { encodeQueryParam } from './encode-query-parm';

describe('encodeQueryParam', () => {
  it('should escape commas', () => {
    expect(encodeQueryParam('a,b')).toBe('a\\,b');
  });

  it('should escape colons', () => {
    expect(encodeQueryParam('a:b')).toBe('a\\:b');
  });

  it('should escape both commas and colons', () => {
    expect(encodeQueryParam('a,b:c')).toBe('a\\,b\\:c');
  });

  it('should return the value unchanged when no special chars exist', () => {
    expect(encodeQueryParam('hello')).toBe('hello');
  });

  it('should return empty string for undefined', () => {
    expect(encodeQueryParam(undefined)).toBe('');
  });

  it('should return empty string for null', () => {
    expect(encodeQueryParam(null)).toBe('');
  });

  it('should return empty string for empty string', () => {
    expect(encodeQueryParam('')).toBe('');
  });
});
