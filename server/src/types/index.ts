import { Document } from 'mongoose';
import { Request } from 'express';


export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

export interface IEvent extends Document {
  _id: string;
  user: string;
  title: string;
  dateTime: Date;
  location: string;
  description?: string;
  shareToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JWTPayload {
  id: string;
}