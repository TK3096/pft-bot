const perfectUtils = require("./utils");

async function ProjectPSaid(agent, userId) {
  const existing = await perfectUtils.getLog(userId);

  if (!existing) {
    await perfectUtils.setLog(userId);
  }

  const data = (await perfectUtils.getMessages(userId)) || [];

  if (!data || !data?.messages || data.messages.length === 0) {
    await agent.add("คุณไม่มีสิทธิ์ในการรู้ความลับของ PFT 😎");
    return;
  }

  for (const message of data.messages) {
    await agent.add(message);
  }
}

module.exports = ProjectPSaid;
