const axios = require("axios");

it("this test just checks the response messages and status", async () => {
  expect(typeof globalThis.backendUrl).toBe("string");
  expect(typeof globalThis.webSocketUrl).toBe("string");

  let response = await axios.post(`${globalThis.backendUrl}/user/create/user5`);
  expect(response.status).toBe(201);
  expect(response.data.message).toBe("User user5 created");
});
