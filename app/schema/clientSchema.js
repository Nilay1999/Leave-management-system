import mongoose from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

const { Schema } = mongoose;

const clientSchema = new Schema(
  {
    firstName: { type: Schema.Types.String, required: true },
    lastName: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    contactNumber: { type: Schema.Types.String, required: true },
    address: {
      type: Schema.Types.String,
      required: true,
    },
  },
  { timestamps: true }
);
clientSchema.plugin(toJson);
const Client = mongoose.model('Client', clientSchema);
export default Client;
