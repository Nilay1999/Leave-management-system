import AppError from '../AppError';

export default class EmployeeNotFound extends AppError {
  /**
   * @status 400
   */
  constructor() {
    super(
      400,
      'Requested employee not found',
      'Employee with such credentials does not exist'
    );
  }
}
