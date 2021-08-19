import AppError from '../AppError';

export default class CannotAddEmployee extends AppError {
  /**
   * @status 400
   */
  constructor() {
    super(400, 'Cannot Add Employee');
  }
}
