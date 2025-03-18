const projectPSaid = require("./utils");

async function ProjectPSaid(agent, userId) {
  //   console.log(userId);
  // if (userId === 'SOME_USER_ID') {
  // }

  const data = (await projectPSaid.getMessages("E8AktZ7uHFfPrKWuIzLV")) || [];

  for (const message of data.messages) {
    await agent.add(message);
  }
}

module.exports = ProjectPSaid;
