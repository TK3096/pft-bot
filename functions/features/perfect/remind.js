const perfectUtils = require("./utils");

async function PerfectRemind(agent, userId) {
  const existing = await perfectUtils.getLog(userId);

  if (!existing) {
    await perfectUtils.setLog(userId);
  }

  const data = await perfectUtils.getReminds();

  if (!data || data.length === 0) {
    await agent.add("ยังไม่มีอะไรที่ PFT ต้องทำจ้า 😄");
    return;
  }

  const response = data.reduce((acc, cur) => {
    const items = cur.items.map((item) => {
      return `😎 ${item}`;
    });

    acc.push(...items);

    return acc;
  }, []);

  await agent.add("PFT มีรายการที่ต้องทำดังนี้จ้า");
  await agent.add(response.join("\n"));
}

module.exports = PerfectRemind;
