const fs = require("fs");
const fetch = require("fetch").fetchUrl;
const Site = {
  URL: function (a, b, c, f) {
    return `<br><a style=font-family:${f || "monospace"} href='${c || "https"}://${a}'>${b || "Link"}`;
  },
  Text: function (a, f) {
    return `<br><a style=font-family:${f || "monospace"}>${a}`;
  },
};

const main = function(scenexe2) {
  let options = {
    parentPort: {
      postMessage: function() {}
    },
    port: 3000,
    testing: 1,
    start: `load('./dim-ffa.js')`,
    secret: {
      p1: 'a',
      p2: 'b'
    },
    message: `Connect To Server`,
    standalone: 1
  }
  let data = scenexe2.run(options)
//  data.dimension.dims.ffa.gleaming = 1
}

fetch('https://github.com/AbsentPopcorn33/Scenexe2Server/raw/Main/Scenexe2.js', function(a, b, c) {
  let __module__ = {
    exports: {}
  }
  let s = c.toString().replace(`module`, `__module__`)
  eval(s)
  main(__module__.exports)
})
