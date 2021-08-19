import mongoose from 'mongoose';
import toJson from '@meanie/mongoose-to-json';
const { Schema } = mongoose;

const HolidaySchema = new Schema(
    {
        holidayYear: { type: Schema.Types.String  },
        holidayDate: { type: Schema.Types.String },
        holidayName: { type: Schema.Types.String },

    },
    // {
    //     timestamps: true,
    // }
);

HolidaySchema.plugin(toJson);
const Holiday = mongoose.model('Holiday', HolidaySchema);
export default Holiday;
