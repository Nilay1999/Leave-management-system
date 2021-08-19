import AppError from '../AppError';

export default class LeaveNotFound extends AppError {
  /**
   * @status 400
   */
  constructor() {
    super(
      400,
      'Requested Leave data not found',
      'Leave data with such credentials does not exist'
    );
  }
}
