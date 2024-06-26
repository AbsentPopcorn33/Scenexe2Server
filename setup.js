const fs = require("fs");
const https = require("https");
const responseData = function (response, FileName) {
  let data = "";
  response.on("data", (chunk) => {
    data = data + chunk.toString();
  });

  response.on("end", () => {
    const body = data;
    //    console.log(body);
    fs.writeFileSync("./" + FileName, body);
    console.log("File " + FileName + " Downloaded");
  });
};

let tankDataURL =
  "https://raw.githubusercontent.com/AbsentPopcorn33/Scenexe2Server/main/tankData.js";

let ServerURL =
  "https://raw.githubusercontent.com/AbsentPopcorn33/Scenexe2Server/main/Server.js";

let dimffaURL =
  "https://raw.githubusercontent.com/AbsentPopcorn33/Scenexe2Server/main/dim-ffa.js";

let PackageURL =
  "https://raw.githubusercontent.com/AbsentPopcorn33/Scenexe2Server/main/package.json";

const tankData = https.request(tankDataURL, (response) =>
  responseData(response, "tankData.js")
);
const Server = https.request(ServerURL, (response) =>
  responseData(response, "Server.js")
);
const dimffa = https.request(dimffaURL, (response) =>
  responseData(response, "dim-ffa.js")
);
const Package = https.request(PackageURL, (response) =>
  responseData(response, "package.json")
);

tankData.on("error", (error) => {
  console.log("An error", error);
});
tankData.end();
Server.on("error", (error) => {
  console.log("An error", error);
});
Server.end();
dimffa.on("error", (error) => {
  console.log("An error", error);
});
dimffa.end();
Package.on("error", (error) => {
  console.log("An error", error);
});
Package.end();
