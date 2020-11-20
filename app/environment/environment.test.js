jest.mock("fs");
const environment = require("./index");

describe("Environment", () => {
  describe("Configuration", () => {
    test("If the environment is not set, it must fall back to dev", () => {
      expect.assertions(1);
      const env = environment.get();

      expect(env).toEqual("dev");
    });

    test("Environment is production", () => {
      expect.assertions(1);
      process.env.ENVIRONMENT = "prod";
      const env = environment.get();

      expect(env).toEqual("prod");
    });
  });

  describe("Stack creation confirmation", () => {
    test("If the environment is prod, it must solicit confirmation before stack creation", () => {
      expect.assertions(1);

      process.env.ENVIRONMENT = "prod";
      expect(environment.stackCreateConfirmation()).toEqual(true);
    });

    test("If the environment is dev, it must not solicit confirmation before create stack", () => {
      expect.assertions(1);

      process.env.ENVIRONMENT = "dev";
      expect(environment.stackCreateConfirmation()).toEqual(false);
    });
  });
});
