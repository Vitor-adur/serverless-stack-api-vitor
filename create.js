import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";
import AWS from "aws-sdk";

const ses = new AWS.SES();

export const main = handler(async (event, context) => {
  const { toCc, to, from, subject, content } = JSON.parse(event.body);
  console.log('LOG_AQUI', event);
  const params = {
    TableName: process.env.tableName,
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: content,
      createdAt: Date.now()
    }
  };

  await dynamoDb.put(params);

  const mailParams = {
    Destination: {
      CcAddresses: [ toCc ],
      ToAddresses: [ to ]
    },
    Message: {
        Body: {
          Text: { Data: content }
        },
        Subject: { Data: subject }
    },
    Source: from
  };

    await ses.sendEmail(mailParams).promise();

    return params.Item;

});