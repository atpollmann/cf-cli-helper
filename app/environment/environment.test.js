jest.mock("config");
const config = require("../util/config");
const environment = require("./index");

describe("Environment", () => {
  describe("Configuration", () => {
    test("If the environment is not set, it must fall back to dev", () => {
      expect.assertions(1);

      config.setConfig({});
      const env = environment.get();

      expect(env).toEqual("dev");
    });

    test("If the environment is a value not allowed, it must fall back to dev", () => {
      expect.assertions(1);

      config.setConfig({ environment: "chan" });
      const env = environment.get();

      expect(env).toEqual("dev");
    });

    test("Environment is production", () => {
      expect.assertions(1);

      config.setConfig({ environment: "prod" });
      const env = environment.get();

      expect(env).toEqual("prod");
    });
  });

  describe("Stack creation confirmation", () => {
    test("If the environment is prod, it must solicit confirmation before stack creation", () => {
      expect.assertions(1);

      config.setConfig({ environment: "prod" });
      expect(environment.stackCreateConfirmation()).toEqual(true);
    });

    test("If the environment is dev, it must not solicit confirmation before create stack", () => {
      expect.assertions(1);

      config.setConfig({ environment: "dev" });
      expect(environment.stackCreateConfirmation()).toEqual(false);
    });
  });
});
