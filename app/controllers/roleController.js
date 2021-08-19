import Role from '../schema/roleSchema';

export const addRole = (req, res, next) => {
  const { name, description, code, type } = req.body;

  console.log(name, description, code, type);
  const role = new Role({
    name,
    description,
    code,
    type,
  });

  role.save((err, roleData) => {
    if (err) {
      console.log(err);
    } else {
      next(roleData);
    }
  });
};

export const getRoles = async (req, res, next) => {
  const roles = await Role.find({});

  next(roles);
};
