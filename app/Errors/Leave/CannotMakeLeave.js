import AppError from '../AppError';

export default class CannotMakeLeave extends AppError {
  /**
   * @status 400
   */
  constructor(reason) {
    super(400, 'Cannot create Leave', reason || 'Contact team leader');
  }
}
