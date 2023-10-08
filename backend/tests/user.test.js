
//user.test.js
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");

describe("Users API", () => {
  let token;

  beforeEach(async () => {
    await User.deleteMany({});
    const result = await api.post("/api/users")
        .send({ name: "John Doe", email: "john@example.com", password: "R3g5T7#gh" });
    token = result.body.token;
  });

describe("User Registration", () => {
  it("should register a new user", async () => {
    const newUser = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "R3g5T7#gh",
    };

    const response = await api
      .post("/api/users") 
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const user = await User.findOne({ email: "john@example.com" });
    expect(user).toBeTruthy();
  });

  it("should not register a new user with invalid email", async () => {
    const invalidUser = {
      name: "John Doe",
      email: "johndoe",
      password: "R3g5T7#gh",
    };

    const response = await api
      .post("/api/users")
      .send(invalidUser)
      .expect(400)
      .catch((err) => {
        console.log('Test failed, response: ', err.response.body);
        throw err;
      });
  });

  it("should not register a new user with not strong enough password", async () => {
    const invalidUser = {
      name: "John Doe",
      email: "johndo@email.com",
      password: "12345",
    };

    const response = await api
      .post("/api/users")
      .send(invalidUser)
      .expect(400)
      .catch((err) => {
        console.log('Test failed, response: ', err.response.body);
        throw err;
      });
  });
});
  

describe("User Login", () => {
  it("should login an existing user", async () => {
    await api.post('/api/users')
    .send({
      name: 'Test User',
      email: 'user@mail.com',
      password: 'R3g5T7#gh'
    })
    await api.post('/api/users/login')
    .send({
      email: 'user@mail.com',
      password: 'R3g5T7#gh'
    })
    .expect(200);
  });

  test("should not login with wrong password", async () => {
    const loginUser = {
      email: "johndoe@example.com",
      password: "wrongPassword",
    };
    await api.post("/api/users/login").send(loginUser).expect(400);
  });
 });


afterAll(() => {
  mongoose.connection.close();
});
});
