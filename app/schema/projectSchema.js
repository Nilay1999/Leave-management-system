import mongoose from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      maxlength: 50,
    },
    payment: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    amount: {
      value: { type: Schema.Types.Number, default: 0 },
      currency: {
        type: Schema.Types.ObjectId,
        ref: 'EntityType',
      },
    },
    allocation: {
      type: Schema.Types.ObjectId,
      ref: 'EntityType',
      required: true,
    },
    priority: {
      type: Schema.Types.ObjectId,
      ref: 'EntityType',
      required: true,
    },
    status: {
      type: Schema.Types.ObjectId,
      ref: 'EntityType',
    },
    technologies: {
      type: Schema.Types.ObjectId,
      ref: 'EntityType',
    },
    masterTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'MasterTask',
      },
    ],
    salesperson: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
    },
    clients: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Client',
      },
    ],
  },
  {
    timestamps: true,
  }
);

ProjectSchema.plugin(toJson);
const Project = mongoose.model('Project', ProjectSchema);
export default Project;
