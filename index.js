const {
    generateRequestUrl,
    normaliseResponse,
} = require("google-translate-api-browser");
const https = require("https");
const fs = require("fs");
const texts = [];
function Read() {
    fs.readFile("from.txt", "utf-8", (err, data) => {
        let datas = data.split(/\r?\n/);
        Prints(0);
        function Prints(index) {
            if (index >= datas.length) {
                console.log(texts);
                fs.writeFile("to.txt", texts.join("\n"), (err) => {});
                return;
            }
            console.log(index + "/" + datas.length);
            Translate(datas[index], "zh-CN", "mn", (res) => {
                texts.push(res);
                Prints(index + 1);
            });
        }
        
    });
}

Read();

function Translate(text, from, to, onComplete) {
    const url = generateRequestUrl(text, {
        to: to,
        from: from,
    });
    https.get(url, (resp) => {
        let data = "";

        resp.on("data", (chunk) => {
            data += chunk;
        });

        resp.on("end", () => {
            onComplete(normaliseResponse(JSON.parse(data)).text);
        });
    });
}
