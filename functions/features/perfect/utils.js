const admin = require("firebase-admin");
const dayjs = require("../../libs/utils").dayjs;

const db = admin.firestore();

async function setLog(userId) {
  try {
    await db
      .collection("user_logs")
      .doc(userId)
      .set({ createdAt: dayjs().tz().format() });

    return userId;
  } catch (error) {
    console.log("[PERFECT/SET_LOG]: ", error);
  }
}

async function getLog(userId) {
  try {
    const doc = await db.collection("user_logs").doc(userId).get();

    if (!doc.exists) {
      return null;
    }

    return userId;
  } catch (error) {
    console.log("[PERFECT/GET_LOG]: ", error);
  }
}

async function getMessages(docId) {
  try {
    const doc = await db.collection("messages").doc(docId).get();

    if (!doc.exists) {
      return null;
    }

    return doc.data();
  } catch (error) {
    console.log("[PERFECT/GET_MESSAGES]: ", error);
  }
}

async function getReminds() {
  try {
    const doc = await db.collection("reminds").get();

    const data = [];
    doc.forEach((doc) => {
      data.push(doc.data());
    });

    return data;
  } catch (error) {
    console.log("[PERFECT/GET_REMIND]: ", error);
  }
}

module.exports = {
  setLog,
  getLog,
  getMessages,
  getReminds,
};
