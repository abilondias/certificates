/**
 * Represents validation result, and holds its messages.
 */
export class ValidationResult {
  public messages: string[] = []

  /**
   * Checks if the validation failed.
   *
   * @returns {boolean}
   */
  failed() {
    return this.messages.length > 0
  }

  /**
   * Returns an instance of ValidationError, with the validation result messages.
   *
   * @returns {ValidationError} ValidationError instance.
   */
  error() {
    return new ValidationError(this.messages)
  }
}

/**
 * Represents a validation error and holds messages.
 */
export class ValidationError {
  public messages: string[]

  /**
   * Creates an instance of ValidationError.
   *
   * @param {string[]} messages Validation error messages.
   */
  constructor(messages: string[]) {
    this.messages = messages
  }
}
