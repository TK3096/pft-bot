const admin = require("firebase-admin");

const db = admin.firestore();

async function getMessages(docId) {
  try {
    const doc = await db.collection("messages").doc(docId).get();

    return doc.data();
  } catch (error) {
    console.log("[MESSAGES/GET]: ", error);
  }
}

module.exports = {
  getMessages,
};
