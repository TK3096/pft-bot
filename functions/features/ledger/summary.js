const ledgerUtils = require("./utils");

async function ledgerSummary(agent, userId) {
  const year = agent.parameters.year;
  const month = agent.parameters.month;

  if (!year || !month) {
    await agent.add("ไม่สามารถทำรายการต่อได้ ลองดูใหม่อีกทีนะ");
    return;
  }

  const data = await ledgerUtils.get(userId);
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

module.exports = ledgerSummary;
