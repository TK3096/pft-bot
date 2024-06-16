const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Bangkok");

const ledger = require("./utils/ledger");

exports.chatbot = functions
  .region("asia-southeast1")
  .https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    const lineId =
      request.body.originalDetectIntentRequest.payload.data.source.userId;

    async function ledgerSummary(agent) {
      const year = agent.parameters.year;
      const month = agent.parameters.month;

      if (!year || !month) {
        await agent.add("ไม่สามารถทำรายการต่อได้ ลองดูใหม่อีกทีนะ");
        return;
      }

      const data = await ledger.get(lineId);
      const transactions = data?.[year]?.[month]?.transactions || [];

      if (transactions.length === 0) {
        await agent.add("ไม่พบข้อมูลการทำรายการในเดือนนี้");
        return;
      }

      const result = transactions.reduce(
        (acc, cur) => {
          if (cur.type === "deposit") {
            acc.deposit += Number(cur.amount);
          } else if (cur.type === "withdraw") {
            acc.withdraw += Number(cur.amount);
          }

          return acc;
        },
        {
          deposit: 0,
          withdraw: 0,
        }
      );

      const response = [
        `รายรับ/รายจ่าย ของ ${year} ${month} คือ `,
        `deposit ${result.deposit} บาท`,
        `withdraw ${result.withdraw} บาท`,
        `รวม ${result.deposit - result.withdraw} บาท`,
      ];
      await agent.add(response.join("\n"));
    }

    async function ledgerTransactions(agent) {
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
      const month = dayjs().month() + 1; // month is 0-indexed, convert to 1-indexed

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

      if (!payload[year][month]) {
        payload[year][month] = {
          transactions: [
            {
              type,
              amount: parseFloat(amount),
            },
          ],
        };
      } else {
        payload[year][month].transactions.push({
          type,
          amount: parseFloat(amount),
        });
      }

      payload.updatedAt = dayjs().tz().format();

      await ledger.set(lineId, payload);
      await agent.add("บันทึกข้อมูลเรียบร้อยแล้ว 😄");
    }

    let intentMap = new Map();

    intentMap.set("Ledger - Transactions - yes", ledgerTransactions);
    intentMap.set("Ledger - Summary - yes", ledgerSummary);

    agent.handleRequest(intentMap);
  });
