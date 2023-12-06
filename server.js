const express = require("express");
const path = require("path");
const app = express();
//added stuff
const fs = require('fs')
const request = require('request')
const config = require('./config')
const port = config.PORT
const api_key_syn = config.API_KEY_SYN
const api_key_dict = config.API_KEY_DICT

// Middleware for common logic
app.use("/frontend/static", express.static(path.resolve(__dirname, "frontend", "static")));

app.get('/api/word/:ticker', (req, res) => {
    const ticker = req.params.ticker;

    let url = `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${ticker}?key=${api_key_syn}`;

    request.get({
        url: url,
        json: true,
        headers: { 'User-Agent': 'request' }
    }, (err, response, data) => {
        if (err) {
            console.log('Error:', err);
            res.status(500).send('Internal Server Error');
        } else if (response.statusCode !== 200) {
            console.log('Status:', response.statusCode);
            res.status(response.statusCode).send('API Request Failed');
        } else {
            // Now, handle the file write logic
            const newData = JSON.stringify(data);
            const filePath = path.resolve(__dirname, "frontend", "static", "data", `${ticker}.json`);

            fs.writeFile(filePath, newData, (err) => {
                if (err) {
                    console.log('Write file error: ', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    console.log('File write success!');
                    // Now, read the file and send its contents in the response
                    fs.readFile(filePath, 'utf8', function(readErr, fileData) {
                        if (readErr) {
                            console.log("File read error", readErr);
                            res.status(500).send("Internal Server Error");
                        } else {
                            res.send(JSON.parse(fileData));
                        }
                    });
                }
            });
        }
    });
});

app.get('/api/random', function(req, res){
    let ticker = "tempvalue"
    const randomWordUrl = "https://random-word-api.herokuapp.com/word"

    request.get({
        url: randomWordUrl,
        json: true,
        headers: { 'User-Agent': 'request' }
    }, (err, response, data) => {
        if (err) {
            console.log('Error:', err);
            res.status(500).send('Internal Server Error');
        } else if (response.statusCode !== 200) {
            console.log('Status:', response.statusCode);
            res.status(response.statusCode).send('API Request Failed');
        } else {
            // Log response body and headers for inspection
            console.log('Response Headers:', response.headers);
            console.log('Response Body:', data);

            // Attempt to convert the response body to JSON
            res.send(data);
        }
    });
})

app.get("/api/sentence/:ticker", (req, res) =>{
    const ticker = req.params.ticker;

    let url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${ticker}?key=${api_key_dict}`;

    request.get({
        url: url,
        json: true,
        headers: { 'User-Agent': 'request' }
    }, (err, response, data) => {
        if (err) {
            console.log('Error:', err);
            res.status(500).send('Internal Server Error');
        } else if (response.statusCode !== 200) {
            console.log('Status:', response.statusCode);
            res.status(response.statusCode).send('API Request Failed');
        } else {
            // Now, handle the file write logic
            const newData = JSON.stringify(data);
            const filePath = path.resolve(__dirname, "frontend", "static", "data", `${ticker}.json`);

            fs.writeFile(filePath, newData, (err) => {
                if (err) {
                    console.log('Write file error: ', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    console.log('File write success!');
                    // Now, read the file and send its contents in the response
                    fs.readFile(filePath, 'utf8', function(readErr, fileData) {
                        if (readErr) {
                            console.log("File read error", readErr);
                            res.status(500).send("Internal Server Error");
                        } else {
                            res.send(JSON.parse(fileData));
                        }
                    });
                }
            });
        }
    });


})

// Serve HTML for all routes except those starting with /frontend/static
app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname,"frontend", "index.html"));
});

app.listen(process.env.PORT || 8080, () => console.log("server running...."));