jest.mock("fs");
const stage = require("./index");
const { commonErrors } = require("../errors");

describe("Stage module", () => {
  describe("Get saved stage", () => {
    test("Should create a STAGE file with idle stage if one does not exists", async () => {
      expect.assertions(1);
      try {
        expect(await stage.getSavedStage()).toEqual(stage.stages.IDLE);
      } catch (e) {
        console.log("Unexpected error " + e);
      }
    });

    test("If cant get stage it must throw exception", async () => {
      expect.assertions(1);
      require("fs").__setCanWrite(false);
      try {
        await stage.getSavedStage();
      } catch (e) {
        expect(e.name).toEqual(commonErrors.cantWriteFile);
      }
    });
  });

  describe("Save stage", () => {
    test("If an invalid stage name is passed, it should throw exception", async () => {
      expect.assertions(1);
      const invalidStage = "INVALID STAGE NAME";
      try {
        await stage.saveStage(invalidStage);
      } catch (e) {
        expect(e.name).toEqual(commonErrors.invalidStage);
      }
    });

    test("If cant write stage it must throw exception", async () => {
      expect.assertions(1);
      require("fs").__setCanWrite(false);
      try {
        await stage.saveStage(stage.stages.DEPLOYING_STACK);
      } catch (e) {
        expect(e.name).toEqual(commonErrors.cantWriteFile);
      }
    });

    test("If valid stage name is passed it should save it into STAGE file", async () => {
      require("fs").__setCanWrite(true);
      const stg = stage.stages.DEPLOYING_STACK;
      await stage.saveStage(stg).then(async () => {
        await expect(stage.getSavedStage()).resolves.toBe(stg);
      });
    });
  });
});
