const { DynamoDB } = require("aws-sdk");
const underscore = require("underscore");

const groupByValues = {
  CLIENT: "client",
  TYPE: "type",
  TIME: "time",
};

const supportedTimeBuckets = {
  m: 60,
  h: 3600,
  d: 86400,
};

const tableName = process.env.DB_TABLE;

const scanDynamo = async (event) => {
  const db = new DynamoDB.DocumentClient();
  const demoSession = event.headers["Demo-Session"];

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

const isInt = (value) => {
  var x;
  return isNaN(value) ? !1 : ((x = parseFloat(value)), (0 | x) === x);
};

const timeBucketParamToSeconds = (timeBucketParam) => {
  if (timeBucketParam) {
    const splitParam = timeBucketParam.match(/[a-zA-Z]+|[0-9]+/g);
    if (
      splitParam.length === 2 &&
      isInt(splitParam[0]) &&
      Object.keys(supportedTimeBuckets).includes(splitParam[1].toLowerCase())
    ) {
      return (
        // convert to int seconds
        parseInt(splitParam[0]) *
        supportedTimeBuckets[splitParam[1].toLowerCase()]
      );
    } else {
      throw new Error(
        `${timeBucketParam} is not a valid \"timeBucket\" query parameter value`
      );
    }
  } else {
    throw new Error('The query parameter "timeBucket" must be provided');
  }
};

// Group to array of results in same time bucket in sorted order
// (Array of array of objects)
const groupToTimeBucketArray = (items, seconds) => {
  return underscore
    .chain(items)
    .groupBy(function (obj) {
      return Math.floor(+new Date(obj.createdAt) / (1000 * seconds));
    })
    .sortBy(function (v, k) {
      return k;
    })
    .value();
};

// Collate array into object of { 'time' : 'count' }
const timeGroupsArrayToObject = (array, seconds) => {
  let newGroupedObj = array.reduce((obj, item) => {
    if (item[0].createdAt) {
      obj[item[0].createdAt] = item.length;
    }
    return obj;
  }, {});

  // Rename time keys to the start time of time bucket
  const keyValues = Object.keys(newGroupedObj).map((key) => {
    let date = new Date(key);
    let coeff = 1000 * seconds;
    const newKey = new Date(
      Math.floor(date.getTime() / coeff) * coeff
    ).toISOString();
    return { [newKey]: newGroupedObj[key] };
  });
  return Object.assign({}, ...keyValues);
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
    let timeBucketParam = event.queryStringParameters.timeBucket;

    // Check if valid groupBy params were provided
    if (
      groupByParam &&
      Object.values(groupByValues).includes(groupByParam.toLowerCase())
    ) {
      let groupedResults;
      let results, seconds;

      // Group results from dynamo based on param
      if (groupByParam.toLowerCase() == groupByValues.TIME) {
        try {
          seconds = timeBucketParamToSeconds(timeBucketParam);
        } catch (err) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: err.message }),
          };
        }
        // Only scan dynamodb if valid time query params are provided
        const results = await scanDynamo(event);

        const timeGoupsArray = groupToTimeBucketArray(results.Items, seconds);
        groupedResults = timeGroupsArrayToObject(timeGoupsArray, seconds);
      } else {
        const results = await scanDynamo(event);
        groupedResults = groupBy(results.Items, groupByParam.toLowerCase());

        // Aggregate count for each group
        Object.keys(groupedResults).map(
          (key) => (groupedResults[key] = groupedResults[key].length)
        );
      }

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
