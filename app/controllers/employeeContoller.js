import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import base64ToImage from 'base64-to-image';
import fs from 'fs';
import { MissingFieldsError } from '../Errors/Shared';
import Employee from '../schema/employeeSchema';
import Role from '../schema/roleSchema';
import ProvideCredentials from '../Errors/Employee/ProvideCredentials';
import InvalidCredentials from '../Errors/Employee/InvalidCredentials';
import CannotAddEmployee from '../Errors/Employee/CannotAddEmployee';
import EmployeeNotFound from '../Errors/Employee/EmployeeNotFound';
import EmployeeAlreadyExist from '../Errors/Employee/EmployeeAlreadyExist';
import CannotUpdateEmployee from '../Errors/Employee/CannotUpdateEmployee';
import Roles from '../constants/roles';
import { handleValidationError, cleanObject } from '../utils';
import { AppError } from '../Errors';
import Logger from '../middlewares/logger';
import * as config from '../env';

/**
 * @requires firstName,
        lastName,
        email,
        password,
        contactNumber,
        bloodGroup,
        gender,
        dateOfBirth,
        address,
 * @description Registration of Employee Data
*/

export const registerEmployee = async (req, res, next) => {
  const {
    employeeId,
    firstName,
    lastName,
    email,
    emergencyContactNumber,
    totalExperience,
    skypeId,
    companyEmail,
    companyGmail,
    joinDate,
    password,
    contactNumber,
    bloodGroup,
    gender,
    dateOfBirth,
    address,
    role,
    designation,
    technology,
    team,
    imageFile,
    reportingTo,
  } = req.body;

  let profilePicture;
  if (imageFile != undefined) {
    if (imageFile.includes('data:')) {
      let path = './app/uploads/';
      let imageInfo = base64ToImage(imageFile, path);
      profilePicture = '/uploads/' + imageInfo.fileName;
    } else {
      let index = imageFile.indexOf('/uploads');
      profilePicture = imageFile.substr(index);
    }
  } else {
    let index = imageFile.indexOf('/uploads');
    profilePicture = imageFile.substr(index);
  }

  const isEmployeeExists = await Employee.findOne({ email: email });

  if (!isEmployeeExists) {
    let joiningDate = new Date(joinDate);
    let probOverDate = new Date(
      joiningDate.getFullYear(),
      joiningDate.getMonth() + 3,
      joiningDate.getDate()
    );

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const employee = new Employee({
      employeeId,
      firstName,
      lastName,
      email,
      password: hashPassword,
      contactNumber,
      bloodGroup,
      gender,
      dateOfBirth,
      address,
      emergencyContactNumber,
      totalExperience,
      skypeId,
      companyEmail,
      companyGmail,
      joinDate,
      probationOverDate: probOverDate,
      role,
      designation,
      technology,
      team,
      profilePicture,
      reportingTo,
    });

    employee.save((err, employeeData) => {
      if (err) {
        if (err.name === 'ValidationError') {
          next(new MissingFieldsError(handleValidationError(err).fields));
        }
        next(new CannotAddEmployee());
      } else {
        next(employeeData);
      }
    });
  } else {
    next(new EmployeeAlreadyExist());
  }
};

/**
 *@description Employee Sign In
 *@requires email,password
 */

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new ProvideCredentials(!password, !email));
  } else {
    const employee = await Employee.findOne({ email: email });
    if (!employee) {
      next(new EmployeeNotFound());
    } else {
      const matchPassword = await bcrypt.compare(password, employee.password);

      const employeeTeam = await Employee.findOne({ email: email })
        .populate({
          path: 'team',
          value: 1,
        })
        .populate({
          path: 'role',
          code: 1,
        });
      if (!matchPassword) {
        next(new InvalidCredentials(!matchPassword));
      } else {
        const token = jwt.sign({ employee }, config.secret);

        res.json({
          token,
          employee: {
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            contactNumber: employee.bloodGroup,
            bloodGroup: employee.bloodGroup,
            gender: employee.gender,
            dateOfBirth: employee.dateOfBirth,
            address: employee.address,
            designation: employee.designation,
            role: employeeTeam.role,
            team: employeeTeam.team,
            profilePicture: `${config.fileUrl}${employee.profilePicture}` || '',
          },
          permissions: Roles[employeeTeam.role.type],
        });
      }
    }
  }
};

