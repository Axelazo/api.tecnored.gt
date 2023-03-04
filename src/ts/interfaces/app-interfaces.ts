import { Request } from "express";
import User from "../../models/User";

//* Define an interface that extends the Request interface to include the `user` property
// TODO: Research about Sequelize DTOs to handle user roles

export interface AuthRequest extends Request {
  user?: User;
}

export interface AddressInterface {
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  location: LocationInterface;
}

export interface LocationInterface {
  latitude: string;
  longitude: string;
}

export interface PhoneInterface {
  personId?: number;
  type: string;
  number: string;
}

export interface DpiInterface {
  number: string;
  dpiFrontUrl: string;
  dpiBackUrl: string;
}
