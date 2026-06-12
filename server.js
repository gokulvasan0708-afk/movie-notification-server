const express = require("express");
const admin = require("firebase-admin");

const app = express();

app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  })
});

app.get("/", (req, res) => {
  res.send("Notification Server Running");
});

app.post("/sendNotification", async (req, res) => {
  try {

    const movieName = req.body.movieName;

    const tokensSnapshot = await admin.firestore()
      .collection("notificationTokens")
      .get();

    const tokens = [];

    tokensSnapshot.forEach(doc => {
      const data = doc.data();

      if (data.token) {
        tokens.push(data.token);
      }
    });

    if (tokens.length === 0) {
      return res.json({
        success: false,
        message: "No Tokens Found"
      });
    }

    const response =
      await admin.messaging().sendEachForMulticast({

        tokens,

        notification: {
          title: "🎬 New Anime Added",
          body: `${movieName} is now available`
        }

      });

    res.json({
      success: true,
      sent: response.successCount
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
