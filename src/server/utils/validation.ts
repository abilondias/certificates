export class ValidationResult {
  public messages: string[] = []

  failed() {
    return this.messages.length > 0
  }
}

export class ValidationError {
  public messages: string[]

  constructor(messages: string[]) {
    this.messages = messages
  }
}
