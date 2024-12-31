import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Define the IUser interface
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  home: string;
  family: string;
  friends: string;
  office: string;
  isPasswordCorrect(password: string): Promise<boolean>;  // Method to check password
  genrateAccessToken(): string;  // Method to generate access token
}

// Define the UserSchema
const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  }, 
  email: {
    type: String,
    required: true,
    unique: true,
  }, // Email must be unique
  password: {
    type: String,
    required: true,
  },
  home: {
    type: String,
  },
  family: {
    type: String,
  },
  friends: {
    type: String,
  },
  office: {
    type: String,
  }
});

// Hash the password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if password is correct
UserSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token
UserSchema.methods.genrateAccessToken = function () {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined');
  }

  return jwt.sign(
    {
      _id: this._id,
      username: this.name,  // Assuming `username` is actually `name`
      email: this.email,
    },
    secret,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Create the User model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
