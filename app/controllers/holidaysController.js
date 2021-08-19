import Holiday from '../schema/holidaysSchema';
import AppError from '../Errors/AppError';
import { cleanObject } from '../utils';
import moment from 'moment';
const fs = require('fs');
// const csv = require('csv-parser')
const CSVToJSON = require('csvtojson');

/**
 * @description Add holidays
 */

export const addHolidays = async (req, res, next) => {
  const { holidayYear, holidayDate, holidayName } = req.body;

  const isHolidayExists = await Holiday.findOne({
    holidayYear: holidayYear,
    holidayDate: holidayDate,
  });

  if (!isHolidayExists) {
    const holiday = new Holiday({
      holidayYear,
      holidayDate,
      holidayName,
    });

    holiday.save((err, holidayData) => {
      if (err) console.log(err);
      else {
        next(holidayData);
      }
    });
  } else {
    next(
      new AppError(422, 'Holiday already exits', 'Holiday is already there !')
    );
  }
};
/**
 * @description Get all holidays
 */
export const getHolidays = async (req, res, next) => {
  let { year } = req.params;
  let holidayData;
  if (year == undefined) {
    holidayData = await Holiday.find({ holidayYear: moment().year() });
    if (!holidayData) {
      next(new AppError(404, 'Data not found', 'Data not found'));
    } else {
      next(holidayData);
    }
  } else {
    holidayData = await Holiday.find({ holidayYear: year });
    if (!holidayData) {
      next(new AppError(404, 'Data not found', 'Data not found'));
    } else {
      next(holidayData);
    }
  }
};

/**
 * @description Update holiday data
 
 */
export const editHoliday = async (req, res, next) => {
  const { id } = req.params;
  const { holidayYear, holidayDate, holidayName } = req.body;

  let data = {
    holidayYear,
    holidayDate,
    holidayName,
  };
  const filterData = cleanObject(data);

  Holiday.findOneAndUpdate(
    { _id: id },
    filterData,
    { new: true },
    (err, updatedHoliday) => {
      next({
        message: 'Data updated Successfully !',
        holidayYear: updatedHoliday.holidayYear,
        holidayDate: updatedHoliday.holidayDate,
        holidayName: updatedHoliday.holidayName,
      });
    }
  );
};

export const deleteHoliday = (req, res, next) => {
  Holiday.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) {
      throw err;
    } else {
      next(data);
    }
  });
};

export const upload = async (req, res, next) => {
  if (req.file == undefined) {
    next(new AppError(400, 'Please attach CSV file', 'Please attach CSV file'));
  } else {
    const path = './app/uploads/csv/' + req.file.originalname;
    CSVToJSON()
      .fromFile(path)
      .then(async (holidaylist) => {
        if (holidaylist.length != 0) {
          holidaylist.forEach(async (ele) => {
            const isHolidayExists = await Holiday.findOne({
              holidayYear: ele.holidayYear,
              holidayDate: ele.holidayDate,
              holidayName: ele.holidayName,
            });
            if (!isHolidayExists) {
              const holiday = new Holiday({
                holidayYear: ele.holidayYear,
                holidayDate: ele.holidayDate,
                holidayName: ele.holidayName,
              });
              holiday.save();
            }
          });
          next('Holiday data successfully added !');
        } else {
          res.sendStatus(400);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: 'Could not upload the file ',
        });
      });
  }
};
