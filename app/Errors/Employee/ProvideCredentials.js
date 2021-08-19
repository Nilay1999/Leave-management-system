import AppError from '../AppError';

export default class ProvideCredentials extends AppError {
  /**
   *
   * @param {*} password Is password null?
   * @param {*} email Is email null?
   * @status 401
   */
  constructor(password = true, email = true) {
    let message = 'Provide Credentials';
    if (password && email) message = 'Enter password and email address!';
    else if (email) message = 'Please enter email-address';
    else if (password) message = 'Please enter password';
    super(401, 'Provide Credentials!', message);
  }
}
