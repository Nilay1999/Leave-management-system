import mongoose from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

const { Schema } = mongoose;

const MasterTaskSchema = new Schema({
  type: { type: Schema.Types.String, required: true },
  values: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
});

MasterTaskSchema.plugin(toJson);
const MasterTask = mongoose.model('MasterTask', MasterTaskSchema);
export default MasterTask;
