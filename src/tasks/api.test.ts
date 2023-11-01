import supertest from "supertest";
import { app, server } from "../server";

const request = supertest(app);

describe("Employees", () => {
  afterAll((done) => {
    server.close(done);
  });

  it("Should return all employees", async () => {
    const response = await request.get("/employees/");

    expect(response.status).toBe(200);
  });

  it("Should return an employee", async () => {
    const response = await request.get("/employees/1");

    expect(response.status).toBe(200);
  });

  it("Should return a message saying that the ID is not anumber", async () => {
    const response = await request.get("/employees/ASD");

    expect(response.status).toBe(409); // Expecting a 409 Bad Request status code
    expect(response.body).toHaveProperty(
      "message",
      "El id especificado debe ser un número"
    );

    console.log(response.body);
  });

  it("Should return 404 for a non-existing employee", async () => {
    const response = await request.get("/employees/999");

    expect(response.status).toBe(404);
  });
});
