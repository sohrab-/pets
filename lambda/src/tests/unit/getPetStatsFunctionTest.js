"use strict";

const getPetStatsFunction = require("../../getPetStatsFunction.js");
const chai = require("chai");
const AWS = require("aws-sdk");
const AwsMock = require("aws-sdk-mock");

const expect = chai.expect;

AWS.config.update({ region: "ap-southeast-2" });
AwsMock.setSDKInstance(AWS);

describe("GetPetStatsFunction Lambda Handler", function () {
  let event, context, expectedDynamoParams, scanTableSpy;

  describe("Successful Calls", function () {
    beforeEach(() => {
      // set up a mock calls to AWS
      AwsMock.mock("DynamoDB.DocumentClient", "scan", (_, callback) => {
        const mockResults = {
          Items: [
            { type: "cat", client: "mobile", demoSession: "test1" },
            { type: "cat", client: "desktop", demoSession: "test1" },
            { type: "dog", client: "mobile", demoSession: "test2" },
          ],
        };
        callback(null, mockResults);
      });

      event = null;
    });

    afterEach(() => {
      // restore normal function
      AwsMock.restore("DynamoDB.DocumentClient");
    });

    it('correctly returns results with "groupBy: type"', async () => {
      event = { headers: {}, queryStringParameters: { groupBy: "type" } };

      const result = await getPetStatsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(200);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response.dog).to.be.equal(1);
      expect(response.cat).to.be.equal(2);
      expect(response.mobile).to.be.equal(undefined);
      expect(response.desktop).to.be.equal(undefined);
    });

    it('correctly returns results with "groupBy: client"', async () => {
      event = { headers: {}, queryStringParameters: { groupBy: "client" } };

      const result = await getPetStatsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(200);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response.mobile).to.be.equal(2);
      expect(response.desktop).to.be.equal(1);
      expect(response.dog).to.be.equal(undefined);
      expect(response.cat).to.be.equal(undefined);
    });
  });

  describe("Unsuccessful Calls", function () {
    beforeEach(() => {
      event = null;
    });

    it('correctly returns 400 when "groupBy" is not set', async () => {
      event = { headers: {}, queryStringParameters: {} };

      const result = await getPetStatsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(400);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response.message).to.be.equal(
        'The query parameter "groupBy" must be provided'
      );
    });

    it('correctly returns 400 when "groupBy" is invalid', async () => {
      event = { headers: {}, queryStringParameters: { groupBy: "invalid" } };

      const result = await getPetStatsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(400);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response.message).to.be.equal(
        'invalid is not a valid "groupBy" query parameter value'
      );
    });

    it("correctly returns 500 when dynamo returns an error", async () => {
      AwsMock.mock("DynamoDB.DocumentClient", "scan", (_, callback) => {
        callback("mockError", null);
      });

      event = { headers: {}, queryStringParameters: { groupBy: "type" } };

      const result = await getPetStatsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(500);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response.message).to.be.equal("Internal Server Error");

      // restore normal function
      AwsMock.restore("DynamoDB.DocumentClient");
    });
  });
});
