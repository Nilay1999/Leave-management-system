import AppError from '../AppError';

export default class CannotUpdateEmployee extends AppError {
  /**
   * @status 403
   */
  constructor() {
    super(
      405,
      'Not allowed to update Date',
      'Your are not allowed to update employee data , Please contact Admin '
    );
  }
}
