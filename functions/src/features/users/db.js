const admin = require("firebase-admin");

const db = admin.firestore();

async function getUser(id) {
  try {
    const doc = await db.collection("users").doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return doc.data();
  } catch (error) {
    console.log("[ERROR/USERS]: ", error);

    return null;
  }
}

module.exports = {
  getUser,
};
