import moment from 'moment';
import Employee from '../schema/employeeSchema';
import Role from '../schema/roleSchema';
import AppError from '../Errors/AppError';
import AllocatedLeave from '../schema/allocatedLeaveSchema';

export const addLeave = async (req, res, next) => {
  const { id } = req.params;
  const { totalDay, year } = req.body;

  const leaveData = await AllocatedLeave.findOne({
    employee: id,
    year: year,
  });

  if (leaveData) {
    await AllocatedLeave.findOneAndUpdate(
      {
        employee: id,
        year: year,
      },
      {
        $inc: {
          usedLeaves: totalDay,
          pendingLeaves: -totalDay,
        },
      }
    );
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

export const getLeaveByYear = async (req, res, next) => {
  const { year } = req.params;

  const Leave = await AllocatedLeave.find({
    year: year,
  }).populate({
    path: 'employee',
    select: {
      firstName: 1,
      lastName: 1,
    },
  });
  if (!Leave) {
    next(new AppError(404, 'Leave Data not Found', 'Leave Data not found'));
  } else {
    next(Leave);
  }
};

export const getLeaveData = async (req, res, next) => {
  const { id } = req.params;
  let currentYear = moment().year();
  let { year } = req.params;
  const Leave = await AllocatedLeave.findOne({
    employee: id,
    year: year,
  });
  if (!Leave) {
    res.json(Leave);
  } else {
    res.json(Leave);
  }
};

export const allocateLeave = async (req, res, next) => {
  let currentYear = moment().year();
  let finenceYearStart = new Date(currentYear, 3, 2);
  let finenceYearEnd = new Date(parseInt(currentYear, 10) + 1, 2, 31);

  let startOfDay = moment().startOf('day');
  let endOfDay = moment().endOf('day');

  const allEmployee = await Employee.find({});

  allEmployee.forEach(async (emp) => {
    let isConfirmed = emp.isConfirmedEmployee;
    if (isConfirmed && finenceYearStart >= emp.probationOverDate) {
      if (finenceYearStart >= emp.probationOverDate) {
        const isAllocated = await AllocatedLeave.findOne({
          employee: emp.id,
          year: finenceYearStart.getFullYear(),
        });

        if (isAllocated) {
          await AllocatedLeave.findOneAndUpdate(
            {
              employee: emp.id,
              year: finenceYearStart.getFullYear(),
            },
            {
              $set: {
                allocatedLeaves: 17,
                pendingLeaves: 17,
              },
            }
          );
        } else {
          const leaveAllocate = new AllocatedLeave({
            employee: emp.id,
            year: currentYear,
            allocatedLeaves: 17,
          });

          leaveAllocate.save((err, success) => {
            if (err) throw err;
          });
        }
      }
    }

    if (
      !isConfirmed &&
      emp.probationOverDate >= startOfDay &&
      emp.probationOverDate <= endOfDay
    ) {
      const joinedBetweenYear = await Employee.findOne({
        isConfirmedEmployee: false,
        _id: emp.id,
        probationOverDate: {
          $gte: finenceYearStart,
          $lte: finenceYearEnd,
        },
      }).select({ joinDate: 1, dateOfBirth: 1, probationOverDate: 1 });

      if (joinedBetweenYear) {
        const getUnconfirmedEmployee = await Employee.findOne({
          isConfirmedEmployee: false,
          probationOverDate: { $gte: startOfDay, $lte: endOfDay },
        });

        if (getUnconfirmedEmployee) {
          await Employee.findOneAndUpdate(
            {
              _id: emp.id,
            },
            { $set: { isConfirmedEmployee: true } }
          );

          let DOB = new Date(
            currentYear,
            new Date(emp.joinDate).getMonth(),
            new Date(emp.joinDate).getDate()
          );

          let totalMonths;
          let totalAllocatedLeave;
          if (emp.probationOverDate.getDate() > 15) {
            totalMonths = 12 - emp.probationOverDate.getMonth() + 3;
          } else {
            totalMonths = 13 - emp.probationOverDate.getMonth() + 3;
          }

          if (emp.probationOverDate <= DOB || finenceYearEnd >= DOB) {
            let decimal = (totalMonths * 17) / 12;
            let reminder = decimal - parseInt(decimal, 10);
            if (reminder > 0.5) {
              totalAllocatedLeave = Math.ceil(decimal);
            } else if (reminder == 0.5) {
              totalAllocatedLeave = decimal;
            } else {
              totalAllocatedLeave = Math.floor(decimal);
            }
          } else {
            let decimal = (totalMonths * 16) / 12;

            let reminder = decimal - parseInt(decimal, 10);
            if (reminder > 0.5) {
              totalAllocatedLeave = Math.ceil(decimal);
            } else if (reminder == 0.5) {
              totalAllocatedLeave = decimal;
            } else {
              totalAllocatedLeave = Math.floor(decimal);
            }
          }
          const isLeaveAvailable = await AllocatedLeave.findOne({
            employee: emp.id,
            year: currentYear,
          });
          if (!isLeaveAvailable) {
            const leaveData = new AllocatedLeave({
              employee: emp.id,
              year: currentYear,
              allocatedLeaves: totalAllocatedLeave,
              pendingLeaves: totalAllocatedLeave,
            });
            leaveData.save();
          } else {
            await AllocatedLeave.findOneAndUpdate(
              {
                employee: emp.id,
                year: currentYear,
              },
              {
                $set: {
                  allocatedLeaves: totalAllocatedLeave,
                  pendingLeaves: totalAllocatedLeave,
                },
              }
            );
          }
        } else {
          return;
        }
      }
    } else if (!isConfirmed) {
      const isLeaveAvailable = await AllocatedLeave.findOne({
        employee: emp.id,
        year: currentYear,
      });
      if (!isLeaveAvailable) {
        const leaveData = new AllocatedLeave({
          employee: emp.id,
          year: currentYear,
          allocatedLeaves: 0,
          pendingLeaves: 0,
        });
        leaveData.save();
      }
    }
  });
  res.sendStatus(200);
};

export const carryForwardLeave = async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.user.employee;
  let currentYear = moment().year();
  const roleValue = await Role.findOne({
    _id: role,
  }).select({ type: 1 });

  if (roleValue.type == 'ADMIN' || roleValue.type == 'HR') {
    const employeeLeave = await AllocatedLeave.findOne({
      $expr: { $lt: ['$usedLeaves', '$allocatedLeaves'] },
      employee: id,
      year: currentYear - 1,
      isCarryForward: false,
    });
    if (employeeLeave) {
      let carriedLeave =
        employeeLeave.allocatedLeaves - employeeLeave.usedLeaves;

      const isLeaveAllocated = await AllocatedLeave.findOne({
        employee: id,
        year: currentYear,
      });

      if (isLeaveAllocated) {
        await AllocatedLeave.findOneAndUpdate(
          {
            employee: id,
            year: currentYear - 1,
          },
          {
            $set: {
              isCarryForward: true,
            },
          }
        );

        const currentYearLeave = await AllocatedLeave.findOne({
          employee: id,
          year: currentYear,
        });

        if (currentYearLeave) {
          carriedLeave = carriedLeave + currentYearLeave.allocatedLeaves;
          await AllocatedLeave.findOneAndUpdate(
            {
              employee: id,
              year: currentYear,
            },
            {
              allocatedLeaves: carriedLeave,
            }
          );

          next({ message: 'Successfully Carry forwarded !' });
        } else {
          next(new AppError(404, 'Leave not found', 'Leave not found'));
        }
      } else {
        next(
          new AppError(
            404,
            'Current Year Leaves not Allocated',
            'Current Year Leaves not Allocated'
          )
        );
      }
    } else {
      next(
        new AppError(
          404,
          'Already carry forwarded or Leave not found in Year',
          'Already carry forwarded or Leave not found in Year'
        )
      );
    }
  } else {
    next(new AppError(405, 'You are not Allowed,Contact Admin', 'Not allowed'));
  }
};

export const compensateLeave = async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.user.employee;
  let currentYear = moment().year();
  const roleValue = await Role.findOne({
    _id: role,
  }).select({ type: 1 });

  if (roleValue.type == 'ADMIN' || roleValue.type == 'HR') {
    const findLeave = await AllocatedLeave.findOne({
      employee: id,
      year: currentYear - 1,
    }).select({ allocatedLeaves: 1 });

    if (!findLeave) {
      res.sendStatus(404);
    } else {
      await AllocatedLeave.findOneAndUpdate(
        {
          employee: id,
          year: currentYear - 1,
        },
        {
          $set: {
            isCompensated: true,
            usedLeaves: findLeave.allocatedLeaves,
            pendingLeaves: 0,
          },
        }
      );
      res.sendStatus(200);
    }
  } else {
    next(new AppError('405', 'You are not Allowed', 'You are not Allowed'));
  }
};
