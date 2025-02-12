export class ValidationResult {
  public messages: string[] = []

  failed() {
    return this.messages.length > 0
  }

  error() {
    return new ValidationError(this.messages)
  }
}

export class ValidationError {
  public messages: string[]

  constructor(messages: string[]) {
    this.messages = messages
  }
}
