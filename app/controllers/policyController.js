import Policy from '../schema/policySchema';
import Role from '../schema/roleSchema';
import AppError from '../Errors/AppError';
import { cleanObject } from '../utils';

export const viewPolicy = async (req, res, next) => {
  const { id } = req.params;
  const policy = await Policy.findOne({ _id: id });
  if (!policy) {
    next(new AppError(404, 'Policy not found', 'Policy not found'));
  } else {
    next(policy);
  }
};

export const addPolicy = (req, res, next) => {
  const { title, status, detail } = req.body;

  const policy = new Policy({
    title,
    status,
    detail,
  });

  policy.save((err, policyData) => {
    if (err) {
      next(err);
    } else {
      next(policyData);
    }
  });
};

export const getPolicies = async (req, res, next) => {
  const { role } = req.user.employee;
  const roleType = await Role.findOne({ _id: role });
  let policies;
  if (roleType.type == 'HR' || roleType.type == 'ADMIN') {
    policies = await Policy.find({});
  } else {
    policies = await Policy.find({ status: 'Active' });
  }

  if (!policies) {
    next(
      new AppError(404, 'Policies not found', 'No Active policies right now')
    );
  } else {
    next(policies);
  }
};

export const editPolicy = async (req, res, next) => {
  const { id } = req.params;
  const { title, status, detail } = req.body;

  let data = {
    title,
    status,
    detail,
  };

  let filteredData = cleanObject(data);
  const policy = await Policy.findById(id);

  if (!policy) {
    next(new AppError(404, 'Policy not found', 'Policy not found'));
  } else {
    Policy.findByIdAndUpdate(id, filteredData, { new: true }, (err, data) => {
      if (err) {
        next(err);
      } else {
        next(data);
      }
    });
  }
};

export const deletePolicy = async (req, res, next) => {
  const { id } = req.params;

  await Policy.findByIdAndDelete(id, (err, success) => {
    if (err) {
      next(err);
    } else {
      next('Successfully Deleted !');
    }
  });
};
