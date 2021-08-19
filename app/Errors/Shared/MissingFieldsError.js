import AppError from '../AppError';

export default class MissingFieldsError extends AppError {
  /**
   * @param {*} fields array of string with missing fields
   * @status 400
   */
  constructor(fields = []) {
    const message = fields;
    super(400, 'Some field(s) are missing!', message);
  }
}
