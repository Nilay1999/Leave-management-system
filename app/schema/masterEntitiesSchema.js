import mongoose from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

const { Schema } = mongoose;

const MasterEntitiesSchema = new Schema({
  type: { type: Schema.Types.String, required: true },
  values: [{ type: Schema.Types.ObjectId, ref: 'EntityType' }],
});

MasterEntitiesSchema.plugin(toJson);
const MasterEntities = mongoose.model('MasterEntities', MasterEntitiesSchema);
export default MasterEntities;
