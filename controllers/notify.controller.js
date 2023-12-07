exports.sendMessage = async (req, res) => {
  const registrationToken = req.params.fcmToken;
  const message = {
    notification: {
      title: "$FooCorp up 1.43% on the day",
      body: "$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.",
    },
    android: {
      notification: {
        imageUrl:
          "https://res.cloudinary.com/dj9kuswbx/image/upload/v1701677696/ehpkgf7liptimndzhitp.jpg",
      },
    },
    token: registrationToken,
  };
  getMessaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};
