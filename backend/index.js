const dotenv = require("dotenv");
require("dotenv").config();
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");
const multer = require("multer");
const fs = require("fs");
const FormData=require("form-data")
const Port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploadstorage = multer({ storage: storage });

app.use(cors());
app.use(bodyparser.json());

app.post("/upload/single", uploadstorage.single("file"), (req, res) => {
  try {
    console.log("this is the file", req.file);

    let data = new FormData();
    data.append("file", fs.createReadStream(`./uploads/${req.file.originalname}`));
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://rag-chat-ml-backend-dev.flock.io/contribute/submit_file?file_type=link&model_id=7715939322",
      headers: {
        "x-api-key": process.env.FLOCK_BOT_API_KEY,
        ...data.getHeaders(),
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

    res.send("file uploaded");
  } catch (error) {
    console.log("this isthe error ", error);
  }
});
app.post("/upload/multiple", uploadstorage.array("file", 10), (req, res) => {
  console.log(req.files);
  res.send("Multiple file uploaded");
});

async function sendRequest(questions) {
  try {
    const payload = {
      question: questions,
      chat_history: [],
      knowledge_source_id: process.env.MODEL_ID, // replace with your model id
    };

    // Set the headers
    const headers = {
      "x-api-key": process.env.FLOCK_BOT_API_KEY,
    };

    const response = await axios.post(
      process.env.FLOCK_BOT_ENDPOINT, // Corrected this line
      payload,
      { headers: headers }
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
}

app.post("/rag_request", async (req, res) => {
  const userpayload = req.body;
  try {
    const response = await sendRequest(userpayload.input);

    res.json({
      answer: response,
    });
  } catch (error) {
    res.status(411).json({
      answer: "this is the error :" + error,
    });
  }
});

app.listen(Port, () => {
  console.log(`Server started listening at ${Port}`);
});
