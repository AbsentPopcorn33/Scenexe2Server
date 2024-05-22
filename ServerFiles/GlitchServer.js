const fs = require("fs");
const fetch = require("fetch").fetchUrl;
let Scenexe2File = "Scenexe2.js";
const Site = {
  URL: function (a, b, c, f) {
    return `<br><a style=font-family:${f || "monospace"} href='${
      c || "https"
    }://${a}'>${b || "Link"}`;
  },
  Text: function (a, f) {
    return `<br><a style=font-family:${f || "monospace"}>${a}`;
  },
};
const main = function (scenexe2) {
  let options = {
    parentPort: {
      postMessage: function () {},
    },
    port: 4000,
    testing: 0,
    start: `load('./dims//dim.ffa.js'), load('./dims//dim.sanctuary.js')`,
    secret: {
      p1: process.env.maintoken,
      p2: process.env.token,
    },
    standalone: 1,
    message: `Connect to Private Server${
      Site.Text("Server Mod By AbsentPopcorn33") +
      Site.Text("Im Going To Shit Yourself")
    }`,
    Scenexe2File: fs.readFileSync('./ServerFiles//MainScenexe2.js'),
    Files: true,
    certReq: false,
    textColor: 'FFFFFF',
    backColor: '000000'
  };
  let data = scenexe2.run(options);
  //data.dimension.dims.crossroadsLobby.gleaming = 1
};

const scen2 =
  typeof Scenexe2File !== "undefined" && fs.existsSync(Scenexe2File)
    ? fs.readFileSync(Scenexe2File).toString()
    : console.log("Scenexe2 Server File Missing \nServer Not Started");

if (scen2) {
  let __module__ = {
    exports: {},
  };
  let s = scen2.toString().replace(`module`, `__module__`);
  eval(s);
  main(__module__.exports);
}
