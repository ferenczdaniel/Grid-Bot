import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { BingChat } from "bing-chat";

const app = express();
const BING_COOKIE = "PUdsxl/891GrmzHq/Lgbsh|1684217824980|1684310714980";

app.use(cors());
app.use(bodyParser.json());

const api = new BingChat({ cookie: BING_COOKIE });
console.log("asd");

let result;

app.post("/", async (req, res) => {
    console.log(typeof req.body);

    const prompt = req.body.message;

    console.log(req.body);

    let results = {};
    results.text = "";

    while (results.text === "") {
        results = await api.sendMessage(prompt, result);
    }

    result = results;

    console.log(JSON.stringify(results));

    res.send(results);
});

app.listen(8081, () => {
    console.log("Server listening on http://localhost:8081/");
});
