import mongoose from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

const { Schema } = mongoose;

const EntityTypeSchema = new Schema({
  value: { type: Schema.Types.String, required: true },
  description: { type: Schema.Types.String, required: true },
  status: { type: Schema.Types.Boolean, default: true, required: true },
});

EntityTypeSchema.plugin(toJson);
const EntityType = mongoose.model('EntityType', EntityTypeSchema);
export default EntityType;
