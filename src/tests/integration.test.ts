import supertest from "supertest";
import { app, server } from "../server";

const request = supertest(app);

type employee = {
  id: number;
};
let employees: employee[] = [];

describe("Employees -> Allowances", () => {
  afterAll((done) => {
    server.close(done);
  });

  it("Should return employees with the given Position name", async () => {
    const response = await request.get("/employees/positions/Jefe");

    expect(response.status).toBe(200);

    employees = response.body.data as employee[];
  });

  it("Should return allowances for the first employee with 'Jefe' position", async () => {
    // Make sure at least one employee is available
    if (employees.length > 0) {
      const employeeId = employees[0].id;

      console.log(`employee id is` + employeeId);

      const allowanceResponse = await request.get(
        `/allowances/employees/${employeeId}`
      );

      expect(allowanceResponse.status).toBe(200);

      // Assert the allowances or specific properties you expect from the response
    } else {
      // Handle the case where there are no employees with the specified position
      // You can skip the test or fail it as per your requirements
      throw new Error("No employees with 'Jefe' position found");
    }
  });
});
