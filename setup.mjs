import got from "got";
import fs from "fs";
import http from "https";

let server = await got(
  "https://github.com/AbsentPopcorn33/Scenexe2Server/raw/main/Server.js"
);
let dimffa = await got(
  "https://github.com/AbsentPopcorn33/Scenexe2Server/raw/main/dim-ffa.js"
);

const tankData = await got(
  "https://github.com/AbsentPopcorn33/Scenexe2Server/raw/main/tankData.js"
);

fs.writeFileSync("./Server.js", server.rawBody);
fs.writeFileSync("./dim-ffa.js", dimffa.rawBody);
fs.writeFileSync("./tankData.js", tankData.rawBody);
