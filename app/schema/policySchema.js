import mongoose from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

const { Schema } = mongoose;

const PolicySchema = new Schema(
  {
    title: { type: Schema.Types.String, required: true },
    status: {
      type: Schema.Types.String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    detail: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

PolicySchema.plugin(toJson);
const Policy = mongoose.model('Policy', PolicySchema);
export default Policy;
