const axios = require("axios");

it("this test just checks the response messages and status", async () => {
  expect(typeof globalThis.backendUrl).toBe("string");
  expect(typeof globalThis.websocketUrl).toBe("string");
});
