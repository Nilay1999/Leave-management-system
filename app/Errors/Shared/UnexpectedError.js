import AppError from '../AppError';

export default class UnexpectedError extends AppError {
  /**
   * @param {*} Module name of the module
   * @status 403
   */
  constructor(Module) {
    const message = Module
      ? `${Module} facing Unexpected Error`
      : 'Facing unexpected error';
    super(403, 'Unexpected Error', message);
  }
}
