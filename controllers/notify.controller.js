const admin = require("firebase-admin");
const FCM = require("fcm-node");
const { Account, notifyAccount } = require("../models");
const serviceAccount = require("../config/xioami-md28-firebase-adminsdk-xzypw-b20593eec4.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//const fcm = new FCM(process.env.FCM);
const fcm = new FCM(
  "AAAAjF46CC4:APA91bGm5n9UYevBNVrCWA_MWgGw8SJRN3_L28XU1pJ8pwsTHWdoSZMqPibQoB3az5akJtcNMVWtIPDA9jQb9dy2zTOrh5w3Eui5wAh9WeaUux6wpX9bPgaxFVIJNDClWac2HzlZ6Kq9"
);

exports.sendMessage = async (req, res) => {
  const AccountId = req.params.AccountId;
  const { title, content } = req.body;

  try {
    // Retrieve the user's fcmToken from the Account model
    const user = await Account.findByPk(AccountId);
    const registrationToken = user.fcmToken;
    console.log(registrationToken);
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
      to: registrationToken,
    };
    console.log(message);
    // Send the notification with a callback function
    console.log(fcm);
    fcm.send(message, async (err, response) => {
      if (err) {
        console.error("Error sending message:", err);
        return res
          .status(500)
          .json({ status: 500, message: "Internal server error" });
      }

      // Save the notification in the Notify model
      await notifyAccount.create({
        title: title,
        content: content,
        AccountId: AccountId,
      });

      console.log("Successfully sent message:", response);
      res
        .status(200)
        .json({ status: 200, message: "Notification sent successfully" });
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.sendMessageAll = async (req, res) => {
  const { title, content } = req.body;
  const AccountIds = req.body.AccountIds; // Assuming AccountIds is an array of user IDs

  try {
    // Fetch FCM tokens for all users
    const users = await Account.findAll({
      where: {
        id: AccountIds,
      },
    });

    const registrationTokens = users.map((user) => user.fcmToken);

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
      registration_ids: registrationTokens,
    };

    // Send the notification to all users
    fcm.send(message, async (err, response) => {
      if (err) {
        console.error("Error sending multicast message:", err);
        return res
          .status(500)
          .json({ status: 500, message: "Internal server error" });
      }

      // Save the notification in the Notify model for each user
      const notifications = registrationTokens.map((token, index) => ({
        title: title,
        content: content,
        AccountId: AccountIds[index],
      }));
      await notifyAccount.bulkCreate(notifications);

      console.log("Successfully sent multicast message:", response);
      res
        .status(200)
        .json({ status: 200, message: "Notifications sent successfully" });
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
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
