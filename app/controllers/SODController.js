import moment from 'moment';
import SODSschema from '../schema/SODSchema';
import Role from '../schema/roleSchema';
import Employee from '../schema/employeeSchema';
import AppError from '../Errors/AppError';
import { cleanObject } from '../utils';

export const addLog = async (req, res, next) => {
  const { id } = req.user.employee;
  const {
    startOfDayDescription,
    endOfDayDescription,
    date,
    empStatus,
    verifiedByTL,
    verifiedByAdmin,
  } = req.body;

  let startOfDay = moment(date).startOf('day');
  let endOfDay = moment(date).endOf('day');

  const isSODexists = await SODSschema.findOne({
    date: { $gte: startOfDay, $lte: endOfDay },
    employee: id,
  });

  if (!isSODexists) {
    const sodData = new SODSschema({
      employee: id,
      startOfDayDescription,
      endOfDayDescription,
      date,
      empStatus,
      verifiedByTL,
      verifiedByAdmin,
    });

    sodData.save((err, data) => {
      if (err) console.log(err);
      else {
        next(data);
      }
    });
  } else {
    next(new AppError(422, 'SOD already exits', 'SOD is already there !'));
  }
};

export const approveLog = async (req, res, next) => {
  const sodId = req.params.id;
  const { id, role } = req.user.employee;

  const { isApproved } = req.body;
  const getRole = await Role.findById(role);

  if (isApproved == true) {
    if (getRole.type === 'ADMIN' || getRole.type === 'TL') {
      if (isApproved == true) {
        if (getRole.type === 'ADMIN') {
          SODSschema.findOneAndUpdate(
            { _id: sodId },
            {
              verifiedByAdmin: id,
            },
            (err, sod) => {
              if (err) {
                next(err);
              } else {
                next({ message: 'Log Approved' });
              }
            }
          );
        } else if (getRole.type === 'TL') {
          SODSschema.findOneAndUpdate(
            { _id: sodId },
            {
              verifiedByTL: id,
            },
            (err, sod) => {
              if (err) {
                next(err);
              } else {
                next({ message: 'Log Approved' });
              }
            }
          );
        }
      }
    } else {
      next(
        new AppError(
          402,
          'You are not allowed',
          'You are not allowed to approve'
        )
      );
    }
  } else {
    next(new AppError(408, 'not approved', 'Not approved'));
  }
};

export const getTeamSODs = async (req, res, next) => {
  const { id, role } = req.user.employee;
  const roleType = await Role.findOne({ _id: role });
  let getQueryDate = req.query.date;
  let teamID = req.query.team || 'AllEmployee';
  let todayDate;
  let todayStart;
  let todayEnd;

  if (getQueryDate == undefined) {
    todayDate = new Date();
    todayStart = todayDate.setHours(1, 1, 1);
    todayEnd = todayDate.setHours(22, 1, 1);
  } else {
    todayDate = new Date(getQueryDate);
    todayStart = todayDate.setHours(1, 1, 1);
    todayEnd = todayDate.setHours(22, 1, 1);
  }

  if (
    roleType.type == 'ADMIN' ||
    roleType.type == 'PM' ||
    roleType.type == 'HR'
  ) {
    if (teamID == 'AllEmployee') {
      let getSODs = await SODSschema.find({
        date: {
          $gte: todayStart,
          $lte: todayEnd,
        },
      })
        .populate({
          path: 'employee',
          populate: {
            path: 'team',
            select: {
              value: 1,
            },
          },
          select: {
            firstName: 1,
            lastName: 1,
          },
        })
        .populate({
          path: 'verifiedByTL',
          select: {
            firstName: 1,
            lastName: 1,
          },
        })
        .populate({
          path: 'verifiedByAdmin',
          select: {
            firstName: 1,
            lastName: 1,
          },
        });
      next(getSODs);
    } else {
      const getTeamMembers = await Employee.find({ team: { $in: teamID } });
      let teamMemberId = getTeamMembers.map((employee) => employee.id);
      let getSODs = await SODSschema.find({
        employee: teamMemberId,
        date: {
          $gte: todayStart,
          $lte: todayEnd,
        },
      }).populate({
        path: 'employee',
        populate: {
          path: 'team',
          select: {
            value: 1,
          },
        },
        select: {
          firstName: 1,
          lastName: 1,
        },
      });

      next(getSODs);
    }
  } else if (roleType.type == 'TL') {
    const getTeamMembers = await Employee.find({ team: { $in: teamID } });
    let teamMemberId = getTeamMembers.map((employee) => employee.id);
    let getSODs = await SODSschema.find({
      employee: teamMemberId,
      date: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    }).populate({
      path: 'employee',
      populate: {
        path: 'team',
        select: {
          value: 1,
        },
      },
      select: {
        firstName: 1,
        lastName: 1,
      },
    });

    next(getSODs);
  } else {
    const Teams = await Employee.findOne({ _id: id })
      .select({ team: 1 })
      .populate({ path: 'team' });

    let teamID = Teams.team.map((t) => t.id);
    const getTeamMembers = await Employee.find({ team: { $in: teamID } });

    let teamMemberId = getTeamMembers.map((employee) => employee.id);
    let getSODs = await SODSschema.find({
      employee: teamMemberId,
      date: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    }).populate({
      path: 'employee',
      populate: {
        path: 'team',
        select: {
          value: 1,
        },
      },
      select: {
        firstName: 1,
        lastName: 1,
      },
    });

    next(getSODs);
  }
};

