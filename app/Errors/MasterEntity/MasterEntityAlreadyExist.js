import AppError from '../AppError';

export default class MasterEntityAlreadyExist extends AppError {
  /**
   * @status 403
   */
  constructor() {
    super(
      403,
      'Requested Master Entity already exists',
      'Master Entity already exists try again'
    );
  }
}
