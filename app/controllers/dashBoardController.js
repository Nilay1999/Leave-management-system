import mongoose from 'mongoose';
import moment from 'moment';
import { countMonthLeaves, countCurrentYearLeaves } from '../utils';
import Leave from '../schema/LeaveSchema';
import Role from '../schema/roleSchema';
import Holiday from '../schema/holidaysSchema';
import EmployeeNotFound from '../Errors/Employee/EmployeeNotFound';

export const initialDashBoardData = async (req, res, next) => {
  let todayStart = new Date();
  todayStart.setHours(8, 0, 0);
  let todayEnd = new Date();
  todayEnd.setHours(21, 59, 59);

  let year = todayStart.getFullYear();
  let FloorMonth = moment().startOf('month');
  let ceilMonth = moment().endOf('month');

  let floorDate = new Date(year, 3, 1);
  let ceilDate = new Date(year + 1, 2, 31);

  if (!req.user) {
    next(new EmployeeNotFound());
  } else {
    let role = mongoose.Types.ObjectId(req.user.employee.role);
    let userId = req.user.employee.id;
    const userRole = await Role.findById(role);

    let totalMonthLeave = await countMonthLeaves(
      req.user.employee,
      FloorMonth,
      ceilMonth
    );

    let totalLeave = await countCurrentYearLeaves(
      req.user.employee,
      floorDate,
      ceilDate
    );

    const holidayCount = await Holiday.find({ holidayYear: moment().year() });
    let totalHolidays = holidayCount.length;
    const leave = await Leave.find({
      startDate: {
        $lte: todayStart,
      },
      endDate: {
        $gte: todayEnd,
      },
      status: 'approved',
    })
      .populate({
        path: 'requestFrom',
        populate: {
          path: 'team',
          select: {
            value: 1,
          },
        },
        select: {
          id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
        },
      })
      .populate({
        path: 'approvedBy',
        populate: {
          path: 'author ',
          select: {
            firstName: 1,
            lastName: 1,
            email: 1,
          },
          populate: {
            path: 'team',
            select: {
              value: 1,
            },
          },
        },
      })
      .populate({
        path: 'rejectedBy',
        populate: {
          path: 'author ',
          select: {
            firstName: 1,
            lastName: 1,
            email: 1,
          },
          populate: {
            path: 'team',
            select: {
              value: 1,
            },
          },
        },
      });

    const upComingLeaves = await Leave.find({
      startDate: {
        $gt: todayEnd,
      },
      status: 'approved',
    })
      .populate({
        path: 'requestFrom',
        populate: {
          path: 'team',
          select: {
            value: 1,
          },
        },
        select: {
          id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
        },
      })
      .populate({
        path: 'requestTo',
        populate: {
          path: 'team',
          select: {
            value: 1,
          },
        },
        select: {
          id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
        },
      })
      .populate({
        path: 'approvedBy',
        populate: {
          path: 'author ',
          select: {
            firstName: 1,
            lastName: 1,
            email: 1,
          },
          populate: {
            path: 'team',
            select: {
              value: 1,
            },
          },
        },
      })
      .populate({
        path: 'rejectedBy',
        populate: {
          path: 'author ',
          select: {
            firstName: 1,
            lastName: 1,
            email: 1,
          },
          populate: {
            path: 'team',
            select: {
              value: 1,
            },
          },
        },
      });

    if (
      userRole.type === 'TL' ||
      userRole.type === 'ADMIN' ||
      userRole.type === 'HR' ||
      userRole.type === 'PM'
    ) {
      const leaveRequests = await Leave.find({
        requestTo: userId,
        status: 'pending',
        requestFrom: {
          $ne: userId,
        },
      })
        .populate('requestFrom', {
          firstName: 1,
          lastName: 1,
          email: 1,
        })
        .populate('requestTo', {
          firstName: 1,
          lastName: 1,
          email: 1,
        })
        .populate({
          path: 'approvedBy',
          populate: {
            path: 'author ',
            select: {
              firstName: 1,
              lastName: 1,
              email: 1,
            },
            populate: {
              path: 'team',
              select: {
                value: 1,
              },
            },
          },
        })
        .populate({
          path: 'rejectedBy',
          populate: {
            path: 'author ',
            select: {
              firstName: 1,
              lastName: 1,
              email: 1,
            },
            populate: {
              path: 'team',
              select: {
                value: 1,
              },
            },
          },
        });

      next({
        totalLeave: totalLeave,
        totalMonthLeave: totalMonthLeave,
        leaveRequests: leaveRequests || [],
        TodayOnleave: leave || [],
        upComingLeaves: upComingLeaves || [],
        totalHolidays: totalHolidays,
      });
    } else {
      next({
        totalLeave: totalLeave,
        totalMonthLeave: totalMonthLeave,
        leaveRequests: [],
        TodayOnleave: leave || [],
        upComingLeaves: upComingLeaves || [],
        totalHolidays: totalHolidays,
      });
    }
  }
};
