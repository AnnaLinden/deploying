const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");
const Goal = require("../models/goalModel");

let token = null;

// Helper function to create a goal
const createGoal = async (text) => {
  return await api.post('/api/goals')
    .set("Authorization", "bearer " + token)
    .send({ text })
    .expect(200);
};

describe("Users API", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Goal.deleteMany({});

    const res = await api.post('/api/users')
      .send({
        name: 'Test User',
        email: 'user@mail.com',
        password: 'R3g5T7#gh'
      });

    token = res.body.token;
  });

  describe("ADD goal", () => {
    it("should create a goal and return 200 with correct fields", async () => {
      const goalData = { text: 'Learn NodeJS' };
      const res = await createGoal(goalData.text);

      expect(res.body.text).toEqual(goalData.text);
    });
  });

  describe("DELETE goal", () => {
    it("should delete a goal and return 200", async () => {
      const res = await createGoal('Learn React');
      await api.delete('/api/goals/' + res.body._id)
        .set("Authorization", "bearer " + token)
        .expect(200);
    });
  });

  describe("UPDATE goal", () => {
    it("should update a goal and return 200 with updated fields", async () => {
      const originalGoal = await createGoal('Learn VueJS');
      const updatedGoalData = ({text:'Learn Angular'}) ;

      const updatedGoal = await api.put('/api/goals/' + originalGoal.body._id)
        .set("Authorization", "bearer " + token)
        .send(updatedGoalData)
        .expect(200);

      expect(updatedGoal.body.text).toEqual(updatedGoalData.text);
    });
  });

  describe("READ goal", () => {
    it("should fetch a goal and return 200 with correct fields", async () => {
      const originalGoal = await createGoal('Learn GraphQL');
      const fetchedGoal = await api.get('/api/goals/' + originalGoal.body._id)
        .set("Authorization", "bearer " + token)
        .expect(200);

      expect(fetchedGoal.body.text).toEqual(originalGoal.body.text);
    });
  });
});
