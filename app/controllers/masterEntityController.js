/* eslint-disable indent */
import MasterEntity from '../schema/masterEntitiesSchema';
import MasterEntityNotFound from '../Errors/MasterEntity/MasterEntityNotFound';
import MasterEntityAlreadyExist from '../Errors/MasterEntity/MasterEntityAlreadyExist';
import EntityType from '../schema/entityTypeSchema';
import { MissingFieldsError, BadRequest } from '../Errors/Shared';
import { handleValidationError } from '../utils';
import Logger from '../middlewares/logger';

export const getMasterEntity = async (req, res, next) => {
  const { id } = req.params;
  const masterEntity = await MasterEntity.findById(id).exec();
  if (masterEntity) next(masterEntity);
  else next(new MasterEntityNotFound());
};

export const addMasterEntity = async (req, res, next) => {
  const { type, values } = req.body;
  const existMasterEntity = await MasterEntity.findOne({ type: type });
  if (!existMasterEntity) {
    const valuesRef = values ? values.map((v) => new EntityType({ ...v })) : [];
    valuesRef.forEach((v) => v.save());
    let me = new MasterEntity({ type: type, values: valuesRef });
    me.save((error, masterentity) => {
      if (error) {
        if (error.name === 'ValidationError') {
          next(new MissingFieldsError(handleValidationError(error).fields));
        }
        next(new BadRequest());
      } else next(masterentity);
    });
  } else {
    next(new MasterEntityAlreadyExist());
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description
 * req.params = id
 * req.body = {
 *   type: String,
 *   values: [
 *      { id: 'if existing', value: String, description: String  }
 *    ]
 * }
 */
export const updateMasterEntity = async (req, res, next) => {
  const { id } = req.params;
  const masterEntity = await MasterEntity.findById(id).exec();
  if (!masterEntity) {
    next(new MasterEntityNotFound());
  } else {
    const { type, values } = req.body;
    const valuesRef = values
      ? values.map(async (entity) => {
          if (entity.id) {
            const entityType = await EntityType.findById(entity.id).exec();
            entityType.value = entity.value;
            entityType.description = entity.description;
            await entityType.save();
            return entityType;
          }
          const entityType = new EntityType({ ...entity });
          await entityType.save();
          return entityType;
        })
      : [];
    Promise.all(valuesRef).then((valueArray) => {
      masterEntity.type = type;
      masterEntity.values = valueArray.map((v) => v.id);
      masterEntity.save((error, savedData) => {
        if (error) {
          Logger.error(error);
          if (error.name === 'ValidationError') {
            next(new MissingFieldsError(handleValidationError(error).fields));
          }
          next(new BadRequest());
        }
        next(savedData);
      });
    });
  }
};

export const getTeamData = async (req, res, next) => {
  const TeamData = await MasterEntity.findOne({ type: 'Teams' }).populate(
    'values'
  );
  next(TeamData.values);
};

export const getTechnologyData = async (req, res, next) => {
  const TechnologyData = await MasterEntity.findOne({
    type: 'Technology',
  }).populate('values');
  next(TechnologyData.values);
};

export const getEmpStatus = async (req, res, next) => {
  const EmpStatus = await MasterEntity.findOne({ type: 'empStatus' }).populate(
    'values'
  );
  next(EmpStatus.values);
};

export const getDesignationData = async (req, res, next) => {
  const DesignationData = await MasterEntity.findOne({
    type: 'Designation',
  }).populate('values');
  next(DesignationData.values);
};
