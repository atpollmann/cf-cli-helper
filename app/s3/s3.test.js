jest.mock("../util/aws");
jest.mock("fs");
const { commonErrors } = require("../errors");
const { events } = require("../util/events");
const s3 = require("./index");

describe("S3 module", () => {
  describe("Object exists", () => {
    test("If object does not exists it must return false", async () => {
      expect.assertions(1);
      const exists = await s3.templateExists(
        "this",
        "bucket",
        "does_not",
        "exists"
      );
      expect(exists).toBeFalsy();
    });

    test("If object does exists it must return truth", async () => {
      expect.assertions(1);
      const exists = await s3.templateExists("bucket", "global", "VPC", "1.0");
      expect(exists).toBeTruthy();
    });
  });

  describe("Uploader", () => {
    const mockFiles = {
      "/path/to/workdir/templates": ["main.yml", "more_nested", "nested"],
      "/path/to/workdir/templates/more_nested": ["classfile.js", "utils"],
      "/path/to/workdir/templates/more_nested/utils": ["utils.js"],
      "/path/to/workdir/templates/nested": ["nestedFile.js"]
    };

    beforeEach(() => {
      require("fs").__setMockFiles(mockFiles);
    });

    test("Put file, if local file does not exists it must throw exception", async () => {
      expect.assertions(1);
      const uploader = new s3.Uploader();
      try {
        await uploader.putFile(
          "/path/to/workdir/templates/NO_LOCAL_FILE.yml",
          "path/to/dir/doesNotExistsLocal.txt",
          "bucket"
        );
      } catch (e) {
        expect(e.name).toMatch(commonErrors.localFileNotFound);
      }
    });

    test("Put file, if s3 bucket does not exists it must throw exception", async () => {
      expect.assertions(2);
      const mockFn = jest.fn();
      const uploader = new s3.Uploader();
      uploader.on(events.s3ObjectUploading, mockFn);
      uploader.on(events.s3ObjectUploaded, mockFn); // This shouldn't be triggered

      try {
        await uploader.putFile(
          "/path/to/workdir/templates/main.yml",
          "global/VPC/1.0/main.yml",
          "NOBUCKET"
        );
      } catch (e) {
        expect(mockFn.mock.calls.length).toEqual(1);
        expect(e.name).toMatch(commonErrors.s3Error);
      }
    });

    test("Put file, it must upload a local file successfuly", async () => {
      expect.assertions(3);
      const mockFn = jest.fn();
      const uploader = new s3.Uploader();
      uploader.on(events.s3ObjectUploading, mockFn);
      uploader.on(events.s3ObjectUploaded, mockFn);

      const data = await uploader.putFile(
        "/path/to/workdir/templates/main.yml",
        "global/VPC/1.0/main.yml",
        "bucket"
      );
      expect(data).toHaveProperty("ETag");
      expect(data.ETag).toEqual("6805f2cfc46c0f04559748bb039d69ae");
      expect(mockFn.mock.calls.length).toEqual(2);
    });

    test("Put directory, if local file does not exists it must throw local file not found error", async () => {
      expect.assertions(1);
      const uploader = new s3.Uploader();

      try {
        await uploader.putDirectory(
          "/path/to/workdir/NOEXISTS",
          "global/VPC/1.0",
          "bucket"
        );
      } catch (e) {
        expect(e.name).toMatch(commonErrors.localFileNotFound);
      }
    });

    test("Put directory, it must upload a local full directory successfully", async () => {
      expect.assertions(1);
      const mockFn = jest.fn();
      const uploader = new s3.Uploader();
      uploader.on(events.s3DirectoryUploading, mockFn);
      uploader.on(events.s3ObjectUploading, mockFn);
      uploader.on(events.s3ObjectUploaded, mockFn);
      uploader.on(events.s3DirectoryUploaded, mockFn);

      try {
        await uploader.putDirectory(
          "/path/to/workdir/templates",
          "global/VPC/1.0",
          "bucket"
        );
        expect(mockFn.mock.calls.length).toEqual(10);
      } catch (e) {
        expect(e).toEqual("chan");
      }
    });
  });
});
