
Table connections as CC {
  id int [pk, increment] //
  connectionNumber int
  ipAddress varchar
  addressId int
  statusId int
  clientId int
  planId int
  establishmentId int
}

Table statuses {
    id int [pk, increment] //
    name varchar
}

Table payrolls {
    id int [pk, increment] //
    ref varchar
    from date
    to date
    type varchar
    status varchar
}

Table payrollItems {
    id int [pk, increment] //
    payrollId int
    month varchar
    present int
    late int
    absence int
    salary float
    allowances float
    deductions float
    net float
    payrollDeductionId int
    payrollAllowanceId int
    employeeId int
    }

Table employeeAllowances {
    id int [pk, increment] //
    bonusId int
    payrollId int
}

Table employeeDeductions {
    id int [pk, increment] //
    deductionsId int
    payrollId int
}

Table allowances {
    id int [pk, increment] //
    description varchar
    amount float
}

Table deductions {
    id int [pk, increment] //
    description varchar
    amount float
}

Table locations {
  id int [pk, increment] //
  latitude decimal(10, 8)
  longitude decimal(11, 8)
}

Table plans {
  id int [pk, increment] //
  name varchar
  speed int
  realSpeed float
}

Table plansPrices {
  id int [pk, increment] //
  planId int
  planName varchar
  planSpeed int
  planRealSpeed float
  price float
  validFrom date
  validTo date
}

Table routers {
  id int [pk, increment] //
  name varchar
  ipAddress int
}

Table establishments {
  id int [pk, increment] //
  name varchar
  latidue varchar
  longitude varchar
  routerId int
}

Table departments {
  id int [pk, increment]
  name varchar
  establishmentId int
}

Table positions {
  id int [pk, increment]
  name varchar
  departmentId int
}

Table addresses {
  id int [pk, increment] //
  type varchar
  street varchar
  city varchar
  municipalityId int
  departmentId int
  locationId int
}

Table clients {
  id int [pk, increment] // auto-increment
  clientNumber int
  personId int
}

Table connectionsOwners {
  id int [pk, increment]
  connectionId int
  clientId int
  startDate date
  endDate date
}

Table installations {
  id int [pk, increment] // auto-increment
  installationDate date
  connectionId int
  employeeId int // PREGUNTARRRRR SI CREAR TABLA PERSONAS
}

Table employees {
  id int [pk, increment] // auto-increment
  personId int
  positionId int
}

Table users {
  id int [pk, increment] // auto-increment
  password varchar
  status varchar
  lastLogin date
  email varchar
  personId int
}

Table persons {
  id int [pk, increment] // auto-increment
  firstNames varchar
  lastNames varchar
  birthday date
}

Table dpis {
  id int [pk, increment] // auto-increment
  number varchar
  dpiFrontUrl varchar
  dpiBackUrl varchar
  personId int
}

Table roles {
  id int [pk, increment] // auto-increment
  roleName varchar
}

Table usersRoles {
  id int [pk, increment] // auto-increment
  userId int
  roleId int
}

Table phones {
  id int [pk, increment]
  number varchar
  type varchar
  personId int 
}


Ref: "usersRoles"."roleId" < "roles"."id"

Ref: "usersRoles"."userId" < "users"."id"

Ref: connections.clientId > clients.id

Ref: "persons"."id" < "phones"."personId"

Ref: "establishments"."routerId" < "routers"."id"

Ref: "establishments"."id" < "connections"."establishmentId"

Ref: "connections"."statusId" < "statuses"."id"

Ref: "employees"."id" < "installations"."employeeId"

Ref: "connections"."id" < "installations"."connectionId"

Ref: "persons"."id" - "clients"."personId"

Ref: "persons"."id" - "users"."personId"

Ref: "employees"."personId" < "persons"."id"

Ref: "deductions"."id" < "employeeDeductions"."deductionsId"

Ref: "allowances"."id" < "employeeAllowances"."bonusId"

Ref: "payrollItems"."payrollDeductionId" < "employeeDeductions"."id"

Ref: "payrollItems"."payrollAllowanceId" < "employeeAllowances"."id"

Ref: "employees"."id" < "payrollItems"."employeeId"

Ref: "payrolls"."id" < "payrollItems"."payrollId"

Ref: "connections"."addressId" < "addresses"."id"

Ref: "dpis"."personId" - "persons"."id"

Ref: "plans"."id" < "plansPrices"."planId"

Ref: "connections"."planId" - "plansPrices"."id"

Ref: "connectionsOwners"."connectionId" > "connections"."id"

Ref: "connectionsOwners"."clientId" > "clients"."id"

Ref: "establishments"."id" < "departments"."establishmentId"

Ref: "departments"."id" < "positions"."departmentId"

Ref: "employees"."positionId" - "positions"."id"