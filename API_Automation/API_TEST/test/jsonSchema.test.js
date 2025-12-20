const { expect } = require("chai");
const Ajv = require("ajv");

describe("Validasi JSON Schema - Login & Add User", () => {
  const ajv = new Ajv({ allErrors: true });

  // LOGIN SCHEMA
  it("Login response schema should be valid", () => {
    const loginResponse = {
      status: 200,
      token: "DYNAMIC_TOKEN_FROM_API",
      message: "Login successful",
    };

    const loginSchema = {
      type: "object",
      required: ["status", "token", "message"],
      properties: {
        status: { type: "number" },
        token: { type: "string" },
        message: { type: "string" },
      },
    };

    const validateLogin = ajv.compile(loginSchema);
    const isLoginValid = validateLogin(loginResponse);

    expect(
      isLoginValid,
      JSON.stringify(validateLogin.errors, null, 2)
    ).to.be.true;
  });


  // ADD USER SCHEMA
  it("Add User response schema should be valid", () => {
    const addUserResponse = {
      status: 201,
      userId: "69465f423d4cf7b09ef3f2b0",
      username: "test",
      age: 25,
      message: "User successfully added, Hi test!",
    };

    const addUserSchema = {
      type: "object",
      required: ["status", "userId", "username", "age", "message"],
      properties: {
        status: { type: "number", enum: [201] },
        userId: { type: "string" },
        username: { type: "string" },
        age: { type: "number" },
        message: { type: "string" },
      },
    };

    const validateAddUser = ajv.compile(addUserSchema);
    const isAddUserValid = validateAddUser(addUserResponse);

    expect(
      isAddUserValid,
      JSON.stringify(validateAddUser.errors, null, 2)
    ).to.be.true;
  });
});