export const addEOD = async (req, res, next) => {
  const { id } = req.params;
  const { endOfDayDescription } = req.body;

  const findSOD = SODSschema.findOne({ _id: id });

  if (findSOD) {
    SODSschema.findOneAndUpdate(
      { _id: id },
      {
        endOfDayDescription: endOfDayDescription,
      },
      { new: true },
      (err, SODdata) => {
        if (err) {
          next(err);
        } else {
          next(SODdata);
        }
      }
    );
  }
};

export const viewSODbyID = async (req, res, next) => {
  const { id } = req.params;

  const SODData = await SODSschema.findOne({ _id: id })
    .populate({
      path: 'employee',
      select: {
        firstName: 1,
        lastName: 1,
        email: 1,
      },
    })
    .populate({
      path: 'empStatus',
      select: {
        value: 1,
      },
    })
    .populate({
      path: 'verifiedByTL',
      select: {
        firstName: 1,
        lastName: 1,
        email: 1,
      },
    })
    .populate({
      path: 'verifiedByAdmin',
      select: {
        firstName: 1,
        lastName: 1,
        email: 1,
      },
    });

  if (!SODData) {
    next(new AppError(404, 'SOD data not found', 'SOD data not found'));
  } else {
    next(SODData);
  }
};

export const editSOD = async (req, res, next) => {
  const { id } = req.params;
  const { empStatus, startOfDayDescription, endOfDayDescription, date } =
    req.body;

  let data = {
    empStatus,
    startOfDayDescription,
    endOfDayDescription,
    date,
  };

  let filteredData = cleanObject(data);
  const findSOD = SODSschema.findOne({ _id: id });

  if (findSOD) {
    SODSschema.findOneAndUpdate(
      { _id: id },
      filteredData,
      { new: true },
      (err, SODdata) => {
        if (err) {
          next(err);
        } else {
          next(SODdata);
        }
      }
    );
  }
};

export const getMySOD = async (req, res, next) => {
  const { id } = req.user.employee;

  const mySOD = await SODSschema.find({ employee: id }).populate({
    path: 'employee',
    select: {
      firstName: 1,
      lastName: 1,
    },
  });
  next(mySOD);
};

export const getSODInfo = async (req, res, next) => {
  const { id } = req.params;

  const SODData = await SODSschema.findOne({ _id: id })
    .populate({
      path: 'employee',
      select: {
        firstName: 1,
        lastName: 1,
        email: 1,
      },
    })
    .populate({
      path: 'empStatus',
      select: {
        value: 1,
      },
    })
    .populate({
      path: 'verifiedByTL',
      select: {
        firstName: 1,
        lastName: 1,
        email: 1,
      },
    })
    .populate({
      path: 'verifiedByAdmin',
      select: {
        firstName: 1,
        lastName: 1,
        email: 1,
      },
    });

  if (!SODData) {
    next(new AppError(404, 'SOD data not found', 'SOD data not found'));
  } else {
    next(SODData);
  }
};
