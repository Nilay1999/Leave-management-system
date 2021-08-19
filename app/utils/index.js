import moment from 'moment';
import cron from 'node-cron';
import Leave from '../schema/LeaveSchema';
import Employee from '../schema/employeeSchema';
import axios from 'axios';
import Logger from '../middlewares/logger';

import * as config from '../env';

export const handleValidationError = (err) => {
  let errors = Object.values(err.errors).map((el) => el.message);
  let fields = Object.values(err.errors).map((el) => el.path);
  if (errors.length > 1) {
    const formattedErrors = errors.join(' ');
    return { messages: formattedErrors, fields: fields };
  }
  return { messages: errors, fields: fields };
};
export const intersectionArray = (array1 = [], array2 = []) =>
  array1.filter((value) => array2.includes(value));

export const cleanObject = (data) => {
  const keys = Object.keys(data).filter((k) => data[k] !== undefined);
  let parameter = {};
  keys.forEach((k) => {
    parameter[k] = data[k];
  });
  return parameter;
};

export const getBusinessDays = (startDate, endDate) => {
  const d1 = moment(startDate);
  const d2 = moment(endDate);

  const days = d2.diff(d1, 'days') + 1;
  let newDay = d1.toDate();
  let workingDays = 0;
  for (let i = 0; i < days; i++) {
    const day = newDay.getDay();
    newDay = d1.add(1, 'days').toDate();
    const isWeekend = day % 6 === 0;
    if (!isWeekend) {
      workingDays++;
    }
  }
  return workingDays;
};

export const countMonthLeaves = async (employee, FloorMonth, ceilMonth) => {
  let countMonthLeave = 0;

  const monthFullLeave = await Leave.find({
    requestFrom: employee.id,
    startDate: {
      $gte: FloorMonth,
      $lte: ceilMonth,
    },
    endDate: {
      $gte: FloorMonth,
      $lte: ceilMonth,
    },
    status: 'approved',
    type: 'Full',
  });

  const monthHalfLeave = await Leave.find({
    requestFrom: employee.id,
    startDate: {
      $gte: FloorMonth,
      $lte: ceilMonth,
    },
    endDate: {
      $gte: FloorMonth,
      $lte: ceilMonth,
    },
    status: 'approved',
    type: 'Half',
  });
  let halfLeaves = monthHalfLeave.length / 2;

  monthFullLeave.forEach((e) => {
    let startDate = moment(e.startDate).startOf('day');
    let endDate = moment(e.endDate).endOf('day');

    function getBusinessDays(startDate, endDate) {
      const d1 = moment(startDate);
      const d2 = moment(endDate);

      const days = d2.diff(d1, 'days') + 1;
      let newDay = d1.toDate();
      let workingDays = 0;
      for (let i = 0; i < days; i++) {
        const day = newDay.getDay();
        newDay = d1.add(1, 'days').toDate();
        const isWeekend = day % 6 === 0;
        if (!isWeekend) {
          workingDays++;
        }
      }
      return workingDays;
    }
    countMonthLeave = countMonthLeave + getBusinessDays(startDate, endDate);
  });

  return countMonthLeave + halfLeaves;
};

export const countCurrentYearLeaves = async (employee, floorDate, ceilDate) => {
  const fullLeaveTaken = await Leave.find({
    requestFrom: employee.id,
    createdAt: {
      $gte: floorDate,
      $lte: ceilDate,
    },
    status: 'approved',
    type: 'Full',
  });

  const halfLeaveTaken = await Leave.find({
    requestFrom: employee.id,
    createdAt: {
      $gte: floorDate,
      $lte: ceilDate,
    },
    status: 'approved',
    type: 'Half',
  });

  let halfLeave = halfLeaveTaken.length / 2;
  let count = 0;

  fullLeaveTaken.forEach((e) => {
    let startDate = moment(e.startDate).startOf('day');
    let endDate = moment(e.endDate).endOf('day');

    function getBusinessDays(startDate, endDate) {
      const d1 = moment(startDate);
      const d2 = moment(endDate);

      const days = d2.diff(d1, 'days') + 1;
      let newDay = d1.toDate();
      let workingDays = 0;
      for (let i = 0; i < days; i++) {
        const day = newDay.getDay();
        newDay = d1.add(1, 'days').toDate();
        const isWeekend = day % 6 === 0;
        if (!isWeekend) {
          workingDays++;
        }
      }
      return workingDays;
    }
    count = count + getBusinessDays(startDate, endDate);
  });

  let totalLeaves = count + halfLeave;
  return totalLeaves;
};

export const allocateLeave = () => {
  cron.schedule('0 1 * * *', async () => {
    try {
      await axios.put(`${config.fileUrl}/api/leaveAllocation`);
    } catch (error) {
      Logger.error(error.responce.status);
    }
  });
};
