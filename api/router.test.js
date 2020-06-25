const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");

describe("server", () => {
  describe("send post request to /register", () => {
    beforeEach(async () => {
      await db("users").truncate();
    });
    it("should return a 201 status", async () => {
      const user = {
        email: "bob@bob.com",
        password: "pass",
        first_name: "Bob",
        last_name: "Bobbie",
      };
      const send = await request(server).post("/api/auth/register").send(user);

      expect(send.status).toBe(201);
    });
    it("should return a 500 status", async () => {
      const user = { email: "bob@bob.com", password: "pass" };
      const failed = await request(server)
        .post("/api/auth/register")
        .send(user);

      expect(failed.status).toBe(500);
    });
  });
});
describe("send post request to /login", () => {
  const user = {
    email: "bob@bob.com",
    password: "pass",
    first_name: "Bob",
    last_name: "Bobbie",
  };
  beforeEach(async () => {
    await request(server).post("/api/auth/register").send(user);
  });

  it("should return a token a token wtih successful login", async () => {
    const loggedIn = await request(server)
      .post("/api/auth/login")
      .send({ email: "bob@bob.com", password: "pass" });

    expect(loggedIn.status).toBe(200);
    expect(loggedIn.body.token).toBeTruthy();
  });

  it("should return a 401 if user credentials are incorrect", async () => {
    const wrongUser = await await request(server).post("/api/auth/login").send({
      email: "bob@bob.com",
      password: "wrong",
    });

    expect(wrongUser.status).toBe(401);
  });
});

describe("/users route", () => {
    describe("/get should return users sleep sessions", () => {
      it("should return 401 if no token is present", async () => {
        const failed = await request(server).get("/api/users");
  
        expect(failed.status).toBe(400);
      });
    });
    it("should return 401 if bad token is passed", async () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJDaHJpcyIsImlhdCI6MTU4Nzc0MTI1MSwiZXhwIjoxNTg3NzQxODUxfQ.YqA2OGO4itGR4jaaXLnOtmjoDCHlD2ABvOKoHxqSap8";
      const badToken = await request(server)
        .get("/api/users")
        .set("Authorization", token);
  
      expect(badToken.status).toBe(401);
    });
  });