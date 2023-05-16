import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { BingChat } from "bing-chat";

const app = express();
const BING_COOKIE = "PUDqXi/890GrmXHq/LgZch|1684219714980|1684219714980";

app.use(cors());
app.use(bodyParser.json());

const api = new BingChat({ cookie: BING_COOKIE });
console.log("asd");

app.post("/", async (req, res) => {
    console.log(typeof req.body);

    const prompt = req.body.message;

    console.log(req.body);

    let results = {};
    results.text = "";

    while (results.text === "") {
        results = await api.sendMessage(prompt);
    }

    console.log(JSON.stringify(results));

    res.send(results);
});

app.listen(8081, () => {
    console.log("Server listening on http://localhost:8081/");
});
