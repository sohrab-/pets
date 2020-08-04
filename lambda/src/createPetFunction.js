const { DynamoDB, Rekognition, S3 } = require("aws-sdk");
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

const tableName = process.env.DB_TABLE;
const bucketName = process.env.IMAGE_BUCKET;

const rekognition = new Rekognition();

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
  const s3 = new S3();
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image",
  };
  return s3.putObject(params).promise();
};

const insertIntoDynamo = async (id, type, imageFilename, headers) => {
  const db = new DynamoDB.DocumentClient();

  let client = null;
  if (headers["CloudFront-Is-SmartTV-Viewer"] === "true") {
    client = "smartTV";
  } else if (headers["CloudFront-Is-Tablet-Viewer"] === "true") {
    client = "tablet";
  } else if (headers["CloudFront-Is-Mobile-Viewer"] === "true") {
    client = "mobile";
  } else if (headers["CloudFront-Is-Desktop-Viewer"] === "true") {
    client = "desktop";
  }

  const item = {
    id,
    type,
    demoSession: headers["Demo-Session"],
    imageFilename: imageFilename || "", // so it doesn't consider the item as NULL only
    ip: headers["X-Forwarded-For"]
      ? headers["X-Forwarded-For"].split(",")[0]
      : null,
    userAgent: headers["User-Agent"],
    client,
    country: headers["CloudFront-Viewer-Country"],
    createdAt: new Date().toISOString(),
  };

  return db.put({ TableName: tableName, Item: item }).promise();
};

const getFileType = (encodedFile) => {
  return encodedFile.split("data:image/").pop().split(";base64,")[0];
};

const getImageBuffer = (encodedFile) => {
  const base64Image = encodedFile.split("base64,")[1];
  return Buffer.from(base64Image, "base64");
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
      type =
        supportedLabels.length > 0
          ? supportedLabels[0].toLowerCase()
          : // Get first label it has been identified as
            results.Labels[0].Name.toLowerCase();
    }

    if (supportedPets.indexOf(type) > -1) {
      let id = uuidv4();
      let imageFileName = null;

      if (body.image) {
        const moderationResult = await rekognizeModerationLabels(imageBuffer);

        // Only upload image if it does not have unsafe content
        if (moderationResult.ModerationLabels.length === 0) {
          imageFileName = id + "." + getFileType(body.image);
          try {
            await uploadImageToS3(imageFileName, imageBuffer);
          } catch {
            imageFileName = null;
          }
        }
      }

      await insertIntoDynamo(id, type, imageFileName, event.headers);

      return {
        statusCode: 201,
        body: JSON.stringify({ id, type, message: "success" }),
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
