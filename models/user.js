/* eslint-disable no-param-reassign */
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is required'],
    minLength: [3, 'username must be atleast 3 characters long'],
  },
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  passwordHash: {
    type: String,
    required: [true, 'password is required'],
  },
  blogs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
  },
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.passwordHash;
  },
});

export default mongoose.model('User', userSchema);
