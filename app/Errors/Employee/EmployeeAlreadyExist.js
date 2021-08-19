import AppError from '../AppError';

export default class EmployeeAlreadyExist extends AppError {
  /**
   * @status 403
   */
  constructor() {
    super(
      403,
      'Requested employee already exists',
      'Employee with such credentials already exist try creating new User with new credentials'
    );
  }
}
