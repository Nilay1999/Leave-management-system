import mongoose from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

const { Schema } = mongoose;

const LogTimeSchema = new Schema(
  {
    date: { type: Schema.Types.Date, required: true, default: Date.now },
    timeSpent: { type: Schema.Types.String, required: true, default: 0 },
    workPackages: { type: Schema.Types.ObjectId, ref: 'Task' },
    activity: { type: Schema.Types.ObjectId, ref: 'EntityType' },
    comment: { type: Schema.Types.String, required: true },
  },
  {
    timestamps: true,
  }
);

LogTimeSchema.plugin(toJson);
const Logtime = mongoose.model('Logtime', LogTimeSchema);
export default Logtime;
