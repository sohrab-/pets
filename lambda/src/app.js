const { DynamoDB } = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const supportedPets = [
  "cat",
  "dog",
  "fish",
  "hamster",
  "mouse",
  "parrot",
  "rabbit",
  "snake",
  "turtle",
];

const tableName = "pets";

// DynamoDB doesn't like null values
const removeNullFields = (item) => {
  ["S", "BOOL"].forEach((type) => {
    for (let key in item) {
      if (
        type in item[key] &&
        (item[key][type] === null || item[key][type] === undefined)
      ) {
        delete item[key];
      }
    }
  });
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
exports.lambdaHandler = async (event, context) => {
  try {
    // TODO remove
    console.log(JSON.stringify(event));
    console.log(JSON.stringify(context));

    const body = JSON.parse(event.body);
    let pet = body.pet;
    if (event.body.image) {
      // TODO invoke rekognition
      // TODO set 'pet' to returned value
    }

    console.log(pet);
    if (supportedPets.indexOf(pet) > -1) {
      let id = uuidv4();
      let imagePath = null;
      if (event.body.image) {
        // TODO store in S3 as '<id>.<ext>'
        // TODO set 'imagePath' to S3 URL
      }

      const item = {
        id: { S: id },
        pet: { S: pet },
        imagePath: { S: imagePath },
        userAgent: { S: event.headers["User-Agent"] },
        desktopClient: {
          BOOL: event.headers["CloudFront-Is-Desktop-Viewer"] === true,
        },
        mobileClient: {
          BOOL: event.headers["CloudFront-Is-Mobile-Viewer"] === true,
        },
        smartTvClient: {
          BOOL: event.headers["CloudFront-Is-SmartTV-Viewer"] === true,
        },
        tabletClient: {
          BOOL: event.headers["CloudFront-Is-Tablet-Viewer"] === true,
        },
        country: { S: event.headers["CloudFront-Viewer-Country"] },
        // TODO any other useful info that can be gleaned?
      };

      removeNullFields(item);
      console.log(item);

      // insert into DynamoDB
      const db = new DynamoDB({ apiVersion: "2012-08-10" });
      await db.putItem({ TableName: tableName, Item: item }).promise();

      return {
        statusCode: 201,
        body: JSON.stringify({ pet }),
      };
    } else {
      // bad request
      return {
        statusCode: 400,
        body: JSON.stringify({ message: `${pet} is not a supported pet` }),
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
