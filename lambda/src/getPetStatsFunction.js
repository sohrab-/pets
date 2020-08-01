const { DynamoDB } = require("aws-sdk");

const supportedGroupByFields = ["client", "type"];

const tableName = process.env.DB_TABLE;

const scanDynamo = async (demoSession) => {
  const db = new DynamoDB.DocumentClient();

  let params = {
    TableName: tableName,
  };

  if (demoSession) {
    let additionalParams = {
      FilterExpression: "demoSession = :demoSession",
      ExpressionAttributeValues: { ":demoSession": demoSession },
      IndexName: "demoSession-index",
    };

    params = { ...params, ...additionalParams };
  }

  return db.scan(params).promise();
};

// Group Object by values of provided key
const groupBy = (data, key) => {
  return data.reduce((storage, item) => {
    (storage[item[key]] = storage[item[key]] || []).push(item);
    return storage;
  }, {});
};

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, _) => {
  try {
    let groupByParam = event.queryStringParameters.groupBy;

    // Only run dynamodb scan if valid query param is provided
    if (
      groupByParam &&
      Object.values(supportedGroupByFields).includes(groupByParam.toLowerCase())
    ) {
      const results = await scanDynamo(event.headers["Demo-Session"]);

      // Group results from dynamo based on param
      const groupedResults = groupBy(results.Items, groupByParam.toLowerCase());

      // Aggregate count for each group
      Object.keys(groupedResults).map(
        (key) => (groupedResults[key] = groupedResults[key].length)
      );

      return {
        statusCode: 200,
        body: JSON.stringify(groupedResults),
      };
    } else {
      // bad request
      let errMessage = groupByParam
        ? `${groupByParam} is not a valid \"groupBy\" query parameter value`
        : 'The query parameter "groupBy" must be provided';
      return {
        statusCode: 400,
        body: JSON.stringify({ message: errMessage }),
      };
    }
  } catch (err) {
    // something is terribly wrong
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
