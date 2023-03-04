import { Request } from "express";

export interface AuthRequest extends Request {
  user?: UserInterface;
  roles?: RoleInterface[];
  iat?: number;
  exp?: number;
}

export interface UserInterface {
  id: number;
  firstNames: string;
  lastNames: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  roles: RoleInterface[];
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

export interface RoleInterface {
  roleName: string;
}