/**
 * @requires id as req parameter
 * @description Get All Employees Data
 */

export const getEmployeeDetail = async (req, res, next) => {
  const { id } = req.params;

  let employeeData = await Employee.findOne({ _id: id })
    .select({ password: 0 })
    .populate('team')
    .populate('role')
    .populate('designation')
    .populate('technology')
    .populate({
      path: 'reportingTo',
      select: {
        firstName: 1,
        lastName: 1,
        email: 1,
        employeeId: 1,
      },
    });

  employeeData.profilePicture = `${config.fileUrl}${employeeData.profilePicture}`;
  next(employeeData);
};

export const profile = async (req, res, next) => {
  let { user } = req;
  const { employee } = user;
  let { id } = employee;

  const employeeData = await Employee.findOne({ _id: id })
    .select({ password: 0 })
    .populate('team')
    .populate('role')
    .populate('designation')
    .populate('technology')
    .populate({
      path: 'reportingTo',
      select: {
        firstName: 1,
        lastName: 1,
        employeeId: 1,
        email: 1,
      },
    });

  employeeData.profilePicture = `${config.fileUrl}${employeeData.profilePicture}`;
  next(employeeData);
};

/**
 * @description Update Data of Employee
 * @requires employeeID
 */

export const editOwnProfile = async (req, res, next) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    contactNumber,
    bloodGroup,
    gender,
    dateOfBirth,
    address,
    imageFile,
  } = req.body;

  let profilePicture;
  if (imageFile != undefined) {
    if (imageFile.includes('data:')) {
      const oldImagePath = await Employee.findOne({ _id: id });
      let pathToFile = oldImagePath.profilePicture;
      fs.unlink(`app/${pathToFile}`, (err) => {
        if (err) {
          Logger.warn('Current image file not found');
        } else {
          Logger.info('Image updated');
        }
      });
      let path = './app/uploads/';
      let imageInfo = base64ToImage(imageFile, path);
      profilePicture = '/uploads/' + imageInfo.fileName;
    } else {
      let index = imageFile.indexOf('/uploads');
      profilePicture = imageFile.substr(index);
    }
  } else {
    let index = imageFile.indexOf('/uploads');
    profilePicture = imageFile.substr(index);
  }

  let data = {
    firstName,
    lastName,
    email,
    contactNumber,
    bloodGroup,
    gender,
    dateOfBirth,
    address,
    profilePicture,
  };

  const filteredData = cleanObject(data);

  Employee.findOneAndUpdate(
    { _id: id },
    filteredData,
    { new: true },
    (err, updatedData) => {
      next({
        message: 'Data updated Successfully !',
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        email: updatedData.email,
        contactNumber: updatedData.contactNumber,
        bloodGroup: updatedData.bloodGroup,
        gender: updatedData.gender,
        dateOfBirth: updatedData.dateOfBirth,
        address: updatedData.address,
        profilePicture: `${config.fileUrl}${updatedData.profilePicture}`,
      });
    }
  );
};

export const updateByAdmin = async (req, res, next) => {
  const { id } = req.params;
  const adminRole = req.user.employee.role;
  const getRole = await Role.findById(adminRole);
  const {
    totalExperience,
    skypeId,
    companyEmail,
    companyGmail,
    joinDate,
    newRole,
  } = req.body;
  let role = mongoose.Types.ObjectId(newRole);

  if (getRole.type === 'ADMIN' || getRole.type === 'HR') {
    let data = {
      totalExperience,
      skypeId,
      companyEmail,
      companyGmail,
      joinDate,
      role,
    };
    const filteredData = cleanObject(data);

    Employee.findOneAndUpdate(
      { _id: id },
      filteredData,
      { new: true },
      (err, updatedData) => {
        next({
          message: 'Data updated Successfully !',
          totalExperience: updatedData.totalExperience,
          skypeId: updatedData.skypeId,
          companyEmail: updatedData.companyEmail,
          companyGmail: updatedData.companyGmail,
          joinDate: updatedData.joinDate,
          role: updatedData.role,
        });
      }
    );
  } else {
    next(new CannotUpdateEmployee());
  }
};

export const deleteEmployee = (req, res, next) => {
  Employee.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) {
      throw err;
    } else {
      next(data);
    }
  });
};

