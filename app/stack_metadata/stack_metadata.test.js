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

const valid_meta_file = `{"metadata": {"name": "Test-VPC", "domain": "global", "version": "1.0", "bucket": "test-bucket"} , "parameters": {}}`;

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
      /*
      const params = await parameters.getParameters();
      expect(params).toEqual(valid_params_parsed);*/

      const data = await meta.getFileData();

      keys.map(k => {
        expect(data).toHaveProperty(k);
      });
    });
  });
});
