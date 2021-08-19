import jwt from 'jsonwebtoken';
import * as config from '../env';

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      res.status(401).json({
        msg: 'No authentication token, authorization denied !.',
      });
    }

    const user = jwt.verify(token, config.secret);
    req.user = user;

    // req.role = 'admin';
    if (!user) {
      res.status(401).json({
        msg: 'Token verification failed, authorization denied !.',
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default auth;
