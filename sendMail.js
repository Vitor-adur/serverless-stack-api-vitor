/*import AWS from "aws-sdk";
import handler from "./libs/handler-lib";

const ses = new AWS.SES();

export const main = handler(async (event) => {
    console.log('event', event);

    const { to, from, subject, text } = JSON.parse(event.body);



    const params = {
      Destination: {
          ToAddresses: [ to ]
      },
      Message: {
          Body: {
            Text: { Data: text }
          },
          Subject: { Data: subject }
      },
      Source: from
    };

        await ses.sendEmail(params).promise();
});
*/