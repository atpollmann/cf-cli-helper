jest.mock("fs");
const file = require("../util/file");
const meta_file = require("./metadata_file");
const meta = require("./index");
const { commonErrors } = require("../errors");

const example_meta_file = {
  name: "Test-VPC",
  domain: "global",
  version: "1.0",
  bucket: "test-bucket"
};

describe("Template metadata module", () => {
  describe("Get template metadata", () => {
    test("If metadata file does not exists it must throw exception", async () => {
      expect.assertions(1);
      try {
        await meta.getFileData();
      } catch (e) {
        expect(e.name).toEqual(commonErrors.cantReadFile);
      }
    });

    test("If metadata file exists it must read data", async () => {
      const keys = Object.keys(example_meta_file);

      expect.assertions(keys.length);

      try {
        fs.unlinkSync(meta_file);
      } catch (e) {}

      try {
        await file.writeToFile(meta_file, JSON.stringify(example_meta_file));
      } catch (e) {
        return new Error("Could not write metadata test file");
      }

      const data = await meta.getFileData();

      keys.map(k => {
        expect(data).toHaveProperty(k);
      });
    });
  });
});
