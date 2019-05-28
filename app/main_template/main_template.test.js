jest.mock("fs");
const path = require("path");
const main_template_file = require("./main_template_file");
const main = require("./index");
const { commonErrors } = require("../errors");

const validFileContents =
  '{"Description": "Three AZ VPC infrastructure. One public and private subnet in each AZ"}';

describe("Main template module", () => {
  describe("Get template", () => {
    beforeEach(() => {
      let mockFiles = {};
      mockFiles["'" + path.dirname(main_template_file).toString() + "'"] = [
        path.basename(main_template_file)
      ];
      require("fs").__setMockFiles(mockFiles);
    });

    function setFileContents(contents) {
      const fs = require("fs");
      fs.__setCanWrite(true);
      let mockFileContents = {};
      mockFileContents["'" + main_template_file + "'"] = contents;
      fs.__setMockFilesContents(mockFileContents);
    }

    test("If main template does not exists it must throw exception", async () => {
      require("fs").__setCanWrite(false);

      expect.assertions(1);

      try {
        await main.getTemplate();
      } catch (e) {
        expect(e.name).toEqual(commonErrors.localFileNotFound);
      }
    });
    test("If main template is invalid it must throw exception", async () => {
      setFileContents("** Invalid yaml file");

      expect.assertions(1);

      try {
        await main.getTemplate();
      } catch (e) {
        expect(e.name).toEqual(commonErrors.badFormat);
      }
    });
    test("If main template exists and is valid it must get data from it", async () => {
      setFileContents(validFileContents);

      const tmplObj = JSON.parse(validFileContents);
      const keys = Object.keys(tmplObj);
      const data = await main.getTemplate();

      expect.assertions(keys.length);

      keys.map(k => {
        expect(data).toHaveProperty(k);
      });
    });
  });
});
