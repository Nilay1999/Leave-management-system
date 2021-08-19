import AppError from '../AppError';

export default class BadRequest extends AppError {
  /**
   * @status 400
   */
  constructor() {
    super(
      400,
      'Bad Request to the server',
      'Check your request body and parameters'
    );
  }
}
