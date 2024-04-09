const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const dayjs = require("dayjs");

const ledger = require("./utils/ledger");

exports.chatbot = functions
  .region("asia-southeast1")
  .https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    const lineId =
      request.body.originalDetectIntentRequest.payload.data.source.userId;

    async function ledgerManagement(agent) {
      const amount = agent.parameters.amount;
      let type = "";

      if (agent.parameters.type === "-") {
        type = "withdraw";
      } else if (agent.parameters.type === "+") {
        type = "deposit";
      }

      if (!type) {
        await agent.add("ไม่สามารถทำรายการต่อได้ ลองดูใหม่อีกทีนะ");
        return;
      }

      const year = dayjs().year();
      const month = dayjs().month();

      const data = await ledger.get(lineId);
      let payload = {};

      if (!data) {
        payload = {
          [year]: {
            [month]: {
              transactions: [],
            },
          },
          updatedAt: 0,
        };
      } else {
        payload = { ...data };
      }

      payload[year][month].transactions.push({
        type,
        amount: parseFloat(amount),
      });
      payload.updatedAt = dayjs().unix();

      await ledger.set(lineId, payload);
      await agent.add("บันทึกข้อมูลเรียบร้อย");
    }

    let intentMap = new Map();

    intentMap.set("Ledger - Management - yes", ledgerManagement);

    agent.handleRequest(intentMap);
  });
