require("dotenv").config();

jest.setTimeout(30000);
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {
  MongoMemoryServer,
} = require("mongodb-memory-server");

const app = require("../server");

const User = require("../models/User");
const Document = require("../models/Document");

let mongoServer;

describe("Document Authorization", () => {

  let owner;
  let sharedUser;
  let document;

  beforeAll(async () => {

    mongoServer =
      await MongoMemoryServer.create();

    const mongoUri =
      mongoServer.getUri();

    await mongoose.connect(
      mongoUri
    );

    owner = await User.create({
      name: "Vedant",
      email: "vedant@test.com",
      password: "password123",
    });

    sharedUser = await User.create({
      name: "Alex",
      email: "alex@test.com",
      password: "password123",
    });

    document =
      await Document.create({
        title: "Test Document",
        content: "<p>Hello</p>",
        owner: owner._id,
        sharedWith: [
          {
            user: sharedUser._id,
            permission: "edit",
          },
        ],
      });

  });

  afterAll(async () => {

    await mongoose.connection.dropDatabase();

    await mongoose.connection.close();

    await mongoServer.stop();

  });


  test(
    "shared user cannot delete owner's document",
    async () => {

      const token =
        jwt.sign(
          {
            id: sharedUser._id,
          },
          process.env.JWT_SECRET
        );

      const response =
        await request(app)
          .delete(
            `/api/documents/${document._id}`
          )
          .set(
            "Authorization",
            `Bearer ${token}`
          );

      expect(
        response.statusCode
      ).toBe(403);

      expect(
        response.body.message
      ).toBe(
        "You are not authorized to delete this document"
      );

      // Make sure the document
      // still exists.
      const existingDocument =
        await Document.findById(
          document._id
        );

      expect(
        existingDocument
      ).not.toBeNull();

    }
  );

});