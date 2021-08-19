import mongoose from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

const { Schema } = mongoose;

const SODSchema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  startOfDayDescription: {
    type: Schema.Types.String,
    required: true,
  },
  endOfDayDescription: {
    type: Schema.Types.String,
  },
  empStatus: {
    type: Schema.Types.ObjectId,
    ref: 'EntityType',
  },
  date: {
    type: Schema.Types.Date,
    required: true,
  },
  verifiedByTL: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
  },
  verifiedByAdmin: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
  },
});

SODSchema.plugin(toJson);
const SOD = mongoose.model('SOD', SODSchema);
export default SOD;
