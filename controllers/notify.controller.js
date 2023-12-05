const admin = require("firebase-admin");
const FCM = require("fcm-node");
const { Account, Notify, notifyAccount } = require("../models");

admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
});

const fcm = new FCM(process.env.FCM);

exports.sendMessage = async (req, res) => {
  const AccountId = req.params.AccountId;
  const { title, content } = req.body;

  try {
    // Retrieve the user's fcmToken from the Account model
    const user = await Account.findByPk(AccountId);
    const registrationToken = user.fcmToken;

    const message = {
      notification: {
        title: title,
        body: content,
      },
      android: {
        notification: {
          imageUrl:
            "https://res.cloudinary.com/dj9kuswbx/image/upload/v1701677696/ehpkgf7liptimndzhitp.jpg",
        },
      },
      token: registrationToken,
    };

    // Send the notification
    const response = await fcm.send(message);

    // Save the notification in the Notify model
    await notifyAccount.create({ title: title, content: content });

    console.log("Successfully sent message:", response);
    res
      .status(200)
      .json({ status: 200, message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.sendMessageAll = async (req, res) => {
  const { title, content } = req.body;

  try {
    // Retrieve the user's fcmToken from the Account model
    const user = await Account.findAll();
    const registrationToken = user.fcmToken;

    const message = {
      notification: {
        title: title,
        body: content,
      },
      android: {
        notification: {
          imageUrl:
            "https://res.cloudinary.com/dj9kuswbx/image/upload/v1701677696/ehpkgf7liptimndzhitp.jpg",
        },
      },
      registration_ids: registrationToken,
    };

    // Send the notification
    const response = await fcm.send(message);

    // Save the notification in the Notify model
    await Notify.create({ title: title, content: content });

    console.log("Successfully sent message:", response);
    res
      .status(200)
      .json({ status: 200, message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

exports.getNotify = async (req, res) => {
  const AccountId = req.params.AccountId;
  try {
    const user = await Account.findByPk(AccountId);
    if (!user) {
      return res
        .status(404)
        .json({ status: 404, message: "Account not found" });
    }
    const listNotify = await notifyAccount.findAll({
      where: { AccountId: AccountId },
    });
    if (!listNotify) {
      return res
        .status(400)
        .json({ status: 400, message: "Connect not found" });
    }
    return res.status(200).json({ status: 200, data: listNotify });
  } catch (error) {
    console.error("Error sending message:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
