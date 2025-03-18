const admin = require("firebase-admin");

const db = admin.firestore();

async function get(docId) {
  try {
    const doc = await db.collection("ledgers").doc(docId).get();

    return doc.data();
  } catch (error) {
    console.log("[LEDGER/GET]: ", error);
  }
}

async function set(docId, payload) {
  try {
    await db.collection("ledgers").doc(docId).set(payload);
  } catch (error) {
    console.log("[LEDGER/SET]: ", error);
  }
}

module.exports = {
  get,
  set,
};
