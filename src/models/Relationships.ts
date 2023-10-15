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
import EstablishmentArea from "./EstablishmentArea";
import AreaPosition from "./AreaPosition";
import EmployeePositionMapping from "./EmployeePositionMapping";
import TicketStatus from "./TicketStatus";
import TicketStatuses from "./TicketStatuses";
import Ticket from "./Ticket";
import TicketAssignees from "./TicketAssignees";
import TicketReason from "./TicketReason";
import Allowance from "./Allowance";
import EmployeeAllowance from "./EmployeeAllowance";
import PayrollItem from "./PayrollItem";
import Deduction from "./Deduction";
import EmployeeDeduction from "./EmployeeDeduction";
import Payroll from "./Payroll";
import Salary from "./Salary";

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

Employee.hasOne(User, {
  as: "user",
  foreignKey: "employeeId",
});

User.belongsTo(Employee, {
  as: "employee",
  foreignKey: "employeeId",
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

ServicesAddress.belongsTo(Department, {
  foreignKey: "departmentId",
  as: "department",
});

ServicesAddress.belongsTo(Municipality, {
  foreignKey: "municipalityId",
  as: "municipality",
});

// Establishments
Establishment.belongsToMany(Area, {
  through: EstablishmentArea,
  foreignKey: "establishmentId",
  otherKey: "areaId",
  as: "areas",
});

Area.belongsToMany(Establishment, {
  through: EstablishmentArea,
  foreignKey: "areaId",
  otherKey: "establishmentId",
  as: "establishments",
});

// Areas
Area.belongsToMany(Position, {
  through: AreaPosition,
  foreignKey: "areaId",
  otherKey: "positionId",
  as: "positions",
});

Position.belongsToMany(Area, {
  through: AreaPosition,
  foreignKey: "positionId",
  otherKey: "areaId",
  as: "areas",
});

EmployeePositionMapping.belongsTo(Employee, {
  as: "employeePositionMapping",
  foreignKey: "employeeId",
});
Employee.hasMany(EmployeePositionMapping, {
  as: "employeePositionMapping",
  foreignKey: "employeeId",
});

EmployeePositionMapping.belongsTo(Position, {
  foreignKey: "positionId",
  as: "position",
});

Position.hasMany(EmployeePositionMapping, {
  foreignKey: "positionId",
  as: "position",
});

EmployeePositionMapping.belongsTo(Area, {
  foreignKey: "areaId",
  as: "area",
});

Area.hasMany(EmployeePositionMapping, {
  foreignKey: "areaId",
  as: "area",
});

EmployeePositionMapping.belongsTo(Establishment, {
  foreignKey: "establishmentId",
  as: "establishment",
});

Establishment.hasMany(EmployeePositionMapping, {
  foreignKey: "establishmentId",
  as: "establishment",
});

// Employee-Position association
Employee.belongsToMany(Position, {
  through: EmployeePositionMapping,
  foreignKey: "employeeId",
});

Position.belongsToMany(Employee, {
  through: EmployeePositionMapping,
  foreignKey: "positionId",
});

// TICKETS
// Areas
/* Ticket.hasMany(TicketStatuses, {
  // through: TicketStatuses,
  foreignKey: "ticketId",
  // otherKey: "statusId",
  as: "statuses",
}); */

Ticket.belongsToMany(TicketStatus, {
  through: TicketStatuses,
  foreignKey: "ticketId",
  as: "statuses",
});

TicketStatus.belongsToMany(Ticket, {
  through: TicketStatuses,
  foreignKey: "statusId",
  as: "tickets",
});

TicketStatuses.belongsTo(TicketStatus, {
  foreignKey: "statusId",
  as: "status",
});

TicketStatus.hasMany(TicketStatuses, { foreignKey: "statusId", as: "stats" });
Ticket.hasMany(TicketStatuses, {
  foreignKey: "ticketId",
  as: "ticketStatuses",
});

Ticket.belongsToMany(Employee, {
  through: TicketAssignees,
  foreignKey: "ticketId",
  as: "assignees",
});

Employee.belongsToMany(Ticket, {
  through: TicketAssignees,
  foreignKey: "assigneeId",
  as: "assignedTickets",
});

Service.hasMany(Ticket, { as: "tickets", foreignKey: "serviceId" });

Ticket.belongsTo(Service, { as: "service", foreignKey: "serviceId" });

Service.belongsToMany(Client, {
  through: ServicesOwners,
  foreignKey: "clientId",
  as: "clients",
});

Client.belongsToMany(Service, {
  through: ServicesOwners,
  foreignKey: "serviceId",
  as: "services",
});

Ticket.belongsTo(TicketReason, { as: "reason", foreignKey: "reasonId" });

//! Payroll Relationships

PayrollItem.hasMany(EmployeeAllowance, {
  as: "allowances",
  foreignKey: "payrollItemId",
});

PayrollItem.hasMany(EmployeeDeduction, {
  as: "deductions",
  foreignKey: "payrollItemId",
});

PayrollItem.belongsTo(Employee, {
  as: "employee",
  foreignKey: "employeeId",
});

Payroll.hasMany(PayrollItem, {
  as: "items",
  foreignKey: "payrollId",
});

Allowance.hasMany(EmployeeAllowance);
EmployeeAllowance.belongsTo(Allowance, {
  as: "allowance",
  foreignKey: "allowanceId",
});

Deduction.hasMany(EmployeeDeduction);
EmployeeDeduction.belongsTo(Deduction, {
  as: "deduction",
  foreignKey: "deductionId",
});

Employee.hasMany(Salary, { foreignKey: "employeeId", as: "salaries" });

Salary.belongsTo(Employee, { foreignKey: "employeeId", as: "salary" });

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
  AreaPosition,
  EstablishmentArea,
  Ticket,
  TicketStatus,
  TicketStatuses,
  EmployeeAllowance,
  EmployeeDeduction,
  PayrollItem,
  Allowance,
  Deduction,
  Salary,
};
