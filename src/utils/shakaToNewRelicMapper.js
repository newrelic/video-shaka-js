/**
 * reference:  https://shaka-player-demo.appspot.com/docs/api/tutorial-errors.html
 */

const NR_ERROR_CODE = 'errorCode';
const NR_ERROR_PLATFORM_CODE = 'errorPlatformCode';
const NR_ERROR_MESSAGE = 'errorMessage';
const NR_ERROR_STACK_TRACE = 'errorStackTrace';
const NR_ERROR_SEVERITY = 'errorSeverity';
const NR_MAX_NUMBER_OF_CHARACTERS_FOR_STRING_ATTRIBUTE = 4096;

const SHAKA_SEVERITY_MAP = {
  1: 'RECOVERABLE',
  2: 'CRITICAL',
};

export default class ShakaToNewRelicMapper {
  static mapErrorAttributes(attributes) {
    if (!attributes || typeof attributes !== 'object') return attributes;

    const { code, platformCode, message, stack, severity } = attributes;

    const stackTrace =
      stack && typeof stack === 'string'
        ? stack.substring(0, NR_MAX_NUMBER_OF_CHARACTERS_FOR_STRING_ATTRIBUTE)
        : undefined;
    const errorSeverity = SHAKA_SEVERITY_MAP[severity] || severity;

    return {
      [NR_ERROR_CODE]: code,
      [NR_ERROR_PLATFORM_CODE]: platformCode,
      [NR_ERROR_MESSAGE]: message,
      [NR_ERROR_STACK_TRACE]: stackTrace,
      [NR_ERROR_SEVERITY]: errorSeverity,
    };
  }
}
