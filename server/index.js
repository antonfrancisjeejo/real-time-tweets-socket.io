const needle = require("needle");

//after adding the streamTweets
const http = require("http");
const path = require("path");
const express = require("express");
const socketIo = require("socket.io");

const config = require("dotenv").config();
const TOKEN = process.env.TWITTER_BEARER_TOKEN;

//after adding the streamTweets
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../", "client", "index.html"));
});

const rulesUrl = "https://api.twitter.com/2/tweets/search/stream/rules";
const streamUrl =
  "https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id";

const rules = [{ value: "giveaway" }];

//check after adding setRules
// const rules = [{ value: "giveaway" }, { value: "xbox" }];

//Get Stream rules
async function getRules() {
  const response = await needle("get", rulesUrl, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  console.log(response.body);
  return response.body;
}

//Set Stream Rules
async function setRules() {
  const data = {
    add: rules,
  };
  const response = await needle("post", rulesUrl, data, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.body;
}

//Delete Stream Rules
async function deleteRules(rules) {
  if (!Array.isArray(rules.data)) {
    return null;
  }
  const ids = rules.data.map((rule) => rule.id);
  const data = {
    delete: {
      ids: ids,
    },
  };
  const response = await needle("post", rulesUrl, data, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.body;
}

// function streamTweets() {
// after adding the html page
function streamTweets(socket) {
  const stream = needle.get(streamUrl, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  stream.on("data", (data) => {
    try {
      const json = JSON.parse(data);
      //   console.log(json);
      // after adding the html page
      socket.emit("tweet", json);
    } catch (error) {}
  });
}

//after adding the streamTweets
io.on("connection", async () => {
  console.log("Client Connected");
  //add after creating html page
  let currentRules;
  try {
    //before adding delete rules
    // await setRules();
    // currentRules = await getRules();

    //after adding delete rules
    currentRules = await getRules();

    await deleteRules(currentRules);

    await setRules();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  //after adding deleteRules function
  streamTweets(io);
});

//comment it after adding the streamTweets
// (async () => {
//   let currentRules;
//   try {
//     //before adding delete rules
//     // await setRules();
//     // currentRules = await getRules();

//     //after adding delete rules
//     currentRules = await getRules();

//     await deleteRules(currentRules);

//     await setRules();
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }

//   //after adding deleteRules function
//   streamTweets();
// })();

//after adding the streamTweets
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
