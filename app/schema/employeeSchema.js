import mongoose from 'mongoose';
import toJson from '@meanie/mongoose-to-json';

const { Schema } = mongoose;

const EmployeeSchema = new Schema(
  {
    employeeId: { type: Schema.Types.String },
    firstName: { type: Schema.Types.String, required: true },
    lastName: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    password: { type: Schema.Types.String, required: true },
    contactNumber: { type: Schema.Types.String, required: true },
    emergencyContactNumber: { type: Schema.Types.String },
    totalExperience: { type: Schema.Types.String },
    skypeId: { type: Schema.Types.String },
    companyEmail: { type: Schema.Types.String },
    companyGmail: { type: Schema.Types.String },
    bloodGroup: {
      type: Schema.Types.String,
      enum: ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-', null],
      default: null,
    },
    gender: {
      type: Schema.Types.String,
      enum: ['Male', 'Female', 'Others', null],
      default: null,
    },
    dateOfBirth: {
      type: Schema.Types.Date,
      // required: true,
    },
    joinDate: {
      type: Schema.Types.Date,
      required: true,
    },
    probationOverDate: {
      type: Schema.Types.Date,
    },
    address: {
      type: Schema.Types.String,
      // required: true,
    },
    designation: {
      type: Schema.Types.ObjectId,
      ref: 'EntityType',
    },
    technology: [
      {
        type: Schema.Types.ObjectId,
        ref: 'EntityType',
      },
    ],
    profilePicture: {
      type: Schema.Types.String,
    },
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: 'EntityType',
      },
    ],
    role: {
      type: Schema.Types.ObjectId,
      ref: 'role',
    },
    reportingTo: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
    },
    isConfirmedEmployee: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

EmployeeSchema.plugin(toJson);
const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee;
