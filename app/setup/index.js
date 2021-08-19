import {
  technologies,
  allocation,
  designation,
  payment,
  projectpriority,
  projectstatus,
  currency,
  taskstatus,
  taskpriority,
  projectrole,
  activity,
  resourcestatus,
  teams,
  roles,
} from '../constants/enum';
import EntityType from '../schema/entityTypeSchema';
import MasterEntities from '../schema/masterEntitiesSchema';
import RoleSchema from '../schema/roleSchema';

const entries = [
  { type: 'Technology', values: technologies },
  { type: 'Allocation', values: allocation },
  { type: 'Designation', values: designation },
  { type: 'Payment', values: payment },
  { type: 'Project_Priority', values: projectpriority },
  { type: 'Project_Status', values: projectstatus },
  { type: 'Currency', values: currency },
  { type: 'Task_Status', values: taskstatus },
  { type: 'Task_Priority', values: taskpriority },
  { type: 'Project_Role', values: projectrole },
  { type: 'Activity', values: activity },
  { type: 'Resource_Status', values: resourcestatus },
  { type: 'Teams', values: teams },
];

export const initMasterEntities = async () => {
  console.log('initMasterEntities');
  // EntityType.deleteMany({}, () => {});
  // MasterEntities.deleteMany({}, () => {});
  entries.map(async (entry) => {
    const masterentities = await MasterEntities.find({ type: entry.type });
    if (!masterentities.length) {
      let values = [];
      entry.values.forEach((technology) => {
        const et = new EntityType({
          value: technology.name,
          description: technology.description,
        });
        et.save();
        values.push(et);
      });
      let masterEntity = new MasterEntities({
        type: entry.type,
        values: values.map((v) => v.id),
      });
      masterEntity.save();
    }
  });
};

export const initRoles = async () => {
  console.log('initRoles');
  // RoleSchema.deleteMany({}, () => {});

  roles.forEach(async (role) => {
    const data = await RoleSchema.findOne({ code: role.code });
    if (!data.code) {
      RoleSchema.save();
    }
  });
};
