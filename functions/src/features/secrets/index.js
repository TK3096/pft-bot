const { getUser } = require("../users/db");
const { getSecret } = require("./db");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Bangkok");

async function Secrets(agent, userId) {
  const user = await getUser(userId);
  const secret = await getSecret(userId);

  if (!user || !secret) {
    agent.add("คุณไม่มีสิทธิ์ในการรู้ความลับนี้");
    return;
  }

  const { timestamp } = user.setting.secret;

  const now = dayjs().unix();

  if (now >= timestamp) {
    for (const msg of secret.messages) {
      await agent.add(msg);
    }
  } else {
    for (const msg of secret.default) {
      await agent.add(msg);
    }
  }
}

module.exports = Secrets;
