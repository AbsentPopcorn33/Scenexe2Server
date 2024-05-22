const fs = require("fs");
const fetch = require("fetch").fetchUrl;
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
    port: 3000,
    testing: 1,
    start: `load('./dim-ffa.js')`,
    secret: {
      p1: "a",
      p2: "b",
    },
    message: `Connect To Server`,
    standalone: 1,
//    backColor: '', //WebPage Background Color
//    textColor: '', //WebPage Text Color
//    textFont: '', //WebPage Text Font
  };
  let data = scenexe2.run(options);
  //  data.dimension.dims.ffa.gleaming = 1
};

fetch(
  "https://raw.githubusercontent.com/AbsentPopcorn33/Scenexe2Server/main/Scenexe2.js",
  function (a, b, c) {
    let __module__ = {
      exports: {},
    };
    let s = c.toString().replace(`module`, `__module__`);
    eval(s);
    main(__module__.exports);
  }
);
