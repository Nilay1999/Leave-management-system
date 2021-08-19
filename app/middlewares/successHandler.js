const successHandler = (data, req, res, next) => {
  if (data && !(data instanceof Error)) {
    res.status(200).send({
      success: 1,
      status: 200,
      message: data.message || 'Successfull operation!',
      data,
    });
  }
  next();
};
export default successHandler;
