import ShakaToNewRelicMapper from '../../utils/shakaToNewRelicMapper';

describe('ShakaToNewRelicMapper', () => {
  describe('mapErrorAttributes', () => {
    it('should return the mapped error attributes', () => {
      const attributes = {
        code: 1001,
        platformCode: 'PLATFORM_ERROR',
        message: 'An error occurred',
        stack: 'Error stack trace',
        severity: 2,
        extraAttribute: 'extraValue'
      };

      const result = ShakaToNewRelicMapper.mapErrorAttributes(attributes);

      expect(result).toEqual({
        errorCode: 1001,
        errorPlatformCode: 'PLATFORM_ERROR',
        errorMessage: 'An error occurred',
        errorStackTrace: 'Error stack trace',
        errorSeverity: 'CRITICAL',
        extraAttribute: 'extraValue'
      });
    });

    it('should truncate the stack trace if it exceeds the maximum length', () => {
      const longStackTrace = 'a'.repeat(5000);
      const attributes = {
        stack: longStackTrace
      };

      const result = ShakaToNewRelicMapper.mapErrorAttributes(attributes);

      expect(result.errorStackTrace.length).toBe(4096);
    });

    it('should return the original attributes if input is not an object', () => {
      const attributes = 'not an object';

      const result = ShakaToNewRelicMapper.mapErrorAttributes(attributes);

      expect(result).toBe(attributes);
    });

    it('should handle undefined stack trace gracefully', () => {
      const attributes = {
        code: 1001,
        platformCode: 'PLATFORM_ERROR',
        message: 'An error occurred',
        severity: 2
      };

      const result = ShakaToNewRelicMapper.mapErrorAttributes(attributes);

      expect(result).toEqual({
        errorCode: 1001,
        errorPlatformCode: 'PLATFORM_ERROR',
        errorMessage: 'An error occurred',
        errorStackTrace: undefined,
        errorSeverity: 'CRITICAL'
      });
    });

    it('should map severity correctly', () => {
      const attributes = {
        severity: 1
      };

      const result = ShakaToNewRelicMapper.mapErrorAttributes(attributes);

      expect(result.errorSeverity).toBe('RECOVERABLE');
    });

    it('should retain unknown severity values', () => {
      const attributes = {
        severity: 3
      };

      const result = ShakaToNewRelicMapper.mapErrorAttributes(attributes);

      expect(result.errorSeverity).toBe(3);
    });
  });
});
