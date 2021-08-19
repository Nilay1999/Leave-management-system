import mongoose from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

const { Schema } = mongoose;

const AllocatedLeaveSchema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
  year: { type: Schema.Types.Number },
  allocatedLeaves: { type: Schema.Types.Number },
  usedLeaves: { type: Schema.Types.Number, default: 0 },
  pendingLeaves: { type: Schema.Types.Number },
  exceedLeaves: { type: Schema.Types.Number, default: 0 },
  isCarryForward: { type: Schema.Types.Boolean, default: false },
  isCompensated: { type: Schema.Types.Boolean, default: false },
});

AllocatedLeaveSchema.plugin(toJson);
const AllocatedLeave = mongoose.model('AllocatedLeave', AllocatedLeaveSchema);
export default AllocatedLeave;
