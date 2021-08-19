import AppError from '../AppError';

export default class NoPendingLeave extends AppError {
  /**
   * @status 400
   */
  constructor() {
    super(
      400,
      'Pending Leave data not found',
      'There is no Pending Leave data '
    );
  }
}
