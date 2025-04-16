const admin = require("firebase-admin");

admin.initializeApp();

const chatbot = require("./chatbot");

exports.chatbot = chatbot.chatbot;
