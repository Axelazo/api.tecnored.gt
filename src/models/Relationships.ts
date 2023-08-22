import Account from "./Account";
import Address from "./Address";
import Area from "./Area";
import Bank from "./Bank";
import Client from "./Client";
import Department from "./Department";
import Dpi from "./Dpi";
import Employee from "./Employee";
import Establishment from "./Establishment";
import Location from "./Location";
import Municipality from "./Municipality";
import Person from "./Person";
import Plan from "./Plan";
import PlanName from "./PlanName";
import PlanPrice from "./PlanPrice";
import PlanSpeed from "./PlanSpeed";
import Position from "./Position";
import Role from "./Role";
import Service from "./Service";
import ServicePlan from "./ServicePlan";
import ServicePlanMapping from "./ServicePlanMapping";
import ServiceStatus from "./ServiceStatus";
import ServicesAddress from "./ServicesAddress";
import ServicesOwners from "./ServicesOwners";
import Status from "./Status";
import User from "./User";
import Router from "./Router";

// User relationships
User.belongsToMany(Role, {
  through: "usersRoles",
  as: "roles",
  foreignKey: "userId",
});

Role.belongsToMany(User, {
  through: "usersRoles",
  as: "users",
  foreignKey: "roleId",
});

// Person relationships
Person.hasOne(Dpi, { foreignKey: "personId", as: "dpi" });

Person.hasOne(Address, { foreignKey: "personId", as: "address" });

Person.hasOne(Client, { foreignKey: "personId", as: "client" });

// Dpi relationships
Dpi.belongsTo(Person, { foreignKey: "personId", as: "dpi" });

// Address relationships
Address.belongsTo(Person, { foreignKey: "personId", as: "address" });

Address.belongsTo(Department, { foreignKey: "departmentId", as: "department" });

Address.belongsTo(Municipality, {
  foreignKey: "municipalityId",
  as: "municipality",
});

// Phones relationships

// Employees
Employee.hasOne(Account, { foreignKey: "employeeId", as: "account" });

// Banks
Bank.hasMany(Account, { as: "accounts" });

// Accounts
Account.belongsTo(Bank, {
  foreignKey: "bankId",
  as: "bank",
});

Account.belongsTo(Employee, {
  foreignKey: "employeeId",
  as: "employeeAccounts",
});

// Plans
Plan.hasMany(PlanPrice, { foreignKey: "planId", as: "prices" });

Plan.hasMany(PlanName, { foreignKey: "planId", as: "names" });

Plan.hasMany(PlanSpeed, { foreignKey: "planId", as: "speeds" });

Plan.hasMany(ServicePlan, { foreignKey: "planId", as: "servicePlans" });

// ServicePlanMapping <=> PlanName
ServicePlanMapping.belongsTo(PlanName, {
  foreignKey: "planNameId",
  as: "planName",
});

PlanName.hasMany(ServicePlanMapping, {
  foreignKey: "planNameId",
  as: "planName",
});

// ServicePlanMapping <=> PlanPrice
ServicePlanMapping.belongsTo(PlanPrice, {
  foreignKey: "planPriceId",
  as: "planPrice",
});

PlanPrice.hasMany(ServicePlanMapping, {
  foreignKey: "planPriceId",
  as: "planPrice",
});

// ServicePlanMapping <=> PlanSpeed
ServicePlanMapping.belongsTo(PlanSpeed, {
  foreignKey: "planSpeedId",
  as: "planSpeed",
});

PlanSpeed.hasMany(ServicePlanMapping, {
  foreignKey: "planSpeedId",
  as: "planSpeed",
});

// Services
Service.hasOne(ServicesAddress, { foreignKey: "serviceId", as: "address" });

Service.belongsTo(Router, {
  foreignKey: "routerId",
  as: "router",
});

Service.hasMany(ServicesOwners, { foreignKey: "serviceId", as: "owners" });

Service.hasMany(ServicePlanMapping, {
  foreignKey: "serviceId",
  as: "servicePlanMappings",
});

Service.hasMany(ServiceStatus, { foreignKey: "serviceId" });

// Services Addresses
ServicesAddress.belongsTo(Service, { foreignKey: "serviceId", as: "address" });

// Services Plans Mappings
ServicePlanMapping.belongsTo(Service, {
  foreignKey: "serviceId",
});

// Services Plans
ServicePlan.belongsTo(Plan, { foreignKey: "planId" });

/* // Establishments
Establishment.hasMany(Service, {
  foreignKey: "establishmentId",
  as: "services",
}); */

// Areas
Area.hasMany(Position, { foreignKey: "areaId", as: "positions" });

// Positions
Position.belongsTo(Area, {
  foreignKey: "areaId",
  as: "area",
});

// Client
Client.belongsTo(Person, { foreignKey: "personId", as: "person" });

Client.hasMany(ServicesOwners, { foreignKey: "clientId", as: "ownedServices" });

// Services Owners
ServicesOwners.belongsTo(Service, { foreignKey: "serviceId", as: "service" });

ServicesOwners.belongsTo(Client, { foreignKey: "clientId", as: "client" });

Location.belongsTo(ServicesAddress, {
  foreignKey: "addressId",
  as: "location",
});

ServicesAddress.hasOne(Location, { foreignKey: "addressId", as: "location" });

ServiceStatus.belongsTo(Service, { foreignKey: "serviceId" });

ServiceStatus.belongsTo(Status, { foreignKey: "statusId" });

Status.hasMany(ServiceStatus, { foreignKey: "statusId" });

Establishment.hasMany(Router, { foreignKey: "establishmentId", as: "routers" });

Router.belongsTo(Establishment, {
  as: "establishment",
});

Router.hasMany(Service, { foreignKey: "routerId", as: "services" });

Establishment.hasMany(Area, { foreignKey: "establishmentId", as: "areas" });
Area.belongsTo(Establishment, {
  foreignKey: "establishmentId",
  as: "establishment",
});

ServicesAddress.belongsTo(Department, {
  foreignKey: "departmentId",
  as: "department",
});

ServicesAddress.belongsTo(Municipality, {
  foreignKey: "municipalityId",
  as: "municipality",
});

export {
  Account,
  Address,
  Area,
  Bank,
  Client,
  Department,
  Dpi,
  Employee,
  Establishment,
  Municipality,
  Person,
  Plan,
  PlanName,
  PlanPrice,
  PlanSpeed,
  Position,
  Role,
  Service,
  ServicePlan,
  ServicePlanMapping,
  ServicesAddress,
  ServicesOwners,
  User,
  Location,
  ServiceStatus,
  Status,
  Router,
};
