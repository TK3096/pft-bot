const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");

const secrets = require("./features/secrets");

exports.chatbot = functions
  .region("asia-southeast1")
  .https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    const userId =
      request.body.originalDetectIntentRequest.payload.data.source.userId;

    let intentMap = new Map();

    intentMap.set("Ledger - Transactions - yes", (agent) =>
      agent.add("In the process of improve 🚧")
    );
    intentMap.set("Ledger - Summary - yes", (agent) =>
      agent.add("In the process of improve 🚧")
    );
    intentMap.set("PerfecT", (agent) => secrets(agent, userId));
    intentMap.set("PerfecT2", (agent) =>
      agent.add("In the process of improve 🚧")
    );

    agent.handleRequest(intentMap);
  });
