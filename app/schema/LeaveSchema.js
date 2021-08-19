import mongoose from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

const { Schema } = mongoose;

const LeaveSchema = new Schema(
  {
    requestFrom: { type: Schema.Types.ObjectId, ref: 'Employee' },
    requestTo: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
    type: {
      type: Schema.Types.String,
      enum: ['Half', 'Full'],
      default: 'Full',
    },
    halfDayStatus: {
      type: Schema.Types.String,
      enum: ['firsthalf', 'secondhalf', 'null'],
      default: 'null',
    },
    startDate: { type: Schema.Types.Date, required: true },
    endDate: { type: Schema.Types.Date, required: true },
    returnDate: { type: Schema.Types.Date, required: true },
    reason: { type: Schema.Types.String, required: true },
    isAdhocLeave: { type: Schema.Types.Boolean },
    adhocStatus: {
      type: Schema.Types.String,
      enum: ['teammember', 'directly', 'notinform', 'null'],
      default: 'null',
    },
    availableOnPhone: { type: Schema.Types.Boolean, required: true },
    availableOnCity: { type: Schema.Types.Boolean, required: true },
    emergencyContact: { type: Schema.Types.String },
    status: {
      type: Schema.Types.String,
      enum: ['pending', 'approved', 'denied'],
      required: true,
      default: 'pending',
    },
    approvedBy: [
      {
        author: { type: Schema.Types.ObjectId, ref: 'Employee' },
        comment: Schema.Types.String,
        time: { type: Date, default: Date.now },
      },
    ],
    rejectedBy: [
      {
        author: { type: Schema.Types.ObjectId, ref: 'Employee' },
        comment: Schema.Types.String,
        time: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

LeaveSchema.plugin(toJson);
const Leave = mongoose.model('Leave', LeaveSchema);
export default Leave;
