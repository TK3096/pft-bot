const admin = require("firebase-admin");

const db = admin.firestore();

async function getSecret(id) {
  try {
    const doc = await db.collection("secrets").doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return doc.data();
  } catch (error) {
    console.log("[ERROR/SECRETS]: ", error);

    return null;
  }
}

module.exports = {
  getSecret,
};
