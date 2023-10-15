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
  locality: string;
  departmentId: Department;
  municipalityId: Municipality;
  zipCode: string;
}

export interface Department {
  id: number;
  name: string;
  municipalities: Municipality[];
}

export interface Municipality {
  id: number;
  name: string;
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
  dpiFront: string;
  dpiBack: string;
}

export interface RoleInterface {
  roleName: string;
}

//API Interfaces (for exporting, receiving data)
export interface ClientAPI {
  clientNumber?: number;
  personId?: number;
}

export interface PersonAPI {
  firstNames: string;
  lastNames: string;
  birthday?: Date;
  email?: string;
  nitNumber?: string;
}

export interface EmployeeAPI extends PersonAPI {
  bank?: number;
  accountNumber?: string;
  establishment: number;
  area: number;
  position: number;
  salary: number;
  birthday: Date;
  email: string;
}

export interface AddressAPI {
  type: string;
  street: string;
  locality: string;
  department: number;
  municipality: number;
  zipCode: string;
}

export interface LocationAPI {
  latitude: string;
  longitude: string;
  addressId: number;
}

export interface PhoneAPI {
  type: string;
  number: string;
}

export interface DpiAPI {
  number: string;
}
