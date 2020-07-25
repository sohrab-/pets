const { DynamoDB, Rekognition, S3 } = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const db = new DynamoDB({ apiVersion: "2012-08-10" });
const s3 = new S3();
const rekognition = new Rekognition();

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
const bucketName = "pets-soe-dpe-au-images";

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
    const body = JSON.parse(event.body);
    let type = body.type;
    let imageBuffer = null;

    if (body.image) {
      imageBuffer = getImageBuffer(body.image);

      const results = await rekognizeLabels(imageBuffer);
      const supportedLabels = results.Labels.map(
        (label) => label.Name
      ).filter((name) => supportedPets.includes(name.toLowerCase()));

      // Get matching supported pet label if available
      if (supportedLabels.length > 0) {
        type = supportedLabels[0].toLowerCase();
      } else {
        // Get first label it has been identified as
        type = results.Labels[0].Name.toLowerCase();
      }
    }

    if (supportedPets.indexOf(type) > -1) {
      let id = uuidv4();
      let imageFileName = null;

      if (body.image) {
        const moderationResult = await rekognizeModerationLabels(imageBuffer);

        // Only upload image if it does not have unsafe content
        if (moderationResult.ModerationLabels.length === 0) {
          imageFileName = id + "." + getFileType(body.image);
          await uploadImageToS3(imageFileName, imageBuffer);
        }
      }

      await insertIntoDynamo(event, id, type, imageFileName);

      return {
        statusCode: 201,
        body: JSON.stringify({ type }),
      };
    } else {
      // bad request
      return {
        statusCode: 400,
        body: JSON.stringify({ message: `${type} is not a supported pet` }),
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

const rekognizeLabels = async (imageBytes) => {
  const params = {
    Image: {
      Bytes: imageBytes,
    },
    MaxLabels: 10,
  };

  return rekognition.detectLabels(params).promise();
};

const rekognizeModerationLabels = async (imageBytes) => {
  const params = {
    Image: {
      Bytes: imageBytes,
    },
  };

  return rekognition.detectModerationLabels(params).promise();
};

const uploadImageToS3 = async (key, buffer) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image",
  };
  return s3.putObject(params).promise();
};

const insertIntoDynamo = async (event, id, type, imageFilename) => {
  const item = {
    id: { S: id },
    type: { S: type },
    imageFilename: { S: imageFilename },
    userAgent: { S: event.headers["User-Agent"] },
    desktopClient: {
      BOOL: event.headers["CloudFront-Is-Desktop-Viewer"] === "true",
    },
    mobileClient: {
      BOOL: event.headers["CloudFront-Is-Mobile-Viewer"] === "true",
    },
    smartTvClient: {
      BOOL: event.headers["CloudFront-Is-SmartTV-Viewer"] === "true",
    },
    tabletClient: {
      BOOL: event.headers["CloudFront-Is-Tablet-Viewer"] === "true",
    },
    country: { S: event.headers["CloudFront-Viewer-Country"] },
    // TODO any other useful info that can be gleaned?
  };

  removeNullFields(item);

  return db.putItem({ TableName: tableName, Item: item }).promise();
};

const getFileType = (encodedFile) => {
  return encodedFile.split("data:image/").pop().split(";base64,")[0];
};

const getImageBuffer = (encodedFile) => {
  const base64Image = encodedFile.split("base64,")[1];
  return Buffer.from(base64Image, "base64");
};
