const fs = require("fs");
const fetch = require("fetch").fetchUrl;
let Scenexe2File = "Scenexe2.js";
const Site = {
  URL: function (a, b, c, f, col) {
    return `<br><a style='${f != undefined ? "font-family:" + f : ""}${
      col != undefined ? "; color: #" + col : ""
    }' href='${c || "https"}://${a}'>${b || "Link"}`;
  },
  Text: function (a, f, col) {
    return `<br><a style='${f != undefined ? "font-family:" + f : ""}${
      col != undefined ? "; color: #" + col : ""
    }'>${a}`;
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
      p1: "a",
      p2: "b",
    },
    standalone: 1,
    message: `Connect to Test Server${
      Site.Text("Testing Site function and message customisation") +
      Site.Text("am BEANS lol") +
      Site.URL(
        "glitch.com/~spangled-purring-crowberry",
        "Original Glitch Project"
      ) +
      Site.URL("github.com", "Github") +
      Site.URL("scenexe2.io", "Scenexe2") +
      Site.Text("Im Going To Shit Yourself", "monospace", "903F05")
    }`,
    Scenexe2File: scen2,
    Files: false,
    reqCert: false,
    backColor: "000000",
    textColor: "FFFFFF",
    textFont: "cursive",
    Security: "https",
  };
  let data = scenexe2.run(options);
  //data.dimension.dims.crossroadsLobby.gleaming = 1
};
if (fs.existsSync(Scenexe2File)) {
  console.log("Found file");
}
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
