export default class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }

  getMessage() {
    return this.message;
  }

  getStatus() {
    return this.status;
  }
}
