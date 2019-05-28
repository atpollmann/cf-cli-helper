jest.mock("fs");
const path = require("path");
const parameters = require("./index");
const parameters_file = require("../template_parameters/parameters_file");
const { commonErrors } = require("../errors");

const valid_params_parsed = {
  VPCCIDR: "10.0.0.0/16",
  AZ1: "us-east-1a",
  AZ2: "us-east-1b",
  AZ3: "us-east-1c",
  PrivateSubnetAZ1CIDR: "10.0.0.0/19",
  PrivateSubnetAZ2CIDR: "10.0.64.0/19",
  PrivateSubnetAZ3CIDR: "10.0.128.0/19",
  PublicSubnetAZ1CIDR: "10.0.32.0/20",
  PublicSubnetAZ2CIDR: "10.0.96.0/20",
  PublicSubnetAZ3CIDR: "10.0.160.0/20"
};
const valid_params_file = `{"VPCCIDR": "10.0.0.0/16","AZ1": "us-east-1a","AZ2": "us-east-1b","AZ3": "us-east-1c","PrivateSubnetAZ1CIDR":"10.0.0.0/19","PrivateSubnetAZ2CIDR": "10.0.64.0/19","PrivateSubnetAZ3CIDR": "10.0.128.0/19","PublicSubnetAZ1CIDR": "10.0.32.0/20","PublicSubnetAZ2CIDR": "10.0.96.0/20","PublicSubnetAZ3CIDR": "10.0.160.0/20"}`;
const invalid_params_file = `{"VPCCIDR": "10.0.0.0/16","AZ1": "us-east-1a","AZ2": "us-east-1b","AZ3": "us-east-1c","PrivateSubnetAZ1CIDR":"10.0.0.0/19","PrivateSubnetAZ2CIDR": "10.0.64.0/19" "PrivateSubnetAZ3CIDR": "10.0.128.0/19",PublicSubnetAZ1CIDR: 10.0.32.0/20,"PublicSubnetAZ2CIDR": "10.0.96.0/20","PublicSubnetAZ3CIDR": "10.0.160.0/20"}`;

describe("Template parameters module", () => {
  describe("Parameters file processing (getParameters)", () => {
    beforeEach(() => {
      let mockFiles = {};
      mockFiles["'" + path.dirname(parameters_file).toString() + "'"] = [
        path.basename(parameters_file)
      ];
      require("fs").__setMockFiles(mockFiles);
    });

    function setFileContents(contents) {
      let mockFileContents = {};
      mockFileContents["'" + parameters_file + "'"] = contents;
      require("fs").__setMockFilesContents(mockFileContents);
    }

    test("If no parameters file is found a file not found exception must be thrown", async () => {
      expect.assertions(1);
      require("fs").__setMockFiles({});
      try {
        await parameters.getParameters();
      } catch (e) {
        expect(e.name).toEqual(commonErrors.localFileNotFound);
      }
    });
    test("Malformed parameters file must throw bad format exception", async () => {
      expect.assertions(1);
      setFileContents(invalid_params_file);
      try {
        await parameters.getParameters();
      } catch (e) {
        expect(e.name).toEqual(commonErrors.badFormat);
      }
    });
    test("Parameters file must be parsed correctly", async () => {
      expect.assertions(1);
      setFileContents(valid_params_file);
      const params = await parameters.getParameters();
      expect(params).toEqual(valid_params_parsed);
    });
  });
});
