import AppError from '../AppError';

export default class MasterEntityNotFound extends AppError {
  /**
   * @status 400
   */
  constructor() {
    super(
      400,
      'Requested Master Entity not found',
      'Master Entity does not exist'
    );
  }
}
