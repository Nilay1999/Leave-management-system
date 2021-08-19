export default class AppError extends Error {
  constructor(status, message, detail) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.status = status || 400;
    this.message = message;
    this.detail = detail || 'Some Application Error Occured!';
  }
}
