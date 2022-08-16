import mongoose from 'mongoose';

const PhoneSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
},
  {
    timestamps: true,
  },
);

class PhoneNumber {
  static getNumber() {
    return this.find().exec();
  }

  static insertNumber(number) {
    const phone = this({
      number
    })
    return phone.save();
  }
}

PhoneSchema.loadClass(PhoneNumber);

export default mongoose.model('number', PhoneSchema);