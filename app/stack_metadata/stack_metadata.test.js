jest.mock("fs");
const meta_file = require("./metadata_file");
const meta = require("./index");
const { commonErrors } = require("../errors");

const example_meta_file = {
  Name: "Test-VPC",
  Domain: "global",
  Version: "1.0",
  Bucket: "test-bucket"
};

const valid_meta_file = `{"metadata": {"Name": "Test-VPC", "Domain": "global", "Version": "1.0", "Bucket": "test-bucket"} , "parameters": {}}`;

describe("Template metadata module", () => {
  describe("Get template metadata", () => {
    function setFileContents(contents) {
      let mockFileContents = {};
      mockFileContents["'" + meta_file + "'"] = contents;
      require("fs").__setMockFilesContents(mockFileContents);
    }

    test("If metadata file does not exists it must throw exception", async () => {
      expect.assertions(1);
      require("fs").__setMockFiles({});
      try {
        await meta.getFileData();
      } catch (e) {
        expect(e.name).toEqual(commonErrors.cantReadFile);
      }
    });

    test("If metadata file exists it must read data", async () => {
      const keys = Object.keys(example_meta_file);
      expect.assertions(keys.length);
      setFileContents(valid_meta_file);

      const data = await meta.getFileData();

      keys.map(k => {
        expect(data).toHaveProperty(k);
      });
    });
  });
});
