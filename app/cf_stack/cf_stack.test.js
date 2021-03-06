jest.mock("../util/aws");
jest.mock("fs");
const path = require("path");
const config = require("../util/config");
const { commonErrors } = require("../errors");
const cf = require("./index");
const main = require("../main_template");
const mainTemplateFile = require("../main_template/main_template_file");
const parameters = require("../template_parameters");
const parametersFile = require("../template_parameters/parameters_file");
const meta = require("../stack_metadata");
const fs = require("fs");

describe("Cloud formation stack module", () => {
  describe("Get stack info", () => {
    test("It must throw an exception if the stack does not exists in CF", async () => {
      expect.assertions(1);
      try {
        await cf.getStackInfo("NONEXISTING_STACK");
      } catch (e) {
        expect(e.name).toEqual(commonErrors.stackNotFound);
      }
    });
    test("It must return the stack info if it does exists in CF", async () => {
      const expectedStackKeys = [
        "StackId",
        "Description",
        "Parameters",
        "Tags",
        "Outputs",
        "CreationTime",
        "StackName",
        "StackStatus"
      ];
      expect.assertions(expectedStackKeys.length);
      const receivedStackInfo = await cf.getStackInfo("deployedStack");
      expectedStackKeys.map(k => {
        expect(receivedStackInfo).toHaveProperty(k);
      });
    });
  });

  describe("Get stack events", () => {
    test("It must trow an exception if the stack does not exists in CF", async () => {
      expect.assertions(1);
      try {
        await cf.getStackEvents("NONEXISTING_STACK");
      } catch (e) {
        expect(e.name).toEqual(commonErrors.stackNotFound);
      }
    });
    test("It must return stack events if any", async () => {
      expect.assertions(7);
      const events = await cf.getStackEvents("deployedStack");
      expect(events).toBeInstanceOf(Array);
      expect(events[0]).toHaveProperty("timestamp");
      expect(events[0]).toHaveProperty("resourceType");
      expect(events[0]).toHaveProperty("resourceStatus");
      expect(events[0]["timestamp"]).toBeDefined();
      expect(events[0]["resourceType"]).toBeDefined();
      expect(events[0]["resourceStatus"]).toBeDefined();
    });
  });

  describe("Check parameters", () => {
    function setMockFiles(tmplFile, paramsFile) {
      let mockFiles = {};
      let mockFilesContents = {};
      const contents = {
        template_without_params: `---\nAWSTemplateFormatVersion: '2010-09-09'\nDescription: Three AZ VPC infrastructure. One public and private subnet in each AZ`,
        template_with_params: `---\nAWSTemplateFormatVersion: '2010-09-09'\nDescription: Three AZ VPC infrastructure. One public and private subnet in each AZ\nParameters:\n  Name:\n    Type: String\n  Domain:\n    Type: String\n  Version:\n    Type: String\n  Bucket:\n    Type: String\n  VPCCIDR:\n    Description: CIDR block for the VPC\n    Type: String\n  AZ1:\n    Description: Availability zone 1\n    Type: AWS::EC2::AvailabilityZone::Name\n  AZ2:\n    Description: Availability zone 2\n    Type: AWS::EC2::AvailabilityZone::Name\n  AZ3:\n    Description: Availability zone 3\n    Type: AWS::EC2::AvailabilityZone::Name`,
        params_bad_count: `{"metadata": {"Name": "Test-stack", "Domain": "global", "Version": "1", "Bucket": "the-cf-bucket"}, "parameters": {"VPCCIDR": "10.0.0.0/16","AZ1": "us-east-1a"}}`,
        params_same_count_bad_element: `{"metadata": {"Name": "Test-stack", "Domain": "global", "Version": "1", "Bucket": "the-cf-bucket"}, "parameters": {"VPCCIDR": "10.0.0.0/16","AZ1": "us-east-1a","AZ2": "us-east-1b","CHAN": "us-east-1z"}}`
      };
      mockFiles["'" + path.dirname(mainTemplateFile).toString() + "'"] = [
        path.basename(mainTemplateFile)
      ];
      mockFilesContents["'" + mainTemplateFile + "'"] = contents[tmplFile];
      if (paramsFile) {
        mockFiles["'" + path.dirname(parametersFile).toString() + "'"] = [
          path.basename(parametersFile)
        ];
        mockFilesContents["'" + parametersFile + "'"] = contents[paramsFile];
      }

      fs.__setMockFiles(mockFiles);
      fs.__setMockFilesContents(mockFilesContents);
    }
    test("If main template requires no parameters, its ok if no parameters file exists", async () => {
      expect.assertions(1);
      setMockFiles("template_without_params");
      const template = await main.getTemplate();
      let params = null;
      try {
        params = await parameters.getParameters();
      } catch (e) {
        expect(() => cf.checkParameters(template, params)).not.toThrow();
      }
    });
    test("If main template required parameters are not present in parameters file it must throw badParameters exception (different count)", async () => {
      expect.assertions(1);
      setMockFiles("template_with_params", "params_bad_count");
      const template = await main.getTemplate();
      const params = await parameters.getParameters();
      try {
        cf.checkParameters(template, params);
      } catch (e) {
        expect(e.name).toEqual(commonErrors.badParameters);
      }
    });
    test("If main template required parameters are not present in parameters file it must throw badParameters exception (same count)", async () => {
      expect.assertions(1);
      setMockFiles("template_with_params", "params_same_count_bad_element");

      const template = await main.getTemplate();
      const params = await parameters.getParameters();
      try {
        cf.checkParameters(template, params);
      } catch (e) {
        expect(e.name).toEqual(commonErrors.badParameters);
      }
    });
  });

  describe("Check metadata", () => {
    function setMockFiles(paramsFile) {
      let mockFiles = {};
      let mockFilesContents = {};
      const contents = {
        params_bad_no_metadata: `{"metadata": {}, "parameters": {"VPCCIDR": "10.0.0.0/16","AZ1": "us-east-1a","AZ2": "us-east-1b","AZ3": "us-east-1z"}}`,
        params_bad_no_metadata_name: `{"metadata": {"Domain": "global", "Version": "1", "Bucket": "the-cf-bucket"}}`,
        params_bad_no_metadata_domain: `{"metadata": {"Name": "Test-stack", "Version": "1", "Bucket": "the-cf-bucket"}}`,
        params_bad_no_metadata_version: `{"metadata": {"Name": "Test-stack", "Domain": "global", "Bucket": "the-cf-bucket"}}`,
        params_bad_no_metadata_bucket: `{"metadata": {"Name": "Test-stack", "Domain": "global", "Version": "1"}}`
      };

      mockFiles["'" + path.dirname(parametersFile).toString() + "'"] = [
        path.basename(parametersFile)
      ];
      mockFilesContents["'" + parametersFile + "'"] = contents[paramsFile];

      fs.__setMockFiles(mockFiles);
      fs.__setMockFilesContents(mockFilesContents);
    }

    test("If parameters file does not contain metadata it must throw badMetadataException", async () => {
      expect.assertions(1);
      setMockFiles("params_bad_no_metadata");

      const metadata = await meta.getFileData();
      try {
        cf.checkMetadata(metadata);
      } catch (e) {
        expect(e.name).toEqual(commonErrors.badMetadata);
      }
    });

    test("If parameters file does not contain name metadata it must throw badMetadataException", async () => {
      expect.assertions(1);
      setMockFiles("params_bad_no_metadata_name");

      const metadata = await meta.getFileData();
      try {
        cf.checkMetadata(metadata);
      } catch (e) {
        expect(e.name).toEqual(commonErrors.badMetadata);
      }
    });

    test("If parameters file does not contain domain metadata it must throw badMetadataException", async () => {
      expect.assertions(1);
      setMockFiles("params_bad_no_metadata_domain");

      const metadata = await meta.getFileData();
      try {
        cf.checkMetadata(metadata);
      } catch (e) {
        expect(e.name).toEqual(commonErrors.badMetadata);
      }
    });

    test("If parameters file does not contain version metadata it must throw badMetadataException", async () => {
      expect.assertions(1);
      setMockFiles("params_bad_no_metadata_version");

      const metadata = await meta.getFileData();
      try {
        cf.checkMetadata(metadata);
      } catch (e) {
        expect(e.name).toEqual(commonErrors.badMetadata);
      }
    });

    test("If parameters file does not contain bucket metadata it must throw badMetadataException", async () => {
      expect.assertions(1);
      setMockFiles("params_bad_no_metadata_bucket");

      const metadata = await meta.getFileData();
      try {
        cf.checkMetadata(metadata);
      } catch (e) {
        expect(e.name).toEqual(commonErrors.badMetadata);
      }
    });
  });

  describe("Validate template", () => {
    test("If template is invalid it must throw exception", async () => {
      expect.assertions(1);
      try {
        await cf.validateTemplate("invalid_template_url");
      } catch (e) {
        expect(e.name).toEqual(commonErrors.invalidTemplate);
      }
    });
    test("If template is not found it must throw exception", async () => {
      expect.assertions(1);
      try {
        await cf.validateTemplate("this_url_does_not_exists");
      } catch (e) {
        expect(e.name).toEqual(commonErrors.invalidTemplate);
      }
    });
    test("If template is valid it must pass", async () => {
      expect.assertions(2);
      try {
        const data = await cf.validateTemplate("valid_template_url");
        expect(data).toHaveProperty("Parameters");
        expect(data).toHaveProperty("Description");
      } catch (e) {
        console.log(e);
      }
    });
  });

  describe("Create stack", () => {
    test("If the stack is already created it must throw exception", async () => {
      expect.assertions(1);
      try {
        await cf.createStack("deployedStack");
      } catch (e) {
        expect(e.name).toEqual(commonErrors.stackCreateError);
      }
    });

    test("If the stack is being created it must throw exception", async () => {
      expect.assertions(1);
      try {
        await cf.createStack("createInProgress");
      } catch (e) {
        expect(e.name).toEqual(commonErrors.stackCreateError);
      }
    });

    test("If the stack is being deleted it must throw exception", async () => {
      expect.assertions(1);
      try {
        await cf.createStack("deleteInProgress");
      } catch (e) {
        expect(e.name).toEqual(commonErrors.stackCreateError);
      }
    });

    test("If the stack is being updated it must throw exception", async () => {
      expect.assertions(1);
      try {
        await cf.createStack("updateInProgress");
      } catch (e) {
        expect(e.name).toEqual(commonErrors.stackCreateError);
      }
    });

    test("If the stack is being rollbacked it must throw exception", async () => {
      expect.assertions(1);
      try {
        await cf.createStack("rollbackInProgress");
      } catch (e) {
        expect(e.name).toEqual(commonErrors.stackCreateError);
      }
    });

    test("If AWS cant create stack for unknown reasons, it must throw exception", async () => {
      expect.assertions(1);
      try {
        config.setConfig({
          environment: "dev",
          "aws.onCreateStackFailure": "ROLLBACK",
          "aws.capabilities": []
        });
        await cf.createStack("cantCreateInAWS", "", {});
      } catch (e) {
        expect(e.name).toEqual(commonErrors.stackCreateError);
      }
    });
    test("If stack creation is triggered it must return the stack id", async () => {
      expect.assertions(1);
      try {
        const stack = await cf.createStack("canCreateInAWS", "", {});
        expect(stack).toHaveProperty("StackId");
      } catch (e) {
        console.log(e);
      }
    });
    test("When no environment key is present in config, stack name must be prepend by 'dev-'", async () => {
      expect.assertions(2);
      config.setConfig({
        "aws.onCreateStackFailure": "ROLLBACK",
        "aws.capabilities": []
      });
      const stack = await cf.createStack("infraestructure-stack", "", {});
      expect(stack).toHaveProperty("StackId");
      expect(stack.StackId).toContain("dev-infraestructure-stack");
    });
    test("When environment key is other than 'dev' or 'prod', stack name must be prepend by 'dev-'", async () => {
      expect.assertions(2);
      config.setConfig({
        environment: "chan",
        "aws.onCreateStackFailure": "ROLLBACK",
        "aws.capabilities": []
      });
      const stack = await cf.createStack("infraestructure-stack", "", {});
      expect(stack).toHaveProperty("StackId");
      expect(stack.StackId).toContain("dev-infraestructure-stack");
    });
    test("When environment key is 'dev', stack name must be prepend by 'dev-'", async () => {
      expect.assertions(2);
      config.setConfig({
        environment: "dev",
        "aws.onCreateStackFailure": "ROLLBACK",
        "aws.capabilities": []
      });
      const stack = await cf.createStack("infraestructure-stack", "", {});
      expect(stack).toHaveProperty("StackId");
      expect(stack.StackId).toContain("dev-infraestructure-stack");
    });
    test("When environment is 'prod', stack name must be prepend by 'prod-'", async () => {
      expect.assertions(2);
      process.env.ENVIRONMENT = "prod";
      const stack = await cf.createStack("infraestructure-stack", "", {});
      expect(stack).toHaveProperty("StackId");
      expect(stack.StackId).toContain("prod-infraestructure-stack");
    });
  });
});
