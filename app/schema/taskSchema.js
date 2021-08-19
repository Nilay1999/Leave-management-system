import mongoose from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    description: { type: Schema.Types.String, required: true },
    status: { type: Schema.Types.ObjectId, ref: 'EntityType' },
    assignee: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
    author: { type: Schema.Types.ObjectId, ref: 'Employee' },
    estimatedTime: { type: Schema.Types.Number, required: true, default: 0 },
    spentTime: { type: Schema.Types.Number, required: true, default: 0 },
    startDate: { type: Schema.Types.Date, required: true, default: Date.now },
    expectedEndDate: {
      type: Schema.Types.Date,
      required: true,
      default: Date.now,
    },
    endDate: { type: Schema.Types.Date, required: true, default: Date.now },
    progress: { type: Schema.Types.Number, required: true },
    priority: { type: Schema.Types.ObjectId, ref: 'EntityType' },
    files: [{ type: Schema.Types.String }],
  },
  { timestamps: true }
);

TaskSchema.plugin(toJson);
const Task = mongoose.model('Task', TaskSchema);
export default Task;
