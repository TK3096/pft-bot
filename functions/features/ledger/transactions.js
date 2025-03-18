const ledgerUtils = require("./utils");
const dayjs = require("../../libs/utils").dayjs;

async function ledgerTransactions(agent, userId) {
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

  const data = await ledgerUtils.get(userId);
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

  await ledgerUtils.set(userId, payload);
  await agent.add("บันทึกข้อมูลเรียบร้อยแล้ว 😄👍");
}

module.exports = ledgerTransactions;
