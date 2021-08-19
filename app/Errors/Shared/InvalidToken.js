import AppError from '../AppError';

export default class InvalidToken extends AppError {
  /**
   * @status 401
   */
  constructor() {
    super(
      401,
      'Authorization not granted',
      'You are Unauthorized to access this resource'
    );
  }
}
