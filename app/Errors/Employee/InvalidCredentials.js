import AppError from '../AppError';

export default class InvalidCredentials extends AppError {
  /**
   *
   * @param {*} password Is password inValid?
   * @param {*} email Is email inValid?
   * @status 401
   */
  constructor(password = true, email = true) {
    let message = 'Provide correct Credentials';
    if (password && email) message = 'Incorrect password and email address!';
    else if (password) message = 'Incorrect password';
    else if (email) message = 'Incorrect email address';
    super(401, 'Invalid Credentials!', message);
  }
}
