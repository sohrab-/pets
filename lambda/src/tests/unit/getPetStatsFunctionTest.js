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
            {
              type: "cat",
              client: "mobile",
              demoSession: "test1",
              createdAt: "2020-07-30T03:30:40.057Z",
            },
            {
              type: "cat",
              client: "desktop",
              demoSession: "test1",
              createdAt: "2020-07-30T09:10:30.500Z",
            },
            {
              type: "dog",
              client: "mobile",
              demoSession: "test2",
              createdAt: "2020-07-30T03:01:30.040Z",
            },
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
      expect(Object.keys(response).length === 2);
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
      expect(Object.keys(response).length === 2);
    });

    it('correctly returns results with "groupBy: createdAt, timeBucket: 3h"', async () => {
      event = {
        headers: {},
        queryStringParameters: { groupBy: "createdAt", timeBucket: "3h" },
      };

      const result = await getPetStatsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(200);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response["2020-07-30T03:00:00.000Z"]).to.be.equal(2);
      expect(response["2020-07-30T09:00:00.000Z"]).to.be.equal(1);
      expect(Object.keys(response).length === 2);
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

    it('correctly returns 400 when "timeBucket" is not set when "groupby: createdAt"', async () => {
      event = { headers: {}, queryStringParameters: { groupBy: "createdAt" } };

      const result = await getPetStatsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(400);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response.message).to.be.equal(
        'The query parameter "timeBucket" must be provided'
      );
    });

    it('correctly returns 400 when "timeBucket" is invalid', async () => {
      event = {
        headers: {},
        queryStringParameters: { groupBy: "createdAt", timeBucket: "invalid" },
      };

      const result = await getPetStatsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(400);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response.message).to.be.equal(
        'invalid is not a valid "timeBucket" query parameter value'
      );
    });

    it("correctly returns 500 when dynamo returns an error", async () => {
      mockDynamoDBError();

      event = { headers: {}, queryStringParameters: { groupBy: "type" } };

      const result = await getPetStatsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(500);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response.message).to.be.equal("Internal Server Error");

      restoreDynamoDB();
    });

    it("correctly returns 500 when dynamo returns an error when groupBy createdAt", async () => {
      mockDynamoDBError();

      event = {
        headers: {},
        queryStringParameters: { groupBy: "createdAt", timeBucket: "3h" },
      };

      const result = await getPetStatsFunction.lambdaHandler(event, context);

      expect(result).to.be.an("object");
      expect(result.statusCode).to.equal(500);

      let response = JSON.parse(result.body);

      expect(response).to.be.an("object");
      expect(response.message).to.be.equal("Internal Server Error");

      restoreDynamoDB();
    });
  });
});

/**
 * Helper Functions
 */

const mockDynamoDBError = () => {
  AwsMock.mock("DynamoDB.DocumentClient", "scan", (_, callback) => {
    callback("mockError", null);
  });
};

const restoreDynamoDB = () => {
  AwsMock.restore("DynamoDB.DocumentClient");
};
