import Logger from './logger';

const errorHandler = (data, req, res, next) => {
  if (data instanceof Error) {
    const status = data.status || 500;
    const message = data.message || 'Internal Server Error';
    Logger.error(message);
    res.status(status).send({
      success: 0,
      status,
      message: message,
      detail: data.detail || 'Contact Server admin',
    });
  } else {
    next(data);
  }
};
export default errorHandler;