export const getEmployeeList = async (req, res, next) => {
  const { id } = req.user.employee;
  const allEmployees = await Employee.find({
    _id: {
      $ne: id,
    },
  })
    .populate({
      path: 'role',
      select: {
        type: 1,
      },
    })
    .populate({
      path: 'team',
      select: {
        value: 1,
      },
    })
    .populate({
      path: 'reportingTo',
      select: {
        firstName: 1,
        lastName: 1,
        email: 1,
        employeeId: 1,
      },
    });
  next(allEmployees);
};

export const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const { id } = req.params;
  const employee = await Employee.findOne({ _id: id });

  if (!employee) {
    next(new EmployeeNotFound());
  } else {
    const matchPassword = await bcrypt.compare(
      currentPassword,
      employee.password
    );
    if (!matchPassword) {
      next(
        new AppError(401, 'Password mismatch', 'Please enter correct password')
      );
    } else {
      if (newPassword == confirmPassword) {
        if (newPassword != currentPassword) {
          const salt = await bcrypt.genSalt();
          const hashPassword = await bcrypt.hash(newPassword, salt);
          Employee.findByIdAndUpdate(
            id,
            {
              password: hashPassword,
            },
            (err, password) => {
              if (err) {
                next(
                  new AppError(
                    400,
                    'Cannot update data',
                    'Failed To update password'
                  )
                );
              } else {
                next({
                  message: 'Successfully Password updated !',
                });
              }
            }
          );
        } else {
          next(
            new AppError(
              401,
              'Check your password',
              'Old password cannot be your new password !'
            )
          );
        }
      } else {
        next(
          new AppError(
            406,
            'password mismatch',
            'Please confirm your new password'
          )
        );
      }
    }
  }
};

export const editEmployeeProfile = async (req, res, next) => {
  const { id } = req.params;
  const adminRole = req.user.employee.role;
  const getRole = await Role.findById(adminRole);
  const {
    firstName,
    lastName,
    email,
    emergencyContactNumber,
    totalExperience,
    skypeId,
    companyEmail,
    companyGmail,
    password,
    contactNumber,
    bloodGroup,
    gender,
    dateOfBirth,
    address,
    designation,
    technology,
    team,
    role,
    imageFile,
    employeeId,
    joinDate,
    reportingTo,
  } = req.body;

  let hashPassword;
  if (password != undefined || password != null) {
    const salt = await bcrypt.genSalt();
    hashPassword = await bcrypt.hash(password, salt);
  }

  let profilePicture;
  if (imageFile != undefined) {
    if (imageFile.includes('data:')) {
      const oldImagePath = await Employee.findOne({ _id: id });
      let pathToFile = oldImagePath.profilePicture;
      fs.unlink(`app/${pathToFile}`, (err) => {
        if (err) {
          Logger.error('Old file not found');
        } else {
          Logger.error('Old file replaced with new one');
        }
      });
      let path = './app/uploads/';
      let imageInfo = base64ToImage(imageFile, path);
      profilePicture = '/uploads/' + imageInfo.fileName;
    } else {
      let index = imageFile.indexOf('/uploads');
      profilePicture = imageFile.substr(index);
    }
  } else {
    let index = imageFile.indexOf('/uploads');
    profilePicture = imageFile.substr(index);
  }

  let newRole = mongoose.Types.ObjectId(role);

  if (getRole.type === 'ADMIN' || getRole.type === 'HR') {
    let data = {
      firstName,
      lastName,
      email,
      emergencyContactNumber,
      totalExperience,
      skypeId,
      companyEmail,
      companyGmail,
      password: hashPassword,
      contactNumber,
      bloodGroup,
      gender,
      dateOfBirth,
      address,
      designation,
      technology,
      team,
      role: newRole,
      profilePicture,
      employeeId,
      joinDate,
      reportingTo,
    };
    const filteredData = cleanObject(data);

    Employee.findOneAndUpdate(
      { _id: id },
      filteredData,
      { new: true },
      (err, updatedData) => {
        if (err) {
          next(err);
        } else {
          next({
            message: 'Data updated Successfully !',
          });
        }
      }
    );
  } else {
    next(new AppError(401, 'You are not allowed', 'You are not allowed'));
  }
};
