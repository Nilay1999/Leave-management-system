const roleHandler = (data, req, res, next) => {
  console.log('Inside roleHandler', 'data', data);
  next();
};
export default roleHandler;
