import mongoose from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

const { Schema } = mongoose;

const roleSchema = new Schema({
  name: { type: Schema.Types.String, default: 'Software Developer' },
  description: { type: Schema.Types.String, default: 'Software Developer' },
  code: { type: Schema.Types.String, default: 'SD' },
  type: { type: Schema.Types.String, default: 'EMP' },
});

roleSchema.plugin(toJson);
const Role = mongoose.model('role', roleSchema);
export default Role;
