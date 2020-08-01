"use strict";

const createPetsFunction = require("../../createPetFunction.js");
const chai = require("chai");
const AWS = require("aws-sdk");
const AwsMock = require("aws-sdk-mock");
const sinon = require("sinon");
const expect = chai.expect;

let sandbox;
let event, context;

AWS.config.update({ region: "ap-southeast-2" });
AwsMock.setSDKInstance(AWS);

describe("CreatePetsFunction Lambda Handler", function () {
  describe("Successful Calls", function () {
    beforeEach(() => {
      // set up a mock calls to AWS
      mockDynamoDBSuccess();
      mockS3Success();
    });

    afterEach(() => {
      // restore normal function
      restoreDynamoDB();
      restoreS3();
    });

    it("correctly returns results with an image", async () => {
      mockRekognitionSuccess();
      event = require("./resources/image-request.json");

      const result = await createPetsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(201);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response.type).to.be.equal("dog");

      sandbox.restore();
    });

    it("correctly returns results with pet type set", async () => {
      event = require("./resources/no-image-request.json");

      const result = await createPetsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(201);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response.type).to.be.equal("cat");
    });

    it("correctly returns results even when s3 does not upload image", async () => {
      mockRekognitionSuccess();
      mockS3Error();

      event = require("./resources/image-request.json");

      const result = await createPetsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(201);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response.type).to.be.equal("dog");

      sandbox.restore();
    });

    it("correctly returns results even when moderation label was detected", async () => {
      mockRekognitionModerationLabelIdentified();

      event = require("./resources/image-request.json");

      const result = await createPetsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(201);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response.type).to.be.equal("dog");

      sandbox.restore();
    });
  });

  describe("Unsuccessful Calls", function () {
    it("correctly returns 500 when dynamo returns an error", async () => {
      mockDynamoDBError();
      event = require("./resources/no-image-request.json");

      const result = await createPetsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(500);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response.message).to.be.equal("Internal Server Error");

      restoreDynamoDB();
    });

    it("correctly returns 400 response provided type is not a supported pet", async () => {
      event = require("./resources/invalid-pet-request.json");

      const result = await createPetsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(400);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response.message).to.be.equal("person is not a supported pet");
    });

    it("correctly returns 400 response when image does not contain supported pet", async () => {
      event = require("./resources/image-request.json");

      mockRekognitionPetNotIdentified();

      const result = await createPetsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(400);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response.message).to.be.equal("person is not a supported pet");

      sandbox.restore();
    });
  });
});

/**
 * Helper functions
 */

const restoreDynamoDB = () => {
  AwsMock.restore("DynamoDB.DocumentClient");
};

const restoreS3 = () => {
  AwsMock.restore("S3");
};

const mockDynamoDBSuccess = () => {
  AwsMock.mock("DynamoDB.DocumentClient", "put", function (params, callback) {
    callback(null, "successfully put item in database");
  });
};

const mockDynamoDBError = () => {
  AwsMock.mock("DynamoDB.DocumentClient", "put", function (params, callback) {
    callback("mockError", null);
  });
};

const mockS3Success = () => {
  AwsMock.mock("S3", "putObject", function (params, callback) {
    callback(null, "successfully put item in bucket");
  });
};

const mockS3Error = () => {
  AwsMock.mock("S3", "putObject", function (params, callback) {
    callback("mockError", null);
  });
};

// Note on mocking AWS Rekognition:
//   - aws-sdk-mock does not mock Rekognition
//   - Mocking AWS.Services.prototype as AWS SDK classes are built dynamically from JSON configuration

const mockRekognitionSuccess = () => {
  sandbox = sinon.createSandbox();
  sandbox.stub(AWS.Service.prototype, "makeRequest").returns({
    promise: () => {
      return {
        Labels: [
          { Confidence: 98, Name: "Person" },
          { Confidence: 90, Name: "Dog" },
          { Confidence: 90, Name: "Canine" },
        ],
        ModerationLabels: [],
      };
    },
  });
};

const mockRekognitionPetNotIdentified = () => {
  sandbox = sinon.createSandbox();
  sandbox.stub(AWS.Service.prototype, "makeRequest").returns({
    promise: () => {
      return {
        Labels: [
          { Confidence: 98, Name: "Person" },
          { Confidence: 90, Name: "Wolf" },
          { Confidence: 90, Name: "Canine" },
        ],
      };
    },
  });
};

const mockRekognitionModerationLabelIdentified = () => {
  sandbox = sinon.createSandbox();
  sandbox.stub(AWS.Service.prototype, "makeRequest").returns({
    promise: () => {
      return {
        Labels: [
          { Confidence: 98, Name: "Person" },
          { Confidence: 90, Name: "Dog" },
          { Confidence: 90, Name: "Canine" },
        ],
        ModerationLabels: ["Does not save to S3"],
      };
    },
  });
};
