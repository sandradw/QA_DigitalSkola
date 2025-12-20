const { describe } = require("mocha");
const assert = require("assert");
const { expect } = require("chai");

let token;

describe("Test Login", function () {
  it("Valid Login", async function () {
    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/login",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username: "admin",
          password: "admin",
        }),
      }
    );

    //  assert.strictEqual(response.status, 200);
    expect(response.status).to.equal(200);

    // Mencetak Response Body
    const data = await response.json();
    // console.log(data);
    expect(data.message).to.eql("Login successful");

    // Simpan Token
    token = data.token;
    //console.log(token);
  });

  it("Invalid Login (Username/Password empty)", async function () {
    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/login",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username: "",
          password: "admin",
        }),
      }
    );

    //  assert.strictEqual(response.status, 400);
    expect(response.status).to.equal(400);

    // Mencetak Response Body
    const data = await response.json();
    // console.log(data);
    expect(data.message).to.eql("Username or password is required");

    // token TIDAK boleh ada
    expect(data).to.not.have.property("token");
  });

  it("Invalid Login (Username/Password wrong)", async function () {
    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/login",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username: "Sandra",
          password: "admin",
        }),
      }
    );

    //  assert.strictEqual(response.status, 401);
    expect(response.status).to.equal(401);

    // Mencetak Response Body
    const data = await response.json();
    // console.log(data);
    expect(data.message).to.eql("Invalid username or password!");

    // token TIDAK boleh ada
    expect(data).to.not.have.property("token");
  });

  it("Get User", async function () {
    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/users",
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );

    //  assert.strictEqual(response.status, 200);
    expect(response.status).to.equal(200);

    // Mencetak Response Body
    const data = await response.json();
    //s console.log(data);
  });

  it("Add User", async function () {
    expect(token, "Token from login is missing").to.exist;
    const randomUsername = `test_${Date.now()}`;
    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/add-user",
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          username: randomUsername,
          age: 27,
        }),
      }
    );

    //  assert.strictEqual(response.status, 201);
    expect(response.status).to.equal(201);

    // Mencetak Response Body
    const data = await response.json();
    // console.log(data);
    expect(data.message).to.include("User successfully added");
  });

  it("Add User already", async function () {
    expect(token, "Token from login is missing").to.exist;
    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/add-user",
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          username: "Ridhwan",
          age: 27,
        }),
      }
    );

    //  assert.strictEqual(response.status, 400);
    expect(response.status).to.equal(400);

    // Mencetak Response Body
    const data = await response.json();
    // console.log(data);
    expect(data.message).to.include("already exists!");
  });

});