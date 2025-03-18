const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Bangkok");

const ledgerTransactions = require("./features/ledger/transactions");
const ledgerSummary = require("./features/ledger/summary");
const projectPSaid = require("./features/project-p/said");

exports.chatbot = functions
  .region("asia-southeast1")
  .https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    const userId =
      request.body.originalDetectIntentRequest.payload.data.source.userId;

    let intentMap = new Map();

    intentMap.set("Ledger - Transactions - yes", (agent) =>
      ledgerTransactions(agent, userId)
    );
    intentMap.set("Ledger - Summary - yes", (agent) =>
      ledgerSummary(agent, userId)
    );
    intentMap.set("Project P", (agent) => projectPSaid(agent, userId));

    agent.handleRequest(intentMap);
  });
