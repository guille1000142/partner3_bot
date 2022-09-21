const http = require("http");
const cron = require("node-cron");
const axios = require("axios");
const { db } = require("./firebase/firebase");

// cron.schedule("*/1 * * * * *", async () => {
cron.schedule("0 * * * *", async () => {
  const chatRef = db.collection("bot").doc("chat");
  const chatDoc = await chatRef.get();
  const chatData = chatDoc.data();

  // Obtiene access_token y refresh_token del code generado manualmente
  // axios("https://id.twitch.tv/oauth2/token", {
  //   method: "POST",
  //   headers: {
  //     ContentType: "application/x-www-form-urlencoded",
  //   },
  //   data: {
  //     client_id: process.env.TWITCH_CLIENT_ID,
  //     client_secret: process.env.TWITCH_CLIENT_SECRET,
  //     code: process.env.TWITCH_BOT_CODE,
  //     grant_type: "authorization_code",
  //     redirect_uri: process.env.TWITCH_REDIRECT_URI,
  //   },
  // })
  //   .then((res) => {
  //     const tokens = res.data;
  //     console.log(tokens);
  //     if (tokens) {
  //       chatRef.update(tokens);
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  // Refresca access_token con refresh_token

  // App
  axios("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      ContentType: "application/x-www-form-urlencoded",
    },
    data: {
      grant_type: "refresh_token",
      refresh_token: chatData.refresh_token,
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
    },
  })
    .then((res) => {
      const tokens = res.data;
      console.log(tokens);
      chatRef.update(tokens);
    })
    .catch((err) => {
      console.log(err);
    });
});

const PORT = process.env.PORT;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
