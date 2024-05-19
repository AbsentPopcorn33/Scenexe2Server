const { pack, unpack } = require("msgpackr"),
  WebSocket = require("ws"),
  { WebSocketServer } = WebSocket,
  fs = require("fs"),
  http = require("https"),
  url = require("url"),
  selfsigned = require("selfsigned"),
  perf_hooks = require("perf_hooks"),
  _performance = perf_hooks.performance;
let secret = {},
  ____ = [];
const checkName = function ($) {
  return !0;
};
let createAchievement = function ($) {
  return { time: Math.floor(Date.now() / 1e3), id: $ };
};
const access = {
  testing: [
    "bot",
    "tp",
    "team",
    "dim",
    "weapon",
    "body",
    "vanish",
    "god",
    "name",
  ],
  p2: [
    "name",
    "radiant",
    "missile",
    "fallen",
    "bot",
    "fallenbot",
    "drag",
    "dragwall",
    "wallsize",
    "wallteam",
    "createwall",
    "savewalls",
    "downloadwalls",
    "loadwalls",
    "uploadwalls",
    "removewall",
    "kill",
    "maxstats",
    "reset",
    "resetstats",
    "ascend",
    "announce",
    "pulltanks",
    "remove",
    "wormhole",
    "tp",
    "polygon",
    "polyhedra",
    "darkness",
    "maxpolygonsides",
    "maxpolygoncount",
    "mapsize",
    "xp",
    "addxp",
    "maxxp",
    "minxp",
    "team",
    "weapon",
    "body",
    "dim",
    "god",
    "antilag",
    "antibot",
    "fullfov",
  ],
};
console.log = new Proxy(console.log, {
  apply: function ($, e, t) {
    let a = new Date();
    return (
      t.unshift(`[${a.toDateString()} ${a.toTimeString().split(" ")[0]}]`),
      Reflect.apply($, e, t)
    );
  },
});
let logEvent = function () {};
const main = function (tankData, args) {
  process.on("uncaughtException", function ($) {
    console.log($);
  });
  let sendAchievement = function ($, e) {
      $ &&
        $.ws &&
        $.ws.accountName &&
        !$.dim.sandbox &&
        args.parentPort.postMessage(["achievement", [$.ws.accountName, e]]);
    },
    gameEnd = function ($) {
      if (
        $.ws &&
        $.ws.accountName &&
        $.ws.accountData &&
        $.ws.timeStart > 0 &&
        !$.dim.sandbox
      ) {
        let e = Math.floor((_performance.now() - $.ws.timeStart) / 1e3);
        if (
          (($.ws.accountData.timeAlive += e),
          ($.ws.accountData.score = $.score),
          $.score >= 1)
        ) {
          let t = Math.log($.score);
          (t = (t * t) / 10 - 18) > 0 && ($.ws.accountData.stars += t);
        }
        ($.ws.accountData.stars *=
          (1.2 * $.ws.accountData.timeAlive) /
          ($.ws.accountData.timeAlive + 100)),
          args.parentPort.postMessage([
            "gameEnd",
            [$.ws.accountName, $.ws.accountData, $.score],
          ]);
        let a = $.ws.accountData;
        return ($.ws.accountName = !1), ($.ws.accountData = !1), a;
      }
    },
    app = function ($, e) {
      let t = url.parse($.url),
        a = t.pathname;
      "/tankData.json" === a
        ? (e.setHeader("Access-Control-Allow-Origin", "*"),
          e.writeHead(200, { "Content-Type": "application/json" }),
          e.end(JSON_tankData))
        : "/server/scenexe2.js" === a && args.Files
        ? (e.writeHead(200, { "Content-Type": "application/json" }),
          e.end(args.Scenexe2File.toString()))
        : "/server/server.js" === a && args.Files
        ? (e.writeHead(200, { "Content-Type": "application/json" }),
          e.end(fs.readFileSync("./server.js")))
        : "/server/tankData.js" === a && args.Files
        ? (e.writeHead(200, { "Content-Type": "application/json" }),
          e.end(fs.readFileSync(args.tankDataFile || "./tankData.js")))
        : "/server/dim-ffa.js" === a && args.Files
        ? (e.writeHead(200, { "Content-Type": "application/json" }),
          e.end(fs.readFileSync("./dim-ffa.js")))
        : (e.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }),
          e.end(
            `<script>let WebPage = "${
              args.message.replace(/\s+/g, " ") || "connect to private server"
            }"; let TextColor = "#${
              args.textColor || "FFFFFF"
            }"; let BackColor = "#${args.backColor || "000000"}"</script>` +
              "<script>document.write(`<body style='color: ${TextColor}; background-color:${BackColor}'><a style='font-family:monospace' href='${'https://scenexe2.io?s=' + new URL(location.href).host}'>${WebPage}<br><a style=font-family:monospace href='https://github.com/AbsentPopcorn33/Scenexe2Server'>Server Mod By AbsentPopcorn33</body>`)</script>"
          ));
    },
    certs =
      typeof args.certs !== "undefined" ||
      (args.certReq === true && args.certReq !== "undefined")
        ? args.certs
        : fs.existsSync("./certs//secret.cer") &&
          fs.existsSync("./certs//secret.key")
        ? {
            cert: fs.readFileSync("./certs//secret.cer"),
            key: fs.readFileSync("./certs//secret.key"),
          }
        : (!fs.existsSync("./certs") ? fs.mkdirSync("./certs") : "",
          selfsigned.generate(
            [
              { name: "commonName", value: "localhost" },
              { shortName: "OU", value: "Custom Scenexe2 Server" },
              { shortName: "O", value: "AbsentPopcorn33" },
            ],
            {
              keySize: 4096,
              days: 3650,
              algorithm: "sha256",
              extensions: [{ name: "basicConstraints", cA: true }],
            },
            function (err, pems) {
              fs.writeFileSync("./certs//secret.cer", pems.cert);
              fs.writeFileSync("./certs//secret.key", pems.private);
              console.log("Server Restart Required");
              process.exit();
            }
          )),
    httpServer =
      secret.key && secret.cer
        ? http.createServer(
            {
              key: fs.readFileSync(secret.key),
              cert: fs.readFileSync(secret.cer),
            },
            app
          )
        : http.createServer(certs, app);
  args.port >= 0 ? httpServer.listen(args.port) : httpServer.listen();
  let server = new WebSocketServer({ noServer: !0 });
  httpServer.on("upgrade", ($, e, t) => {
    let a = !0,
      n = {};
    for (let i in $.headers) i.startsWith("scenexe2") && (n[i] = $.headers[i]);
    let _ = url.parse($.url);
    Object.fromEntries(new url.URLSearchParams(_.query));
    let s = _.pathname,
      o = !0,
      r;
    if (s.startsWith("/ws-")) {
      if (6 === (r = s.slice(4)).length) {
        let d = 0;
        for (let c = 0; c < 5; c++) {
          let u = "0123456789abcdef".indexOf(r[c]);
          if (u < 0) {
            o = !1;
            break;
          }
          d += u;
        }
        "0123456789abcdef".indexOf(r[5]) !== d % 16 && (o = !1);
      } else o = !1;
    } else o = !1;
    if (o) {
      for (let m = clients.length - 1; m >= 0; m--)
        if (clients[m].joinToken === r) {
          o = !1;
          break;
        }
    }
    o
      ? server.handleUpgrade($, e, t, ($) => {
          ($._headers = n),
            a ? ($.joinToken = r) : ($.failedHeaderCheck = !0),
            server.emit("connection", $);
        })
      : e.destroy();
  });
  let JSON_tankData = JSON.stringify(tankData),
    Detector = (function () {
      let $ = {
        sliceWidth: 100,
        rules: {
          tank: {
            tank: !0,
            detectEnemies: !0,
            detectFriends: !0,
            bullet: !0,
            polygon: !0,
            wall: !0,
            gate: !0,
            wormhole: !0,
          },
          detectEnemies: { tank: !0, polygon: !0, bullet: !0 },
          bullet: {
            tank: !0,
            bullet: !0,
            polygon: !0,
            wall: !0,
            gate: !0,
            wormhole: !0,
            detectEnemies: !0,
          },
          polygon: {
            tank: !0,
            bullet: !0,
            detectEnemies: !0,
            polygon: !0,
            wall: !0,
            gate: !0,
            wormhole: !0,
          },
          detectFriends: { tank: !0 },
          wall: { tank: !0, bullet: !0, polygon: !0 },
          gate: { tank: !0, bullet: !0, polygon: !0 },
          wormhole: { tank: !0, bullet: !0, polygon: !0 },
        },
        canCollide: function (e, t) {
          return (
            !e.noCollide &&
            !t.noCollide &&
            ("bullet" === e.type && "bullet" === t.type
              ? !dimension.isSameTeam(e.object, t.object) ||
                e.object.type === t.object.type
              : (0, $.rules[e.type][t.type]))
          );
        },
        checkCircle: function ($, e) {
          let t = {
            dx: $.x - e.x,
            dy: $.y - e.y,
            distance: 0,
            size: $.size + e.size,
            colliding: !1,
          };
          return (
            (t.distance = t.dx * t.dx + t.dy * t.dy),
            t.distance < t.size * t.size && (t.colliding = !0),
            0 === t.dx && 0 === t.dy && (t.dy = 1),
            t
          );
        },
        checkRect: function ($, e) {
          e.rectangular && ([$, e] = [e, $]);
          let t = {
            dx: e.x - $.x,
            dy: e.y - $.y,
            colliding: !0,
            rect: $,
            circle: e,
          };
          $.noClip
            ? (t.size = e.size)
            : (t.size =
                e.size < 2 * dimension.clipSize
                  ? e.size / 2
                  : e.size - dimension.clipSize),
            (t.inX = e.x + t.size > $.left && e.x - t.size < $.right),
            (t.inY = e.y + t.size > $.bottom && e.y - t.size < $.top);
          let a = e.size - t.size;
          return ((t.cinX = e.x > $.left + a && e.x < $.right - a),
          (t.cinY = e.y > $.bottom + a && e.y < $.top - a),
          (t.inX && t.cinY) || (t.inY && t.cinX))
            ? ((t.hitSide = !0), t)
            : ((t.cx = e.x < $.x ? $.left + a : $.right - a),
              (t.cy = e.y < $.y ? $.bottom + a : $.top - a),
              (t.dcx = e.x - t.cx),
              (t.dcy = e.y - t.cy),
              (t.distance = t.dcx * t.dcx + t.dcy * t.dcy),
              t.distance >= e.size * e.size && (t.colliding = !1),
              t);
        },
        detectCollisions: function (e, t, a) {
          let n = {},
            i = {},
            _ = 1 / $.sliceWidth,
            s = e.length;
          a = a >= 0 ? Math.ceil(a / $.sliceWidth) : -1;
          for (let o = 0; o < s; o++) {
            let r = e[o],
              d = r.w || r.size,
              c = r.h || r.size;
            (r.left = r.x - d),
              (r.right = r.x + d),
              (r.bottom = r.y - c),
              (r.top = r.y + c),
              (r.w = d),
              (r.h = c),
              (r.internalId = o);
            let u = 1 + Math.floor(r.left * _),
              m = 1 + Math.floor(r.right * _);
            if (a >= 0) {
              if (u > a || m < 1 - a) continue;
              m > a && (m = a), u < 1 - a && (u = 1 - a);
            }
            for (let p = u; p <= m; p++) p in i ? i[p].push(r) : (i[p] = [r]);
          }
          let f = ($, e) => $.bottom - e.bottom,
            g = function ($, e) {
              let t = n[$];
              return t || (t = n[$] = {}), !(e in t) && ((t[e] = !0), !0);
            },
            y = 0;
          for (let h in i) {
            let k = i[h];
            k.sort(f);
            for (let v = 0, b = k.length - 1; v < b; v++) {
              let w = k[v];
              for (let x = v + 1; x <= b; x++) {
                let T = k[x];
                if (T.bottom > w.top) break;
                if (
                  w.right >= T.left &&
                  w.left <= T.right &&
                  (w.object,
                  T.object,
                  $.canCollide(w, T) && g(w.internalId, T.internalId))
                ) {
                  if (w.rectangular || T.rectangular) {
                    if (w.rectangular ^ T.rectangular) {
                      let z = $.checkRect(w, T);
                      z.colliding && t(z.circle, z.rect, z);
                    }
                  } else {
                    let S = $.checkCircle(w, T);
                    S.colliding && t(w, T, S);
                  }
                }
                y++;
              }
            }
          }
          return y;
        },
      };
      return $;
    })(),
    View = (function () {
      let $ = {
        sliceWidth: 100,
        rules: { fov: { bullet: !0 }, bullet: { fov: !0 } },
        canCollide: function (e, t) {
          return $.rules[e.type][t.type];
        },
        checkCircle: function ($, e) {
          let t = {
            dx: $.x - e.x,
            dy: $.y - e.y,
            distance: 0,
            size: $.size + e.size,
            colliding: !0,
          };
          return 0 === t.dx && 0 === t.dy && (t.dy = 1), t;
        },
        detectCollisions: function (e, t) {
          let a = {},
            n = {},
            i = 1 / $.sliceWidth,
            _ = e.length;
          for (let s = 0; s < _; s++) {
            let o = e[s],
              r = o.w || o.size,
              d = o.h || o.size;
            (o.left = o.x - r),
              (o.right = o.x + r),
              (o.bottom = o.y - d),
              (o.top = o.y + d),
              (o.w = r),
              (o.h = d),
              (o.internalId = s);
            let c = 1 + Math.floor(o.left * i),
              u = 1 + Math.floor(o.right * i);
            for (let m = c; m <= u; m++) m in n ? n[m].push(o) : (n[m] = [o]);
          }
          let p = ($, e) => $.bottom - e.bottom,
            f = function ($, e) {
              let t = a[$];
              return t || (t = a[$] = {}), !(e in t) && ((t[e] = !0), !0);
            },
            g = 0;
          for (let y in n) {
            let h = n[y];
            h.sort(p);
            for (let k = 0, v = h.length - 1; k < v; k++) {
              let b = h[k];
              for (let w = k + 1; w <= v; w++) {
                let x = h[w];
                if (x.bottom > b.top) break;
                if (
                  b.right >= x.left &&
                  b.left <= x.right &&
                  (b.object,
                  x.object,
                  $.canCollide(b, x) && f(b.internalId, x.internalId))
                ) {
                  let T = $.checkCircle(b, x);
                  T.colliding && t(b, x, T);
                }
                g++;
              }
            }
          }
          for (let z = 0; z < _; z++) {
            let S = e[z];
            S.w = S.h = !1;
          }
          return g;
        },
      };
      return $;
    })(),
    clients = [],
    game = {
      clients: clients,
      codes:
        args.codes ||
        (function () {
          let $ = {
            recieve: {
              ready: 0,
              gameUpdate: 1,
              gameStart: 2,
              announcement: 3,
              death: 4,
              setStats: 5,
              test: 6,
              flag: 7,
              eval: 8,
              waiting: 9,
            },
            send: {
              joinGame: 0,
              chat: 1,
              typing: 2,
              passive: 3,
              firing: 4,
              controlPosition: 5,
              upgradeStat: 6,
              upgradeWeapon: 7,
              upgradeBody: 8,
              restore: 9,
              direction: 10,
              d: 11,
              token: 12,
              result: 13,
              ping: 14,
              captcha: 15,
              login: 16,
              createAccount: 17,
            },
          };
          for (let e in $.send) $.send[$.send[e]] = e;
          for (let t in $.recieve) $.recieve[$.recieve[t]] = t;
          return $;
        })(),
      c: {
        recieve: {
          0: "ready",
          ready: 0,
          1: "gameUpdate",
          gameUpdate: 1,
          2: "gameStart",
          gameStart: 2,
          3: "announcement",
          announcement: 3,
          4: "death",
          death: 4,
          5: "setStats",
          setStats: 5,
          6: "test",
          test: 6,
          7: "flag",
          flag: 7,
        },
        send: {
          joinGame: 14,
          14: "joinGame",
          chat: 1,
          1: "chat",
          typing: 2,
          2: "typing",
          passive: 3,
          3: "passive",
          firing: 4,
          4: "firing",
          controlPosition: 5,
          5: "controlPosition",
          upgradeStat: 6,
          6: "upgradeStat",
          upgradeWeapon: 7,
          7: "upgradeWeapon",
          upgradeBody: 8,
          8: "upgradeBody",
          restore: 9,
          9: "restore",
          direction: 10,
          10: "direction",
          d: 11,
          11: "d",
          token: 17,
          17: "token",
          result: 29,
          29: "result",
          ping: 31,
          31: "ping",
          captcha: 79,
          79: "captcha",
        },
      },
      token: secret.token,
    },
    createMessage = function () {
      args.parentPort.postMessage(["createMessage", Array.from(arguments)]);
    },
    pathfind = {
      controller: function ($) {
        let e = {
          tank: $.tank,
          osize: $.range,
          updateInterval: $.updateInterval || 1e3,
          lastUpdate: 0,
          map: !1,
          dx: $.dx || 0,
          dy: $.dy || 0,
          r: $.r || 300,
          update: function (t, a, n, i) {
            if (e.map && !(t > e.lastUpdate + e.updateInterval)) return !1;
            e.lastUpdate = t;
            let _ = e.tank.dim.walls;
            $.extraWalls && (_ = _.concat($.extraWalls));
            let s = pathfind.extract(_, 0, 0, -e.dx, -e.dy, e.osize, e.r);
            return (
              i &&
                (i = [
                  Math.floor(i[0] / e.r + 0.5 + e.dx),
                  Math.floor(i[1] / e.r + 0.5 + e.dy),
                ]),
              (s = pathfind.preMap({
                map: s,
                maxSteps: $.maxSteps,
                x: Math.floor(a / e.r + 0.5 + e.dx),
                y: Math.floor(n / e.r + 0.5 + e.dy),
                target: i,
              })),
              (e.map = s),
              !0
            );
          },
          getImpulse: function ($, t) {
            return (
              e.map || e.update(),
              ($ = Math.floor($ / e.r + 0.5 + e.dx)),
              (t = Math.floor(t / e.r + 0.5 + e.dy)),
              pathfind.getImpulse(e.map, $, t)
            );
          },
          directPath: function ($, t, a, n) {
            return pathfind.directPath(e.tank.dim.walls, $, t, a, n);
          },
        };
        return e;
      },
      directPath: function ($, e, t, a, n) {
        let i, _, s, o;
        e < a ? ((i = e), (s = a)) : ((i = a), (s = e)),
          t < n ? ((_ = t), (o = n)) : ((_ = n), (o = t));
        for (let r = 0, d = $.length; r < d; r++) {
          let c = $[r];
          if (
            c &&
            c[0] + c[2] > i &&
            c[0] - c[2] < s &&
            c[1] + c[3] > _ &&
            c[1] - c[3] < o
          )
            return !1;
        }
        return !0;
      },
      createMap: function ($, e) {
        let t = [];
        t.osize = $;
        for (let a = 0; a < e; a++) {
          let n = [];
          for (let i = 0; i < e; i++) n.push(0);
          t.push(n);
        }
        return t;
      },
      flag: function ($, e, t) {
        let a = 1 << e;
        return t ? $ | a : !1 == t ? ($ | a) ^ a : $ ^ a;
      },
      readFlag: function ($, e) {
        return $ & (1 << e);
      },
      flagCell: function ($, e, t, a, n, i) {
        (t += e), (a += e), ($[t][a] = pathfind.flag($[t][a], n, i));
      },
      step: function ($, e, t, a) {
        let n = [];
        for (let i = 0, _ = e.length; i < _; i++) {
          let s = e[i][0],
            o = e[i][1];
          if (
            pathfind.add($, t, s + 1, o, n, 2, a) ||
            pathfind.add($, t, s, o + 1, n, 3, a) ||
            pathfind.add($, t, s - 1, o, n, 4, a) ||
            pathfind.add($, t, s, o - 1, n, 5, a)
          )
            return [];
        }
        for (let r = 0, d = n.length; r < d; r++) {
          let c = n[r][0],
            u = n[r][1];
          pathfind.flagCell($, t, c, u, 1, 1);
        }
        return n;
      },
      add: function ($, e, t, a, n, i, _) {
        if (
          t >= -e &&
          a >= -e &&
          t <= e &&
          a <= e &&
          !pathfind.readFlag($[t + e][a + e], 1) &&
          (i >= 0 && pathfind.flagCell($, e, t, a, i, 1),
          pathfind.flagCell($, e, t, a, 1, 1),
          pathfind.readFlag($[t + e][a + e], 0) || n.push([t, a]),
          _ && t === _[0] && a === _[1])
        )
          return !0;
      },
      preMap: function ($) {
        let e = $.map,
          t = e.osize,
          a = [];
        pathfind.add(e, t, $.x, $.y, a), (a = [[$.x, $.y]]);
        for (
          let n = 0, i = $.maxSteps < 1e3 ? $.maxSteps : 1e3;
          n < i && (a = pathfind.step(e, a, t, $.target))[0];
          n++
        );
        return e;
      },
      findPath: function ($) {
        let e = $.map,
          t = $.x + e.osize,
          a = $.y + e.osize;
        if (e[t]) {
          let n = [[t - e.osize, a - e.osize]],
            i = e[t][a];
          if (!(i >= 0)) return !1;
          for (let _ = 0; _ < 100; _++) {
            if (pathfind.readFlag(i, 2)) t--;
            else if (pathfind.readFlag(i, 3)) a--;
            else if (pathfind.readFlag(i, 4)) t++;
            else {
              if (!pathfind.readFlag(i, 5)) return n.reverse();
              a++;
            }
            if (e[t]) {
              if (!((i = e[t][a]) >= 0)) return !1;
              n.push([t - e.osize, a - e.osize]);
            }
          }
        }
        return !1;
      },
      getImpulse: function ($, e, t) {
        if (((e += $.osize), (t += $.osize), $[e] && $[e][t] >= 0)) {
          let a = $[e][t];
          if (pathfind.readFlag(a, 2)) return 2;
          if (pathfind.readFlag(a, 3)) return 3;
          if (pathfind.readFlag(a, 4)) return 0;
          if (pathfind.readFlag(a, 5)) return 1;
        }
        return -1;
      },
      extract: function ($, e, t, a, n, i, _) {
        let s = (i + 0.5) * _,
          o = e * _,
          r = t * _,
          d = 2 * i + 1,
          c = o - s,
          u = o + s,
          m = r - s,
          p = r + s,
          f = pathfind.createMap(i, d);
        for (let g = 0, y = $.length; g < y; g++) {
          let h = $[g];
          if (!h) continue;
          let k = h[0] - a,
            v = h[1] - n,
            b = h[2],
            w = h[3];
          if (k + b > c && k - b < u && v + w > m && v - w < p) {
            let x, T, z, S;
            2 * b < _
              ? (x = T = Math.floor(k / _ + 0.5) - e)
              : ((x = Math.floor((k - b) / _ + 1) - e),
                (T = Math.floor((k + b) / _ + 0) - e)),
              2 * w < _
                ? (z = S = Math.floor(v / _ + 0.5) - t)
                : ((z = Math.floor((v - w) / _ + 1) - t),
                  (S = Math.floor((v + w) / _ + 0) - t)),
              (x += i),
              (z += i),
              (T += i),
              (S += i),
              x < 0 && (x = 0),
              z < 0 && (z = 0),
              T > 2 * i && (T = 2 * i),
              S > h * i && (S = 2 * i);
            for (let P = x; P <= T; P++)
              for (let D = z; D <= S; D++) pathfind.flagCell(f, 0, P, D, 0, 1);
          }
        }
        return f;
      },
      copy: function ($) {
        let e = $.slice();
        e.osize = $.osize;
        for (let t = e.length - 1; t >= 0; t--) e[t] = e[t].slice();
        return e;
      },
    },
    dimension = {
      clipSize: 100,
      tickTime: 0.02,
      tickRate: 50,
      tickMultiplier: 2,
      power97: 0.9409,
      savedWalls: {
        m1: [
          [-1599, 1501, 1400, 1500],
          [1599, 1499, 1400, 1500],
          [149, 1399, 50, 1400],
          [-149, 1399, 50, 1400],
          [-101, 2799, 10, 200],
          [-201, 2801, 10, 200],
          [199, 2801, 10, 200],
          [99, 2801, 10, 200],
          [-1, -599, 400, 400],
        ],
        m2: [
          [6, -671, 500, 100],
          [677, 761, 50, 100],
          [12, 302, 500, 100],
          [605, -525, 100, 250],
          [611, 149, 100, 250],
          [-593, -185, 100, 585],
          [669, -191, 10, 100],
          [676, 1037, 50, 100],
          [552, -192, 10, 100],
          [1980, -1750, 400, 400],
          [1291, 1696, 700, 700],
          [-1913, -1926, 900, 900],
          [-627, 662, 1e3, 100],
          [1575, 715, 50, 100],
          [1430, 1338, 50, 100],
          [1576, 995, 50, 100],
          [-131, 1072, 500, 100],
          [157, 1680, 200, 300],
          [865, 968, 50, 100],
          [1456, 101, 500, 300],
          [419, -188, 25, 200],
          [868, 686, 50, 100],
          [1059, 760, 50, 100],
          [1059, 1041, 50, 100],
          [296, 24, 25, 100],
          [1236, 825, 50, 100],
          [1406, 925, 50, 100],
          [298, -400, 25, 100],
          [292, -193, 100, 25],
          [2377, 336, 100, 100],
          [169, -191, 25, 100],
          [93, -390, 100, 100],
          [97, 9, 100, 100],
          [47, -193, 50, 50],
          [-183, -394, 100, 100],
          [-177, 4, 100, 100],
          null,
          [-183, -193, 100, 50],
          [-442, 151, 50, 50],
          null,
          [-442, -522, 50, 50],
          [-328, -50, 50, 50],
          [-333, -341, 50, 50],
          [-790, -178, 100, 400],
          [-1038, -182, 100, 300],
          null,
          [-1297, -187, 100, 200],
          [-1564, -191, 100, 100],
          [-2806, -1126, 100, 100],
          [-3e3, -1421, 100, 100],
          [-2811, -1711, 100, 100],
          [-3003, -2e3, 100, 100],
          [-2804, -2291, 100, 100],
          [-3001, -2592, 100, 100],
          [-2594, -3003, 100, 100],
          [-2291, -2826, 100, 100],
          [-1113, -2831, 100, 100],
          [-1402, -2996, 100, 100],
          [-1685, -2823, 100, 100],
          [-1983, -2996, 100, 100],
          [-2990, -3163, 10, 10],
          [-2990, -3144, 10, 10],
          [-2990, -3122, 10, 10],
          [-2993, -3100, 10, 10],
          [-2964, -3120, 10, 10],
          null,
          [-2967, -3122, 10, 10],
          null,
          null,
          null,
          [-2945, -3122, 10, 10],
          [-2942, -3101, 10, 10],
          [-2893, -3124, 10, 10],
          [-2892, -3105, 10, 10],
          [-2894, -3163, 10, 10],
          [1162, -943, 200, 500],
          null,
          null,
          [2078, -2588, 500, 200],
          null,
          [-583, 1877, 300, 500],
          [298, -1628, 400, 600],
          [919, -902, 100, 100],
          [-1685, 1157, 500, 200],
          null,
          null,
          [-1469, 1818, 300, 200],
          [2694, -1879, 100, 500],
          [1124, 660, 500, 100],
          null,
          [520, -2690, 600, 100],
          null,
          [2197, -1026, 600, 100],
          [2492, 14, 300, 400],
          [-2802, -317, 200, 600],
          null,
          [2309, -666, 700, 100],
          [-1905, -797, 500, 100],
          [2607, 660, 400, 100],
          [2494, 1471, 500, 100],
          null,
          [2501, 2263, 200, 500],
          [-481, -2708, 400, 300],
          [2520, 1085, 300, 100],
          null,
          null,
          [-2089, 151, 300, 600],
          null,
          [1148, -2019, 200, 300],
          [-717, -2117, 300, 100],
          null,
          [-403, -1740, 300, 100],
          [-710, -1400, 300, 100],
          null,
          [293, 2282, 300, 100],
          [3085, 2455, 200, 100],
          [1689, 2699, 300, 100],
          [-2376, 2134, 300, 500],
          [-1450, 2804, 400, 200],
          [-2802, 1148, 200, 100],
          null,
          [723, 2908, 300, 100],
          [738, 2474, 300, 100],
          [-760, 2900, 300, 100],
          [-2156, 2908, 300, 100],
          [-1319, 467, 300, 100],
          [1918, 666, 100, 100],
          [-38, 2679, 200, 100],
          null,
          [-1478, 2313, 300, 100],
          [-893, 1067, 100, 100],
          [-2595, 646, 200, 100],
          [2677, -2486, 100, 100],
          [2904, -2904, 100, 100],
          [1491, 2393, 100, 100],
          [1892, 2611, 100, 100],
          [1890, 2778, 100, 100],
          [1490, 2984, 100, 100],
          [940, 2834, 100, 100],
          [942, 2536, 100, 100],
          [-35, 2788, 100, 100],
          [-37, 2591, 100, 100],
          [-19, 1950, 100, 30],
          null,
          [-148, 1880, 30, 100],
          [-153, 1478, 30, 100],
          [-279, 1406, 100, 30],
          [-253, 1685, 30, 50],
          null,
          [-74, 1684, 30, 50],
          [2571, 1655, 100, 100],
        ],
        m3: [
          [25144, 6135, 10, 10],
          [3150, -6550, 300, 900],
          [-8e3, -14e3, 7e3, 1e3],
          [8e3, -14e3, 7e3, 1e3],
          [14e3, -7e3, 1e3, 6e3],
          [8e3, 14e3, 7e3, 1e3],
          [14e3, 7e3, 1e3, 6e3],
          [-8e3, 14e3, 7e3, 1e3],
          [-14e3, 7e3, 1e3, 6e3],
          [-14e3, -7e3, 1e3, 6e3],
          [-9250, -16250, 8250, 1250],
          [9250, -16250, 8250, 1250],
          [9250, 16250, 8250, 1250],
          [-9250, 16250, 8250, 1250],
          [-16250, 8e3, 1250, 7e3],
          [-16250, -8e3, 1250, 7e3],
          [16250, -8e3, 1250, 7e3],
          [16250, 8e3, 1250, 7e3],
          [-10700, -10100, 300, 300],
          [-2200, 2200, 200, 200],
          [1300, 10700, 300, 300],
          [-8900, 10700, 300, 300],
          [2200, 2200, 200, 200],
          [10700, 10100, 300, 300],
          [10850, 5950, 150, 300],
          [10100, -10700, 300, 300],
          [-10700, -10700, 300, 300],
          [10700, -10700, 300, 300],
          [10700, 10700, 300, 300],
          [-10700, 10700, 300, 300],
          [-10100, 10400, 300, 600],
          [-10700, 8600, 300, 600],
          [-9800, 8900, 600, 300],
          [-10250, 8450, 150, 150],
          [-10700, 1300, 300, 300],
          [-1300, 10700, 300, 300],
          [-9700, 9950, 100, 150],
          [-10700, 6650, 300, 450],
          [-10700, 7250, 300, 150],
          [-10250, 7400, 150, 300],
          [-10100, 6500, 300, 300],
          [-10100, 5300, 300, 300],
          [-10550, 5300, 150, 300],
          [-10850, 4700, 150, 300],
          [-10400, 4700, 300, 300],
          [-9800, 4900, 300, 100],
          [-10100, 4100, 300, 300],
          [-10850, 3e3, 150, 800],
          [-10400, 2500, 300, 300],
          [-8750, 10100, 150, 300],
          [-8300, 10250, 300, 150],
          [-7700, 10400, 300, 600],
          [-7100, 10100, 300, 300],
          [-6500, 10850, 300, 150],
          [-5900, 10100, 300, 300],
          [-5600, 10700, 600, 300],
          [-5450, 10250, 150, 150],
          [-4400, 10400, 600, 600],
          [-3500, 10550, 300, 450],
          [-2900, 10700, 300, 300],
          [-2400, 10850, 200, 150],
          [-1600, 10100, 600, 300],
          [10700, 1300, 300, 300],
          [1450, 10100, 450, 300],
          [2500, 10700, 300, 300],
          [2500, 10100, 300, 300],
          [3700, 10100, 300, 300],
          [4300, 10400, 300, 600],
          [3100, 10850, 300, 150],
          [4e3, 9650, 150, 150],
          [3650, 9600, 200, 200],
          [5200, 10550, 600, 150],
          [6400, 10400, 600, 600],
          [5050, 10100, 150, 300],
          [5350, 10100, 150, 300],
          [7300, 10100, 300, 300],
          [8e3, 10850, 150, 150],
          [7700, 10850, 150, 150],
          [8e3, 10250, 150, 450],
          [9050, 10400, 900, 600],
          [1300, 9500, 300, 300],
          [2500, 9700, 100, 100],
          [5600, 10300, 100, 100],
          [4700, 10300, 100, 100],
          [10550, 9500, 150, 300],
          [10850, 9350, 150, 150],
          [10250, 9350, 150, 150],
          [9400, 9500, 300, 300],
          [10550, 8300, 450, 300],
          [9800, 9650, 100, 150],
          [9e3, 9700, 100, 100],
          [1e4, 8500, 100, 100],
          [10400, 7700, 300, 300],
          [1e4, 7550, 100, 450],
          [10200, 7300, 100, 100],
          [9800, 8300, 300, 100],
          [10400, 6550, 300, 300],
          [9950, 6400, 150, 150],
          [1e4, 6650, 100, 100],
          [10550, 5650, 150, 600],
          [10300, 5150, 100, 100],
          [10600, 4950, 100, 100],
          [9950, 6150, 450, 100],
          [10400, 4550, 300, 300],
          [10400, 3750, 100, 100],
          [10400, 3500, 300, 150],
          [10400, 3200, 50, 150],
          [10150, 3200, 50, 150],
          [10650, 3200, 50, 150],
          [10700, 2750, 300, 300],
          [10750, 2200, 250, 250],
          [10826, 1777, 175, 175],
          [10800, 6350, 100, 100],
          [10800, 5250, 100, 400],
          [10800, 9600, 100, 100],
          [10700, -1300, 300, 300],
          [1300, -10700, 300, 300],
          [-1300, -10700, 300, 300],
          [10050, 2150, 450, 300],
          [10400, -1900, 600, 300],
          [9950, -2500, 450, 300],
          [10100, -3100, 300, 300],
          [10850, -3100, 150, 300],
          [10500, -2300, 100, 100],
          [10900, -2700, 100, 100],
          [9400, -2300, 100, 100],
          [9700, -2900, 100, 100],
          [10800, -3550, 200, 150],
          [10050, -3550, 250, 150],
          [9950, -4e3, 150, 300],
          [10700, -4600, 300, 300],
          [10900, -4200, 100, 100],
          [10200, -4750, 200, 150],
          [10600, -5e3, 100, 100],
          [9950, -5650, 150, 450],
          [10550, -5800, 450, 300],
          [10200, -5400, 100, 100],
          [9700, -5700, 100, 400],
          [9550, -5900, 50, 200],
          [9650, -6200, 100, 100],
          [10400, -7300, 300, 300],
          [10550, -6850, 450, 150],
          [10600, -6600, 100, 100],
          [1e4, -7e3, 100, 100],
          [10800, -7100, 100, 100],
          [10850, -7800, 150, 600],
          [10450, -7850, 250, 250],
          [10600, -8200, 100, 100],
          [10350, -8300, 150, 200],
          [10700, -9300, 300, 300],
          [10300, -9300, 100, 100],
          [10300, -10300, 100, 100],
          [8900, -10400, 300, 600],
          [10100, -10200, 100, 200],
          [9900, -10050, 100, 350],
          [9700, -10400, 100, 100],
          [8300, -10700, 300, 300],
          [8400, -10200, 200, 200],
          [8500, -9900, 100, 100],
          [7900, -10250, 300, 150],
          [7900, -10500, 100, 100],
          [-2700, -10100, 100, 300],
          [-1600, -10300, 300, 100],
          [-1250, -10350, 50, 50],
          [-2500, -10700, 300, 300],
          [6900, -10700, 300, 300],
          [7300, -10800, 100, 200],
          [5200, -10800, 200, 200],
          [5700, -10700, 300, 300],
          [5900, -10300, 100, 100],
          [4700, -10700, 300, 300],
          [6600, -10300, 200, 100],
          [4150, -10750, 250, 250],
          [3700, -10800, 200, 200],
          [3350, -10850, 150, 150],
          [3100, -10900, 100, 100],
          [2700, -10700, 300, 300],
          [2300, -10700, 100, 200],
          [4500, -10300, 100, 100],
          [3400, -10600, 100, 100],
          [6100, -10900, 100, 100],
          [5500, -10300, 100, 100],
          [1300, -10300, 100, 100],
          [1500, -10100, 100, 300],
          [1700, -10100, 100, 100],
          [4200, -10300, 200, 200],
          [-1500, -10100, 100, 100],
          [-3100, -10700, 300, 300],
          [-3e3, -10200, 200, 200],
          [-3250, -10350, 50, 50],
          [-2500, -9900, 100, 100],
          [-4600, -10250, 300, 150],
          [-4300, -10700, 300, 300],
          [-4200, -10300, 100, 100],
          [-8300, -9950, 300, 150],
          [-5650, -10250, 150, 150],
          [-6e3, -10800, 200, 200],
          [-5900, -10500, 100, 100],
          [-5900, -10300, 100, 100],
          [-4700, -10500, 100, 100],
          [-5700, -10900, 100, 100],
          [-4700, -10700, 100, 100],
          [-7700, -10700, 300, 300],
          [-7400, -10200, 200, 200],
          [-6150, -10200, 150, 400],
          [-5900, -10100, 100, 100],
          [-6400, -10300, 100, 100],
          [-8900, -10400, 300, 600],
          [-8500, -10200, 100, 100],
          [-7100, -10550, 300, 150],
          [-9500, -10700, 300, 300],
          [-9500, -10200, 200, 200],
          [-10300, -10500, 100, 100],
          [-9900, -10900, 100, 100],
          [-8700, -9700, 100, 100],
          [-7100, -10300, 100, 100],
          [-10200, -1e4, 200, 200],
          [-10400, -9350, 300, 150],
          [-10400, -9050, 600, 150],
          [-1e4, -9300, 100, 100],
          [-10700, -8750, 300, 150],
          [-9950, -8750, 150, 150],
          [-10100, -8e3, 300, 300],
          [-10700, -7850, 300, 150],
          [-10500, -8100, 100, 100],
          [-10300, -8800, 100, 100],
          [-9700, -8e3, 100, 100],
          [-10700, -1300, 300, 300],
          [-10300, -7550, 400, 150],
          [-10600, -6900, 100, 100],
          [-10450, -6650, 550, 150],
          [-10400, -7100, 100, 100],
          [-10200, -7300, 100, 100],
          [-10700, -6200, 300, 300],
          [-10250, -6350, 150, 150],
          [-10300, -6100, 100, 100],
          [-10850, -5750, 150, 150],
          [-10700, -5150, 300, 150],
          [-10500, -4850, 500, 150],
          [-10300, -5100, 100, 100],
          [-10650, -4600, 350, 100],
          [-10300, -3750, 100, 300],
          [-10700, -3750, 300, 150],
          [-10100, -3950, 100, 100],
          [-10450, -3950, 50, 50],
          [-10600, -5800, 100, 100],
          [-10700, -3300, 300, 300],
          [-10700, -2300, 300, 700],
          [-10200, -3250, 200, 200],
          [-10100, -2750, 300, 300],
          [-10300, -2350, 100, 100],
          [-10350, -1850, 50, 400],
          [-10300, -1350, 100, 100],
          [2200, -2200, 200, 200],
          [-2200, -2200, 200, 200],
          [-1800, -2400, 200, 400],
          [-1500, -2300, 100, 100],
          [-2100, -2500, 100, 100],
          [-1400, -2500, 200, 100],
          [100, -2e3, 100, 200],
          [100, -2700, 300, 300],
          [100, -2300, 100, 100],
          [-300, -2700, 100, 200],
          [500, -2500, 100, 100],
          [1600, -2200, 400, 200],
          [1600, -2500, 150, 100],
          [1800, -2450, 50, 50],
          [300, -3100, 100, 100],
          [2150, -1600, 150, 400],
          [1950, -1050, 350, 150],
          [2450, -1200, 150, 150],
          [2400, -1900, 100, 100],
          [2500, -1550, 200, 200],
          [2300, 1700, 300, 300],
          [2100, 1300, 100, 100],
          [2400, 1200, 200, 200],
          [2500, 100, 200, 200],
          [2800, 700, 200, 200],
          [2150, 250, 150, 150],
          [1500, 2150, 500, 150],
          [900, 2100, 100, 100],
          [550, 2250, 250, 250],
          [1200, 2400, 100, 100],
          [1500, 2500, 200, 200],
          [-1650, 1850, 350, 350],
          [-1100, 2200, 200, 200],
          [1800, 1800, 200, 200],
          [-1200, 1900, 100, 100],
          [-1650, 2300, 100, 100],
          [-1100, 2500, 100, 100],
          [-2200, 1800, 200, 200],
          [-2100, 700, 100, 100],
          [-2400, 1e3, 400, 200],
          [-2400, 600, 200, 200],
          [-2400, 300, 100, 100],
          [-2100, -1700, 300, 300],
          [-1700, -1650, 100, 100],
          [-1500, -1650, 100, 100],
          [-2250, -1e3, 400, 400],
          [2800, 1e3, 100, 100],
          [2800, 100, 100, 100],
          [2150, 0, 100, 100],
          [-2100, -500, 100, 100],
          [-2450, -350, 250, 250],
          [-2750, -1050, 100, 100],
          [-2500, -2e3, 100, 100],
          [-2900, -350, 200, 200],
          [550, 2600, 100, 100],
          [6150, -4450, 300, 600],
          [7050, 2750, 600, 600],
          [-250, 3800, 100, 600],
          [-3800, -350, 600, 200],
          [-5100, -750, 300, 600],
          [-6500, -650, 500, 500],
          [-6100, -1250, 100, 100],
          [-6900, -50, 100, 100],
          [-7100, -1050, 100, 100],
          [-5900, -250, 100, 100],
          [-7800, -800, 600, 150],
          [-7800, 400, 100, 350],
          [-7800, -100, 150, 150],
          [-7600, 400, 100, 100],
          [-8e3, 150, 100, 100],
          [-8700, -800, 300, 300],
          [-9600, -1e3, 300, 300],
          [-9600, -600, 100, 100],
          [-9700, -400, 100, 100],
          [-9400, -500, 100, 100],
          [-9600, -1400, 100, 100],
          [-9800, -1500, 100, 100],
          [-1e4, -650, 100, 300],
          [-3900, -1900, 500, 500],
          [-6700, 600, 300, 300],
          [-6450, 1e3, 250, 100],
          [-6950, 1150, 250, 250],
          [-7150, 750, 150, 150],
          [-10250, 1150, 150, 150],
          [-8800, 1750, 750, 750],
          [-9400, 1600, 50, 300],
          [-9250, 1350, 100, 50],
          [-9250, 1850, 100, 50],
          [-9300, 1600, 50, 50],
          [-9200, 1750, 50, 50],
          [-9200, 1450, 50, 50],
          [-9050, 1600, 50, 300],
          [-8950, 1850, 50, 50],
          [-8800, 1600, 50, 300],
          [-8700, 1350, 50, 50],
          [-8700, 1550, 50, 50],
          [-8600, 1600, 50, 300],
          [-9250, 1550, 50, 50],
          [-9250, 1650, 50, 50],
          [-8450, 1600, 50, 300],
          [-8350, 1350, 50, 50],
          [-8350, 1850, 50, 50],
          [-8250, 1600, 50, 200],
          [-7900, 1750, 150, 750],
          [-8100, 1600, 50, 300],
          [-7950, 1850, 100, 50],
          [-7950, 1600, 100, 50],
          [-7950, 1350, 100, 50],
          [-6450, 1750, 750, 100],
          [-6450, 1950, 500, 100],
          [-5650, 850, 250, 250],
          [-4450, 950, 350, 350],
          [-4900, 700, 100, 100],
          [-3850, 850, 250, 250],
          [-4100, 450, 150, 150],
          [-4350, 500, 100, 100],
          [-3850, 500, 100, 100],
          [-5250, 1500, 150, 150],
          [-3900, 2150, 350, 350],
          [-4450, 2150, 200, 200],
          [-3300, 3300, 300, 300],
          [-3800, 3300, 200, 200],
          [-2500, 3700, 500, 500],
          [-3250, 3850, 250, 250],
          [-1900, 3950, 100, 100],
          [-1750, 3600, 250, 250],
          [-3500, -3500, 500, 500],
          [-450, 3650, 100, 100],
          [-50, 4150, 100, 100],
          [-4800, 3700, 300, 300],
          [-4800, 4500, 1e3, 500],
          [-5350, 3750, 250, 250],
          [-4350, 3850, 150, 150],
          [-6450, 2550, 500, 500],
          [-8900, 5900, 300, 300],
          [-8450, 5750, 150, 450],
          [-8150, 6050, 150, 350],
          [-8200, 5600, 100, 100],
          [-6800, 5900, 500, 500],
          [-7650, 5850, 100, 100],
          [-6600, 4750, 500, 250],
          [-8600, 6900, 600, 100],
          [-9200, 7300, 300, 300],
          [-8100, 7200, 800, 200],
          [-7850, 8300, 500, 350],
          [-7e3, 8550, 350, 500],
          [-7450, 8750, 100, 100],
          [-8300, 9200, 100, 100],
          [-4800, 5300, 300, 300],
          [-5200, 5400, 100, 400],
          [-4400, 5400, 100, 400],
          [-4100, 5200, 200, 200],
          [-5400, 5100, 100, 100],
          [-2650, 5350, 400, 400],
          [-2650, 5850, 700, 100],
          [-2950, 4800, 250, 150],
          [-2600, 4850, 100, 100],
          [-2150, 5650, 100, 100],
          [-5e3, 7e3, 500, 350],
          [-4e3, 7e3, 500, 250],
          [-4400, 7350, 100, 100],
          [-5400, 6550, 100, 100],
          [-5600, 6800, 100, 100],
          [-5050, 7450, 100, 100],
          [-4700, 8650, 1e3, 500],
          [-3450, 8650, 250, 250],
          [-4600, 8e3, 700, 150],
          [-4850, 9250, 700, 100],
          [-2250, 8950, 350, 300],
          [-1800, 8300, 400, 350],
          [-1700, 8850, 200, 200],
          [-2500, 8350, 300, 300],
          [-2700, 9100, 100, 100],
          [-2500, 9350, 100, 100],
          [-1400, 8750, 100, 100],
          [-2300, 7950, 100, 100],
          [-1650, 7850, 100, 100],
          [150, 8500, 1e3, 250],
          [100, 8800, 750, 50],
          [150, 7500, 100, 750],
          [-150, 7900, 200, 350],
          [-450, 8150, 100, 100],
          [-50, 7450, 100, 100],
          [550, 7950, 300, 300],
          [600, 7050, 350, 600],
          [-200, 4750, 350, 350],
          [-50, 5450, 100, 350],
          [150, 5200, 100, 100],
          [-1600, 6800, 350, 350],
          [-1600, 6350, 100, 100],
          [-1150, 6800, 100, 100],
          [-2050, 6800, 100, 100],
          [-1600, 7250, 100, 100],
          [2550, 7850, 300, 900],
          [3150, 7850, 300, 300],
          [3750, 8150, 300, 600],
          [3750, 6350, 300, 600],
          [3150, 6050, 300, 300],
          [2250, 6050, 600, 300],
          [100, 9150, 600, 300],
          [4350, 7850, 300, 300],
          [4950, 6350, 300, 600],
          [5550, 7250, 300, 1500],
          [7350, 6650, 300, 300],
          [7350, 7850, 900, 900],
          [7950, 6050, 900, 300],
          [8550, 8450, 300, 300],
          [7050, 9050, 600, 300],
          [6150, 4250, 300, 300],
          [7350, 4850, 1500, 300],
          [4050, 4850, 600, 300],
          [1650, 4850, 1200, 300],
          [2550, 4250, 300, 300],
          [750, 4250, 300, 300],
          [7350, 3650, 300, 300],
          [8550, 4250, 300, 300],
          [7950, 3050, 300, 300],
          [1950, 4250, 300, 300],
          [1950, 3650, 300, 300],
          [4950, 2450, 900, 900],
          [4350, 4250, 300, 300],
          [4950, 4850, 300, 300],
          [4650, 1250, 1200, 300],
          [6450, -250, 600, 600],
          [4350, 50, 300, 300],
          [3750, 50, 300, 300],
          [4350, -550, 300, 300],
          [5550, -250, 300, 600],
          [8850, 1550, 600, 600],
          [8250, 650, 600, 300],
          [6750, 1850, 300, 300],
          [7950, -550, 300, 300],
          [8250, -1150, 600, 300],
          [6150, -1150, 300, 300],
          [8550, -1750, 300, 300],
          [7050, -2350, 600, 300],
          [3750, -1750, 300, 300],
          [4650, -1750, 600, 300],
          [6150, -2950, 900, 300],
          [3750, -2350, 300, 300],
          [6750, -3550, 300, 300],
          [8550, -3550, 300, 900],
          [7950, -3850, 300, 600],
          [4950, -3850, 300, 600],
          [3750, -3550, 300, 300],
          [8250, -5950, 600, 900],
          [6150, -7150, 300, 300],
          [6450, -6250, 600, 600],
          [3750, -4750, 300, 300],
          [4650, -5950, 600, 300],
          [7950, -8350, 900, 900],
          [6150, -8650, 300, 600],
          [4650, -8050, 600, 1200],
          [3150, -8650, 900, 600],
          [2550, -4150, 300, 900],
          [3150, -2350, 300, 300],
          [1950, -5950, 300, 300],
          [1650, -6550, 600, 300],
          [1950, -7150, 900, 300],
          [1350, -8650, 300, 600],
          [1650, -3550, 600, 300],
          [1950, -4150, 300, 300],
          [-2850, -7150, 300, 300],
          [-1950, -8650, 600, 600],
          [-1650, -7450, 300, 600],
          [-4050, -8950, 900, 300],
          [-1950, -5950, 600, 300],
          [-3450, -8350, 300, 300],
          [-1950, -3850, 600, 600],
          [-2850, -5650, 300, 600],
          [-4050, -7450, 900, 600],
          [-3750, -5350, 600, 300],
          [-4650, -6550, 300, 300],
          [-6450, -7150, 300, 300],
          [-6150, -8650, 600, 600],
          [-5250, -6550, 300, 300],
          [-7600, -4750, 1500, 1500],
          [-8500, -6850, 600, 600],
          [-7600, -7150, 300, 300],
          [-8800, -8350, 300, 900],
          [-7350, -8950, 600, 300],
          [-7e3, -2950, 900, 300],
          [-5500, -2650, 600, 600],
          [-3700, -4300, 300, 300],
          [-4600, -4300, 600, 300],
          [-4650, -5350, 300, 300],
          [-8200, -2350, 900, 300],
          [-7e3, -2050, 300, 600],
        ],
        m4: [
          [-2299, -2299, 100, 100],
          [-1401, -2299, 800, 100],
          [-2299, -1399, 100, 800],
          [-2301, 2301, 100, 100],
          [-1401, 2301, 800, 100],
          [-2301, 1401, 100, 800],
          [2299, 2301, 100, 100],
          [1399, 2301, 800, 100],
          [2299, 1399, 100, 800],
          [2301, -2301, 100, 100],
          [2301, -1399, 100, 800],
          [1399, -2301, 800, 100],
        ],
        m5: [
          [-6150, -6300, 1200, 150],
          [-6900, -4500, 450, 150],
          [-6750, -3600, 600, 150],
          [-7050, -1500, 300, 150],
          [-7050, 1800, 300, 150],
          [-7050, 2700, 300, 150],
          [-6450, 7200, 900, 150],
          [-6e3, 6300, 750, 150],
          [-6e3, -3900, 450, 150],
          [-5700, 1500, 750, 150],
          [-5850, 2100, 600, 150],
          [-6150, 5700, 300, 150],
          [-5700, -6900, 450, 150],
          [-5700, 0, 450, 150],
          [-5850, 3300, 300, 150],
          [-5550, -4200, 300, 150],
          [-4950, -3300, 300, 150],
          [-4950, 6900, 300, 150],
          [-4500, -2100, 450, 150],
          [-4650, -1500, 300, 150],
          [-3900, 2100, 1050, 150],
          [-4650, 2700, 300, 150],
          [-4650, 6600, 300, 150],
          [-4350, -6e3, 300, 150],
          [-4200, -3600, 450, 150],
          [-4050, -6900, 300, 150],
          [-4050, -900, 300, 150],
          [-4050, 300, 300, 150],
          [-3600, 6900, 750, 150],
          [-3150, -3e3, 900, 150],
          [-3750, 1500, 300, 150],
          [-3450, -6600, 300, 150],
          [-2550, -6e3, 1200, 150],
          [-3450, -2400, 300, 150],
          [-3450, 3300, 300, 150],
          [-2850, -6900, 600, 150],
          [-2850, -4500, 600, 150],
          [-3e3, -1200, 450, 150],
          [-3e3, 4200, 450, 150],
          [-2850, 4800, 300, 150],
          [-2550, -5100, 300, 150],
          [-2550, -3600, 300, 150],
          [-2550, 0, 300, 150],
          [-2550, 1500, 300, 150],
          [-2100, 3300, 750, 150],
          [-1200, -7200, 750, 150],
          [-1650, -5400, 300, 150],
          [-1500, -4500, 450, 150],
          [-1200, 6e3, 750, 150],
          [-300, -5700, 1350, 150],
          [-1350, -2700, 300, 150],
          [-1350, -2100, 300, 150],
          [-1200, 1200, 450, 150],
          [-1200, 3e3, 450, 150],
          [-1350, 4200, 300, 150],
          [-1200, 4800, 450, 150],
          [-750, 2700, 300, 150],
          [-750, 3300, 300, 150],
          [150, -4500, 900, 150],
          [150, 5700, 900, 150],
          [300, -2700, 750, 150],
          [150, -3900, 300, 150],
          [150, 900, 300, 150],
          [300, 2700, 450, 150],
          [1200, -3300, 1050, 150],
          [450, 4200, 300, 150],
          [1050, -5100, 600, 150],
          [1050, 5400, 300, 150],
          [2250, 6600, 1500, 150],
          [1500, 300, 450, 150],
          [2250, 900, 1200, 150],
          [1350, 4200, 300, 150],
          [1350, 4800, 300, 150],
          [1650, -6300, 300, 150],
          [2100, -4200, 750, 150],
          [1950, 6e3, 600, 150],
          [2100, -5700, 450, 150],
          [2700, 3e3, 1050, 150],
          [1950, 5400, 300, 150],
          [2550, -3e3, 600, 150],
          [2250, 1800, 300, 150],
          [2550, -6e3, 300, 150],
          [2550, 0, 300, 150],
          [3e3, 2400, 750, 150],
          [3450, 4800, 900, 150],
          [3150, -2100, 300, 150],
          [3300, -900, 450, 150],
          [3150, 5700, 300, 150],
          [3450, -5700, 300, 150],
          [3450, 600, 300, 150],
          [3900, 1800, 450, 150],
          [4200, -3300, 450, 150],
          [4200, 6e3, 450, 150],
          [4650, -5400, 600, 150],
          [4350, -2700, 300, 150],
          [4650, 2100, 600, 150],
          [4800, -4800, 450, 150],
          [4950, 1200, 600, 150],
          [4800, 4200, 450, 150],
          [4950, 5400, 600, 150],
          [6e3, -2400, 1350, 150],
          [4950, 3e3, 300, 150],
          [5400, -6600, 450, 150],
          [5550, 2700, 600, 150],
          [5700, -7200, 450, 150],
          [5550, -3e3, 300, 150],
          [5700, 900, 450, 150],
          [5850, 5700, 600, 150],
          [5850, -5700, 300, 150],
          [6300, -1800, 750, 150],
          [6450, 3300, 900, 150],
          [5850, 3900, 300, 150],
          [6150, 1200, 300, 150],
          [6300, 2400, 450, 150],
          [6150, 6900, 300, 150],
          [6750, 5100, 300, 150],
          [-7200, -7200, 150, 150],
          [-4800, -7200, 150, 150],
          [-2400, -7200, 150, 150],
          [1800, -6900, 150, 450],
          [7200, -6900, 150, 450],
          [-1800, -6750, 150, 300],
          [-1200, -6600, 150, 450],
          [5400, -6900, 150, 150],
          [-2400, -6450, 150, 300],
          [4200, -6300, 150, 450],
          [-600, -6e3, 150, 150],
          [300, -6e3, 150, 150],
          [1800, -6e3, 150, 150],
          [3300, -6e3, 150, 150],
          [-5700, -5700, 150, 150],
          [-5100, -5700, 150, 150],
          [5100, -5700, 150, 150],
          [-6300, -5400, 150, 150],
          [-3900, -4950, 150, 600],
          [-3300, -5100, 150, 450],
          [1800, -5400, 150, 150],
          [2700, -5250, 150, 300],
          [3300, -4350, 150, 1200],
          [6900, -5400, 150, 150],
          [-5700, -5100, 150, 150],
          [-5100, -5100, 150, 150],
          [-1800, -4950, 150, 300],
          [-600, -5100, 150, 150],
          [5700, -4950, 150, 300],
          [-2700, -4800, 150, 150],
          [1800, -4800, 150, 150],
          [3900, -4800, 150, 150],
          [6900, -4800, 150, 150],
          [2700, -4500, 150, 150],
          [-6900, -4200, 150, 150],
          [-3300, -3900, 150, 450],
          [-1800, -4050, 150, 300],
          [0, -4200, 150, 150],
          [4200, -4200, 150, 150],
          [5700, -4200, 150, 150],
          [-3900, -3900, 150, 150],
          [900, -3900, 150, 150],
          [1800, -3900, 150, 150],
          [2700, -3600, 150, 450],
          [-1200, -3300, 150, 450],
          [-600, -3600, 150, 150],
          [300, -3600, 150, 150],
          [4200, -3600, 150, 150],
          [-3600, -3300, 150, 150],
          [-7200, -2700, 150, 450],
          [-4800, -2700, 150, 450],
          [-1800, -3e3, 150, 150],
          [300, -3e3, 150, 150],
          [4500, -3e3, 150, 150],
          [6300, -3e3, 150, 150],
          [6900, -2850, 150, 300],
          [-2700, -2100, 150, 750],
          [2700, -2550, 150, 300],
          [-1500, -2400, 150, 150],
          [900, -2400, 150, 150],
          [4200, -900, 150, 1650],
          [-6900, -1950, 150, 300],
          [-3600, -1800, 150, 450],
          [5100, -2100, 150, 150],
          [-4800, -1800, 150, 150],
          [300, -1800, 150, 150],
          [3e3, -1650, 150, 300],
          [-900, -1500, 150, 150],
          [2400, -900, 150, 750],
          [3600, -1350, 150, 300],
          [6900, -1500, 150, 150],
          [-6900, -1200, 150, 150],
          [-4800, -600, 150, 750],
          [-2700, -600, 150, 450],
          [-2100, -900, 150, 150],
          [1500, -900, 150, 150],
          [4800, -900, 150, 150],
          [5400, -900, 150, 150],
          [-4200, -450, 150, 300],
          [6600, -600, 150, 150],
          [6300, 150, 150, 600],
          [5400, 300, 150, 450],
          [-6600, 300, 150, 150],
          [2700, 450, 150, 300],
          [3600, 300, 150, 150],
          [-6e3, 600, 150, 150],
          [-5400, 750, 150, 300],
          [-3900, 900, 150, 450],
          [4800, 600, 150, 150],
          [7200, 750, 150, 300],
          [-4500, 1200, 150, 450],
          [-3300, 900, 150, 150],
          [-2400, 1050, 150, 300],
          [4500, 900, 150, 150],
          [-5100, 1200, 150, 150],
          [2400, 1350, 150, 300],
          [3300, 1200, 150, 150],
          [3900, 1350, 150, 300],
          [-6900, 1500, 150, 150],
          [-1500, 1500, 150, 150],
          [-900, 1500, 150, 150],
          [600, 1500, 150, 150],
          [4500, 1500, 150, 150],
          [6e3, 1650, 150, 300],
          [6600, 1800, 150, 450],
          [-5400, 1800, 150, 150],
          [-3900, 1800, 150, 150],
          [-2400, 2100, 150, 450],
          [1200, 1800, 150, 150],
          [5100, 1800, 150, 150],
          [600, 2250, 150, 300],
          [1800, 2100, 150, 150],
          [-6e3, 2700, 150, 450],
          [-900, 2400, 150, 150],
          [1200, 3e3, 150, 750],
          [4200, 2700, 150, 450],
          [-5400, 2700, 150, 150],
          [-1500, 2700, 150, 150],
          [1800, 2700, 150, 150],
          [6600, 2700, 150, 150],
          [600, 3e3, 150, 150],
          [7200, 3e3, 150, 150],
          [3600, 3450, 150, 300],
          [-6e3, 3600, 150, 150],
          [-4200, 3600, 150, 150],
          [-3300, 3750, 150, 300],
          [-2400, 3750, 150, 300],
          [0, 3600, 150, 150],
          [600, 3600, 150, 150],
          [3e3, 4050, 150, 600],
          [5700, 3600, 150, 150],
          [-1200, 3900, 150, 150],
          [1500, 3900, 150, 150],
          [2400, 3900, 150, 150],
          [6e3, 4800, 150, 750],
          [6600, 4500, 150, 450],
          [-5700, 4500, 150, 150],
          [-5100, 4500, 150, 150],
          [-3600, 5400, 150, 1050],
          [-2700, 4500, 150, 150],
          [1200, 4500, 150, 150],
          [2100, 4500, 150, 150],
          [4800, 4500, 150, 150],
          [7200, 4650, 150, 300],
          [-5700, 5100, 150, 150],
          [-5100, 5100, 150, 150],
          [-3e3, 5700, 150, 750],
          [-2400, 5400, 150, 450],
          [-1500, 5550, 150, 300],
          [3900, 5550, 150, 300],
          [6900, 5550, 150, 300],
          [-5400, 5850, 150, 300],
          [4500, 5700, 150, 150],
          [-4800, 6150, 150, 300],
          [300, 6300, 150, 450],
          [900, 6150, 150, 300],
          [3e3, 6150, 150, 300],
          [5400, 6600, 150, 750],
          [6300, 6300, 150, 450],
          [-1800, 6750, 150, 600],
          [-1200, 6300, 150, 150],
          [-600, 6300, 150, 150],
          [2400, 6300, 150, 150],
          [4500, 6600, 150, 450],
          [-6600, 6750, 150, 300],
          [-3900, 6600, 150, 150],
          [0, 6900, 150, 150],
          [900, 7050, 150, 300],
          [-4800, 7200, 150, 150],
          [3900, 7200, 150, 150],
          [6300, 7200, 150, 150],
          [8650, 4925, 1e3, 4725],
          [8650, -4925, 1e3, 4725],
          [-8650, 4925, 1e3, 4725],
          [-8650, -4925, 1e3, 4725],
          [3925, 8650, 3725, 1e3],
          [3925, -8650, 3725, 1e3],
          [-3925, 8650, 3725, 1e3],
          [-3925, -8650, 3725, 1e3],
        ],
        m6: [
          [0, 0, 500, 500, 8],
          [0, 0, 750, 750, 8],
          [-850, -100, 100, 850],
          [850, -100, 100, 850],
          [-450, -850, 300, 100],
          [450, -850, 300, 100],
          [-750, 850, 200, 100],
          [750, 850, 200, 100],
          [0, 850, 350, 100],
          [0, 1450, 350, 500],
          [-1250, 1350, 100, 600],
          [1250, 1350, 100, 600],
          [750, 1850, 400, 100],
          [-750, 1850, 400, 100],
          [1850, 450, 700, 100],
          [2450, 1250, 100, 700],
          [1850, 1850, 500, 100],
          [-1850, 1850, 500, 100],
          [-2450, 1150, 100, 800],
          [-1750, 450, 600, 100],
          [-1750, 450, 600, 100, 7],
          [-1850, 1850, 500, 100, 7],
          [-2450, 1150, 100, 800, 7],
          [-2450, 1150, 100, 800, 7],
          [1450, 900, 100, 10, 2],
          [1450, 1100, 100, 10, 2],
          [1550, 1e3, 10, 100, 2],
          [1450, 1150, 100, 10, 2],
          [1650, 600, 10, 50, 5],
          [2050, 600, 10, 50, 5],
          [1850, 650, 200, 10, 5],
          [1850, 1550, 500, 10, 2],
          [1450, 1350, 100, 10, 2],
          [1850, 1650, 10, 100, 2],
          [2100, 1650, 10, 100, 2],
          [1600, 1650, 10, 100, 2],
          [1250, 650, 100, 100, 8],
          [1550, 1250, 10, 100, 2],
          [2250, 900, 100, 10, 2],
          [2150, 1e3, 10, 100, 2],
          [2250, 1100, 100, 10, 2],
          [2150, 1250, 10, 100, 2],
          [-1250, 650, 100, 150, 8],
          [1850, 250, 700, 100, 0],
          [2450, -400, 100, 550, 0],
          [1750, -850, 600, 100, 0],
          [1250, -400, 100, 350, 0],
          [1250, 50, 100, 100, 8],
          [2200, -300, 10, 200, 5],
          [-2350, 450, 100, 100],
          [-2350, 1850, 100, 100],
          [-1350, 1850, 100, 100],
          [500, 0, 10, 500],
          [-500, 0, 10, 500],
          [-300, 500, 200, 10],
          [-300, -500, 200, 10],
          [300, -500, 200, 10],
          [-1850, 250, 700, 100, 0],
          [-2450, -400, 100, 550],
          [-765, 984, 10, 10],
          [-1750, -850, 600, 100],
          [-1250, -400, 100, 350],
          [-1250, 50, 100, 100, 8],
          [-810, 989, 10, 10],
          [-788, 1012, 10, 10],
          [-1800, -300, 450, 450, 8],
          [-768, 1652, 25, 100],
          [-643, 1577, 100, 25],
          [-518, 1652, 25, 100],
          [-1750, -700, 50, 10],
          [-1500, -450, 10, 50],
          [-1500, -250, 10, 50],
          [-1550, -400, 50, 10],
          [-1550, -500, 50, 10],
          [-1550, -300, 50, 10],
          [-1550, -200, 50, 10],
          [-2250, -300, 10, 200, 5],
          [-2300, -100, 50, 10, 5],
          [-2300, -500, 50, 10, 5],
          [-1900, 100, 200, 50],
          [-1900, 100, 200, 50],
          [-1900, 100, 200, 50],
          [-2300, 50, 50, 150, 8],
          [-2300, -650, 50, 150, 8],
          [-1950, -700, 50, 10],
          [-1700, -650, 10, 50],
          [-1800, -650, 10, 50],
          [-850, -1950, 100, 500, 8],
          [-1900, -650, 10, 50],
          [-2e3, -650, 10, 50],
          [850, -1950, 100, 500, 8],
          [0, -2550, 950, 100, 8],
          [-1850, -300, 100, 200],
          [0, -1350, 950, 100, 8],
          [-1850, -300, 80, 180],
          [550, -1950, 20, 200, 2],
          [-550, -1950, 20, 200, 2],
          [-650, -1650, 100, 10],
          [-650, -2250, 100, 10],
          [-750, -1950, 10, 300],
          [750, -1950, 10, 300],
          [650, -1650, 100, 10],
          [650, -2250, 100, 10],
          [650, -1950, 100, 300, 8],
          [300, 500, 200, 10],
          [100, 550, 10, 50],
          [-100, 550, 10, 50],
          [-100, -550, 10, 50],
          [-650, -1950, 100, 300, 8],
          [100, -550, 10, 50],
          [2500, 2850, 10, 200, 2],
          [-2e3, 2300, 1e3, 100],
          [-1200, 2600, 100, 200],
          [2500, -2100, 500, 100],
          [-1600, 2600, 100, 200],
          [-1950, 2800, 100, 200],
          [-2700, 2600, 100, 200],
          [2100, -2600, 100, 400],
          [2450, -2900, 250, 100],
          [2850, 2650, 200, 10, 1],
          [-2350, 2800, 100, 200],
          [-1400, 2800, 300, 10],
          [-2150, 2600, 300, 10],
          [-2850, 2800, 225, 10],
          [-2e3, 2600, 1e3, 400, 3],
          [-1600, 2400, 10, 50],
          [-1200, 2400, 10, 50],
          [-1950, 3e3, 10, 50],
          [-2350, 3e3, 10, 50],
          [-2700, 2400, 10, 50],
          [-3e3, 2300, 50, 10],
          [2250, 1350, 100, 10, 2],
          [2250, 1150, 100, 10, 2],
          [1750, 600, 10, 50],
          [1950, 600, 10, 50],
          [2300, -500, 100, 10, 5],
          [2300, -100, 100, 10, 5],
          [2336, -323, 50, 10],
          [2100, 50, 10, 100, 1],
          [2e3, -50, 100, 10, 1],
          [1700, -50, 100, 10, 1],
          [1600, 50, 10, 100, 1],
          [1800, 50, 10, 100, 1],
          [1900, 50, 10, 100, 1],
          [1600, -650, 10, 100, 1],
          [1800, -650, 10, 100, 1],
          [1900, -650, 10, 100, 1],
          [2100, -650, 10, 100, 1],
          [2e3, -550, 100, 10, 1],
          [1700, -550, 100, 10, 1],
          [3e3, 2900, 100, 10, 5],
          [2900, 3e3, 10, 100, 7],
          [2750, -2300, 250, 100],
          null,
          null,
          [2850, 2750, 200, 10, 4],
          [2650, 2700, 10, 50, 3],
          [2450, 2800, 50, 10, 6],
          [2850, 2700, 10, 50, 8],
          [2400, 2900, 10, 250, 9],
          [2450, 2650, 50, 10],
          [2800, 2350, 10, 100],
          [2900, 2250, 100, 10],
          [2900, 2450, 100, 10],
          [2700, 2250, 100, 10],
          [2600, 2350, 10, 100],
          [2700, 2450, 100, 10],
        ],
      },
      saveWalls: function ($, e) {
        if (!e || e.length <= 0) return "Failed: Invalid name";
        let t = $.walls.slice($.defaultWalls);
        return t.length > 0
          ? ((dimension.savedWalls[e] = JSON.parse(JSON.stringify(t))),
            `Success: saved as ${e}`)
          : "Failed: No walls to save";
      },
      loadWalls: function ($, e, t) {
        if (!e) return "Failed: Invalid name";
        let a = t ? e : dimension.savedWalls[e];
        if (!a) return "Failed: Invalid name";
        a = JSON.parse(JSON.stringify(a));
        let n = $.walls.length;
        if (n > $.defaultWalls) {
          for (let i = $.defaultWalls; i < n; i++) $.removedWalls[i] = i;
          $.walls = $.walls.slice(0, $.defaultWalls);
        }
        n = $.walls.length;
        for (let _ = 0, s = a.length; _ < s; _++)
          $.walls.push(a[_]),
            delete $.removedWalls[n],
            ($.updatedWalls[n] = a[_]),
            n++;
        return `Success: Loaded ${a.length} walls`;
      },
      antilag: function () {
        for (let $ in dimension.dims) {
          let e = dimension.dims[$],
            t = e.tanks;
          for (let a = t.length - 1; a >= 0; a--) {
            let n = t[a];
            n.static || n.ws.data.isPlayer || n.remove();
          }
          for (let i = e.tanks.length - 1; i >= 0; i--)
            e.tanks[i].removeBullets();
          for (let _ = e.polygons.length - 1; _ >= 0; _--)
            e.polygons[_].remove();
        }
      },
      antibot: function () {
        for (let $ in dimension.dims) {
          let e = dimension.dims[$].tanks;
          for (let t = e.length - 1; t >= 0; t--) {
            let a = e[t];
            !a.static &&
              a.ws.data.isPlayer &&
              a.score < 1e4 &&
              (a.remove(), a.ws.close());
          }
        }
      },
      findClosestTank: function ($, e, t) {
        let a = !1,
          n = !1;
        for (let i = t.length - 1; i >= 0; i--) {
          let _ = t[i],
            s = _.x - $,
            o = _.y - e,
            r = s * s + o * o;
          (r < a || !1 === a) && ((a = r), (n = _));
        }
        return [a, n];
      },
      getSpawnPosition: function ($, e, t) {
        for (let a = 0; a < t; a++) {
          let n = $();
          if (e(n)) return n;
        }
        return $();
      },
      sendTankTo: function ($) {
        if (!$.tank.alive) return;
        $.tank.alive = !1;
        let e = $.dim;
        $.dim = dimension.dims[e];
        let t = {
          weaponCameraSize: 1,
          bodyCameraSize: 1,
          dim: $.dim,
          ai: $.tank.aiInput,
          aiRam: $.tank.aiRam,
          polygon: $.tank.polygon,
          invisible: $.tank.invisible,
          noKillNotification: $.tank.noKillNotification,
          forceDeathScore: $.tank.forceDeathScore,
          x: $.x || 0,
          y: $.y || 0,
          d: $.tank.d,
          upgrades: $.tank.upgrades,
          upgradeCount: $.tank.upgradeCount,
          radiant: $.tank.radiant,
          name: $.tank.name,
          team: $.tank.team,
          score: $.tank.score,
          weapon: $.tank.weapon,
          body: $.tank.body,
          passive: $.tank.passive,
        };
        if (($.tank.team && ($.tank.ws.data.lastTeam = $.tank.team), $.dim))
          $.dim.newTanks.push([t, $.tank.ws, $.tank.dim.name]),
            $.tank.remove(!0);
        else if (!dimension.isolate || $.override) {
          if ($.tank.ws.data.isPlayer) {
            if ($.tank.ws.data.uid >= 0) {
              if (
                (delete t.aiRam,
                delete t.ai,
                delete t.dim,
                (t.commands = $.tank.ws.data.commands),
                $.tank.ws.accountData)
              ) {
                let a = Math.floor(
                  (_performance.now() - $.tank.ws.timeStart) / 1e3
                );
                $.tank.ws.accountData.timeAlive += a;
              }
              args.parentPort.postMessage([
                "send",
                [
                  $.tank.ws.data.uid,
                  e,
                  [t, $.tank.dim.name],
                  $.tank.ws.accountData,
                  !!$.tank.ws.accountNameParsed &&
                    $.tank.ws.accountNameParsed.toLowerCase(),
                ],
              ]);
            }
          } else
            ("string" != typeof $.tank.ai && $.tank.ai) ||
              (delete t.dim,
              (t.commands = {}),
              args.parentPort.postMessage([
                "sendBot",
                [e, [t, $.tank.dim.name]],
              ]));
          $.tank.remove(!0);
        }
      },
      getBulletSpeed: function ($, e) {
        let t = 4.5 * $.speed * (1 + e.upgrades[1] / 30);
        return (
          1 === $.type || 3 === $.type
            ? (t *= 1.5)
            : (2 === $.type || 4 === $.type) &&
              (t = 2.3 * $.speed * (1 + e.upgrades[1] / 60)),
          t
        );
      },
      getBulletData: function ($, e) {
        let t = 1,
          a = 1;
        return (
          0 === $
            ? ((a = 1.5), (t = 100))
            : 1 === $
            ? ((a = 12), (t = 800))
            : 2 === $
            ? ((a = 0), (t = 100))
            : 3 === $
            ? ((a = 12), (t = 800))
            : 4 === $ && ((a = 0), (t = 100)),
          [a, (t /= 1 + e.upgrades[1] / 30)]
        );
      },
      aimAtTarget: function ($, e, t) {
        t *= 2;
        let a = e.x - $.x,
          n = e.y - $.y,
          i = e.xv * e.xv + e.yv * e.yv - t * t,
          _ = 2 * (a * e.xv + n * e.yv),
          s = _ * _ - 4 * i * (a * a + n * n);
        if (!(s > 0)) return [a, n];
        {
          let o = Math.sqrt(s),
            r = [(-_ + o) / (2 * i), (-_ - o) / (2 * i)];
          if (r[0] > 0 && r[1] > 0) r = r[0] < r[1] ? r[0] : r[1];
          else if (r[0] > 0) r = r[0];
          else {
            if (!(r[1] > 0)) return [a, n];
            r = r[1];
          }
          let d;
          return [a + r * e.xv, n + r * e.yv];
        }
      },
      wallRestitution: 0.1,
      averageAngles: function ($, e, t) {
        let a = 2 * Math.PI;
        $ = (($ % a) + a) % a;
        let n = (a + e - $) % a;
        return n > Math.PI
          ? ((($ + (n - a) / (t + 1)) % a) + a) % a
          : ((($ + n / (t + 1)) % a) + a) % a;
      },
      confine: function ($, e, t) {
        $.x < -e
          ? (($.x = -e),
            ($.xv = Math.abs($.xv * dimension.wallRestitution) + t))
          : $.x > e &&
            (($.x = e),
            ($.xv = -Math.abs($.xv * dimension.wallRestitution) - t)),
          $.y < -e
            ? (($.y = -e),
              ($.yv = Math.abs($.yv * dimension.wallRestitution) + t))
            : $.y > e &&
              (($.y = e),
              ($.yv = -Math.abs($.yv * dimension.wallRestitution) - t));
      },
      getRadiantMultiplier: function ($) {
        return $ <= 0
          ? 1
          : $ <= 1
          ? 1 === $
            ? 25
            : Math.pow(25, $)
          : 25 * Math.pow(4, $ - 1);
      },
      dims: {},
      isSameTeam: function ($, e) {
        return (
          $ &&
          e &&
          ($ === e ||
            ($.team && $.team === e.team) ||
            ($.parent && ($.parent === e.parent || $.parent === e)) ||
            (e.parent && e.parent === $))
        );
      },
      isolate: !1,
      create: function ($) {
        if (!($.name in dimension.dims)) {
          let e = $.darkness > 0 ? Math.round(100 * $.darkness) : 0,
            t = $.maxPolygonCount || 0;
          args.lessPolygons && (t *= 0.1),
            logEvent("createDim", `name:${$.name}`);
          let a = tankData.weapons,
            n = tankData.bodies;
          $.customWeapons && (a = { ...a, ...$.customWeapons }),
            $.customBodies && (n = { ...n, ...$.customBodies });
          let i = {
            playerCount: function () {
              let $ = 0;
              for (let e = i.tanks.length - 1; e >= 0; e--) {
                let t = i.tanks[e];
                t.ws && t.ws.data && t.ws.data.isPlayer && $++;
              }
              return $;
            },
            dt: 0,
            tickTime: 0,
            weapons: a,
            bodies: n,
            customWeapons: $.customWeapons || {},
            customBodies: $.customBodies || {},
            isMain: $.isMain || !1,
            sizeScale: $.sizeScale >= 0 ? $.sizeScale : 1.01,
            entryMessage: $.entryMessage || !1,
            exitMessage: $.exitMessage || !1,
            ambientParticles: $.ambientParticles || [],
            sandbox: !!$.sandbox,
            noPolygons: !!$.noPolygons,
            forceRespawnScore: $.forceRespawnScore,
            removeFallens: !!$.removeFallens,
            autoScale: $.autoScale || !1,
            allowScale: !!$.allowScale,
            onDeath: $.onDeath || function () {},
            onChat: $.onChat || function () {},
            onUpdate: $.onUpdate || function () {},
            freeJoin: !!$.freeJoin,
            fillWalls: !!$.fillWalls,
            displayName: $.displayName || "",
            displayColor: $.displayColor || 0,
            displayRadiant: $.displayRadiant || 0,
            friction: !0,
            nextSpawnPolyhedra: !1,
            lastPolyhedra: 0,
            mapSize: $.mapSize || 100,
            _mapSize: 0,
            mapSizeSpeed: 0,
            lastMapSize: $.mapSize || 100,
            gridSize: $.gridSize || 30,
            background: $.background,
            grid: $.grid,
            maxPolygonSides: $.maxPolygonSides || 0,
            _maxPolygonSides: $.maxPolygonSides || 0,
            maxPolygonCount: t,
            _maxPolygonCount: t,
            name: $.name,
            tanks: [],
            type: $.type || "ffa",
            ids: { tank: [], bullet: [], polygon: [], wormhole: [] },
            spawnPlayer:
              $.spawnPlayer ||
              function () {
                return [0, 0];
              },
            spawnPolygon: $.spawnPolygon || !1,
            newTanks: [],
            darkness: e,
            darknessUpdated: !1,
            setDarkness: function ($) {
              let e = $ > 0 ? Math.round(100 * $) : 0;
              e > 100 && (e = 100),
                e !== i.darkness &&
                  ((i.darkness = e), (i.darknessUpdated = !0));
            },
            resizedWormholes: {},
            rupturedWormholes: {},
            fadeTimeChanges: {},
            removedWormholes: {},
            addedWormholes: {},
            updatedTanks: {},
            updatedGates: {},
            updatedPortals: {},
            updatedWalls: {},
            removedWalls: {},
            bullets: [],
            polygons: [],
            bases: [],
            walls: $.walls || [],
            defaultWalls: 0,
            gates: $.gates || [],
            wormholes: {},
            chatMessages: {},
            leaderboard: [],
            leaderboardChanges: {},
            remove: function () {
              if (dimension.dims[i.name] === i) {
                for (let $ = 0, e = i.tanks.length; $ < e; $++) {
                  let t = i.tanks[$];
                  (t.ws.data.respawnScore = 0),
                    t.ws.data.isPlayer &&
                      (t.ws.data.uid >= 0 || args.standalone) &&
                      (args.standalone
                        ? t.ws.sendPacket("death", [[], 0])
                        : ((t.ws.data.ready = !1),
                          args.parentPort.postMessage([
                            "death",
                            [t.ws.data.uid, 0, [[], 0], t.ws.data.lastTeam],
                          ])));
                }
                clearInterval(i.intervalId), delete dimension.dims[i.name];
              }
            },
            add: function ($, e) {
              let t = i[$];
              0 > t.indexOf(e) && t.push(e);
            },
            delete: function ($, e) {
              let t = i[$],
                a = t.indexOf(e);
              a >= 0 && t.splice(a, 1);
            },
            broadcast: function ($) {
              for (let e = i.tanks.length - 1; e >= 0; e--) {
                let t = i.tanks[e];
                t.ws && t.ws.sendPacket && t.ws.sendPacket("announcement", $);
              }
            },
          };
          if (
            ((i.defaultWalls = i.walls.length),
            "ffa" === i.name || "4teams--" === i.name || "2teams" === i.name)
          ) {
            let _ = function () {
              let $ = Math.floor(4 * Math.pow(Math.random(), 2)),
                e = `crasher${$ + 3}-0`,
                t = 0;
              if (4096 * Math.random() < 1)
                for (t++; 9 * Math.random() < 1; ) t++;
              generator.tank({
                dim: i,
                x: (1 - 2 * Math.random()) * (i.mapSize - 2e3),
                y: (1 - 2 * Math.random()) * (i.mapSize - 2e3),
                name:
                  "an Awakened " +
                  ["Triangle", "Square", "Pentagon", "Hexagon"][$],
                weapon: e,
                body: e,
                noKillNotification: !0,
                score: 5250 * Math.pow(4, $),
                radiant: t,
                team: 5,
                ai: "fallen",
                aiRam: !0,
                invincible: !1,
                onDeath: function () {
                  setTimeout(_, 6e4 + 6e4 * Math.random());
                },
                polygon: !0,
              });
            };
            for (let s = 0; s < 10; s++)
              setTimeout(_, 6e4 + 6e4 * Math.random());
            let o = !1,
              r = function () {
                let $ = 1 + Math.floor(3 * Math.pow(Math.random(), 4)),
                  e = (1 - 2 * Math.random()) * (i.mapSize - 2e3),
                  t = (1 - 2 * Math.random()) * (i.mapSize - 2e3);
                generator.wormhole({
                  x: e,
                  y: t,
                  size: 175,
                  type: 1,
                  time: 300,
                  dim: i,
                  ruptured: !1,
                  action: function ($) {
                    dimension.sendTankTo({ tank: $, dim: "abyssHallway" });
                  },
                });
                let a = generator.tank({
                    dim: i,
                    x: e,
                    y: t,
                    name: "Peacekeeper",
                    weapon: "peacekeeper" + $,
                    body: "peacekeeper" + $,
                    score: 1e6 * Math.pow(5, $),
                    forceDeathScore: 1e6 * Math.pow(5, $),
                    radiant: 1,
                    team: 8,
                    ai: "peacekeeper",
                    invincible: !1,
                  }),
                  n = 2 * Math.PI * Math.random();
                return (
                  (a.xv = 15 * Math.sin(n)),
                  (a.yv = 15 * Math.cos(n)),
                  (a.d = -n),
                  a
                );
              };
            setTimeout(function () {
              (o = r()),
                setInterval(function () {
                  o.alive || (o = r());
                }, 18e5);
            }, 1e4 + 0 * Math.random());
          }
          return (dimension.dims[i.name] = i), startTick(i), i;
        }
      },
      reset: function ($) {
        for (let e = $.tanks.length - 1; e >= 0; e--) {
          let t = $.tanks[e];
          (t._d = []),
            (t.firedBarrels = {}),
            t.lastLevelSent !== t.level && (t.lastLevelSent = t.level);
        }
        ($.updatedTanks = {}),
          ($.chatMessages = {}),
          ($.updatedGates = {}),
          ($.resizedWormholes = {}),
          ($.rupturedWormholes = {}),
          ($.fadeTimeChanges = {}),
          ($.removedWormholes = {}),
          ($.addedWormholes = {}),
          ($.updatedPortals = {}),
          ($.updatedWalls = {}),
          ($.removedWalls = {}),
          ($.mapSizeUpdated = !1),
          ($.darknessUpdated = !1);
      },
      bounceCircles: function ($, e, t, a, n) {
        let i = Math.sqrt(t.distance) || 0;
        i <= 1 && (i = 1);
        let _ = (t.size - i + 1) * 0.01 * a;
        _ > 0.5 ? (_ = 0.5) : _ < n && (_ = n);
        let s = _ / i,
          o = $.x - e.x,
          r = $.y - e.y;
        0 === o && (o = (Math.random() - 0.5) * 0.1),
          0 === r && (r = (Math.random() - 0.5) * 0.1),
          (o *= s),
          (r *= s);
        let d = 1,
          c = 1,
          u = $.size * ($.weight || 1),
          m = e.size * (e.weight || 1);
        e.size > $.size ? (c = (c = u / m) * c) : (d = (d = m / u) * d),
          "bullet" === $.objectType && (c *= 0.25),
          "bullet" === e.objectType && (d *= 0.25),
          (!$.static || $.canBePushed) &&
            ((d *= dimension.tickMultiplier / ($.density || 1)),
            ($.xv += o * d),
            ($.yv += r * d)),
          (!e.static || e.canBePushed) &&
            ((c *= dimension.tickMultiplier / (e.density || 1)),
            (e.xv += -o * c),
            (e.yv += -r * c));
      },
      collideWall: function ($) {
        let e = $.rect,
          t = $.circle.object;
        if ($.cinX || $.cinY) {
          if ($.cinX && $.cinY)
            Math.abs((t.y - e.y) * e.w) > Math.abs((t.x - e.x) * e.h)
              ? t.y > e.y
                ? (t.y = $.rect.top + $.size)
                : (t.y = $.rect.bottom - $.size)
              : t.x > e.x
              ? (t.x = $.rect.right + $.size)
              : (t.x = $.rect.left - $.size),
              "tank" !== t.objectType && t.remove();
          else {
            if ($.cinY && $.inX) {
              let a = t.x > e.x;
              a ? (t.x = $.rect.right + $.size) : (t.x = $.rect.left - $.size),
                (t.xv =
                  (a ? 1 : -1) * Math.abs(t.xv * dimension.wallRestitution));
            }
            if ($.cinX && $.inY) {
              let n = t.y > e.y;
              n ? (t.y = $.rect.top + $.size) : (t.y = $.rect.bottom - $.size),
                (t.yv =
                  (n ? 1 : -1) * Math.abs(t.yv * dimension.wallRestitution));
            }
          }
        } else {
          let i = Math.sqrt($.distance);
          i < 0.1 && (i = 0.1);
          let _ = t.size / i;
          (t.x = $.cx + (t.x - $.cx) * _), (t.y = $.cy + (t.y - $.cy) * _);
        }
      },
      bounceGate: function ($, e, t) {
        (t *= dimension.tickMultiplier),
          (0 === $.d) + (2 === $.d)
            ? e.xv > 0
              ? ((e.xv = -t), (e.x = $.left - e.size - 1))
              : ((e.xv = t), (e.x = $.right + e.size + 1))
            : e.yv > 0
            ? ((e.yv = -t), (e.y = $.bottom - e.size - 1))
            : ((e.yv = t), (e.y = $.top + e.size + 1));
      },
      collideGate: function ($, e) {
        let t = $.rect,
          a = t.object[5];
        if (
          2 === t.gateType ||
          (e.timeExisted < 1 && "tank" === e.objectType)
        ) {
          let n = t.d < 2 ? 50 : -50;
          0 === t.d || 2 === t.d ? (e.xv = n) : (e.yv = n),
            1 === t.gateType &&
              e.radiant > 0 &&
              ((t.object[5] = !0), (t.object[6] = 75));
        } else
          1 === t.gateType
            ? a ||
              (e.parent && e.parent.radiant > 0) ||
              (e.radiant > 0
                ? ((t.object[5] = !0), (t.object[6] = 75))
                : 0 === t.d || 2 === t.d
                ? e.xv > 0
                  ? ((e.xv = -30), (e.x = t.left - e.size - 1))
                  : ((e.xv = 30), (e.x = t.right + e.size + 1))
                : e.yv > 0
                ? ((e.yv = -30), (e.y = t.bottom - e.size - 1))
                : ((e.yv = 30), (e.y = t.top + e.size + 1)))
            : 0 === t.gateType
            ? e.level >= 60 && 7 !== e.team
              ? 6 !== e.team &&
                (e.ascend(),
                e.ws &&
                  e.ws.sendPacket &&
                  e.ws.sendPacket("setStats", e.upgrades))
              : "tank" === e.objectType
              ? dimension.bounceGate(t, e, 30)
              : e.remove()
            : 3 !== t.gateType ||
              a ||
              ([e.xv > 0, e.yv > 0, e.xv < 0, e.yv < 0][t.d]
                ? ((t.object[5] = !0),
                  (t.object[6] = 15),
                  0 === t.d || 2 === t.d
                    ? (e.xv = 2 === t.d ? -100 : 100)
                    : (e.yv = 3 === t.d ? -100 : 100))
                : 0 === t.d || 2 === t.d
                ? 2 === t.d
                  ? ((e.xv = -30), (e.x = t.left - e.size - 1))
                  : ((e.xv = 30), (e.x = t.right + e.size + 1))
                : 3 === t.d
                ? ((e.yv = -30), (e.y = t.bottom - e.size - 1))
                : ((e.yv = 30), (e.y = t.top + e.size + 1)));
      },
      polygonDamage: 3,
      bulletDamage: 1,
      checkAngle: function ($, e, t, a) {
        return dimension.validateAngle(Math.atan2(-t, a), $, e);
      },
      validateAngle: function ($, e, t) {
        return (
          !(t <= 0) &&
          ((!(e <= 0) && !(e >= 0)) ||
            !(t > 0) ||
            Math.abs(
              (((($ - e + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) %
                (2 * Math.PI)) -
                Math.PI
            ) <= t)
        );
      },
      clampAngle: function ($, e, t) {
        if ((e <= 0 || e >= 0) && t > 0) {
          let a =
            (((($ - e + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) %
              (2 * Math.PI)) -
            Math.PI;
          if (!(Math.abs(a) <= t)) return a < 0 ? e - t : e + t;
        }
        return $;
      },
      collide: function ($, e, t) {
        let a = {
            tank: 0,
            detectEnemies: 1,
            bullet: 2,
            polygon: 3,
            detectFriends: 4,
            wall: 5,
            gate: 6,
            wormhole: 7,
          },
          n = $.object,
          i = e.object;
        if (
          (a[$.type] > a[e.type] && (([$, e] = [e, $]), ([n, i] = [i, n])),
          "tank" === $.type)
        ) {
          if ("tank" === e.type)
            dimension.bounceCircles(n, i, t, 1, 0.2),
              dimension.isSameTeam(n, i) ||
                n.invincible ||
                i.invincible ||
                (n.inBase ||
                  n.prevInBase ||
                  n.damage(
                    10 *
                      dimension.tickMultiplier *
                      i.bodyDamage *
                      i.levelMultiplier *
                      i.bodyDamageMultiplier,
                    i,
                    "tanks"
                  ),
                i.inBase ||
                  i.prevInBase ||
                  i.damage(
                    10 *
                      dimension.tickMultiplier *
                      n.bodyDamage *
                      n.levelMultiplier *
                      n.bodyDamageMultiplier,
                    n,
                    "tanks"
                  ));
          else if ("detectEnemies" === e.type) {
            if (
              !dimension.isSameTeam(e.parent, n) &&
              !(n.invincible || n.inBase || n.prevInBase) &&
              dimension.checkAngle(e.d, e.range, n.x - e.x, n.y - e.y)
            ) {
              e.objects.push(n);
              let _ = Math.sqrt(t.distance) - t.size;
              e.distances.push(_),
                (_ < e.closest || !1 === e.closest) &&
                  ((e.closest = _), (e.closestObject = n)),
                (_ < e.closestTankDistance || !1 === e.closestTank) &&
                  ((e.closestTankDistance = _), (e.closestTank = n));
            }
          } else if ("bullet" === e.type) {
            if (
              !dimension.isSameTeam(n, i.parent) &&
              !(n.inBase || n.prevInBase)
            ) {
              if (n.invincible) i.remove();
              else {
                n.damage(
                  dimension.tickMultiplier *
                    dimension.bulletDamage *
                    i.damageMultiplier *
                    i.barrel.data.damage *
                    i.parent.levelMultiplier *
                    i.damageMultiplier,
                  i.parent,
                  "tanks"
                ),
                  i.damage(
                    10 *
                      dimension.tickMultiplier *
                      (n.bodyDamage >= 0 ? n.bodyDamage : 1) *
                      n.levelMultiplier *
                      (n.bodyDamageMultiplier >= 0 ? n.bodyDamageMultiplier : 1)
                  );
                let s = [0, 1, 2, 1, 2, 0][i.type];
                0 === s
                  ? dimension.bounceCircles(n, i, t, 0.02, 0)
                  : 1 === s
                  ? dimension.bounceCircles(n, i, t, 0.5, 0)
                  : dimension.bounceCircles(n, i, t, 0.02, 0);
              }
            }
          } else if ("polygon" === e.type)
            dimension.bounceCircles(n, i, t, 1, 0.2),
              n.invincible ||
                5 === n.team ||
                (n.inBase ||
                  n.prevInBase ||
                  n.ignorePolygonDamage ||
                  n.damage(
                    dimension.tickMultiplier * dimension.polygonDamage,
                    i,
                    "polygons"
                  ),
                i.damage(
                  10 *
                    dimension.tickMultiplier *
                    n.bodyDamage *
                    n.levelMultiplier *
                    n.bodyDamageMultiplier,
                  n,
                  "tanks"
                ));
          else if ("detectFriends" === e.type) {
            if (dimension.isSameTeam(e.parent, n)) {
              e.objects.push(n);
              let o = Math.sqrt(t.distance) - t.size;
              e.distances.push(o),
                (o < e.closest || !1 === e.closest) &&
                  ((e.closest = o), (e.closestObject = n));
            }
          } else if ("wall" !== e.type || n.clip) {
            if ("gate" === e.type) dimension.collideGate(t, n);
            else if ("wormhole" === e.type) {
              if (0 === i.type) {
                if (
                  (n.level >= 60 || i.ruptured) &&
                  !((n.invincible && n.invincibleTime) || n.static)
                ) {
                  i._objects[n.id] = n;
                  let r = i.x - n.x,
                    d = i.y - n.y,
                    c = r * r + d * d,
                    u = 0.01 * (c > 1 ? 1 / Math.sqrt(c) : 1);
                  (n.xv += r * u), (n.yv += d * u);
                } else dimension.bounceCircles(n, i, t, 1, 0.5);
              } else if (1 === i.type) {
                if (
                  (n.radiant > 0 || i.ruptured) &&
                  !((n.invincible && n.invincibleTime) || n.static)
                ) {
                  i._objects[n.id] = n;
                  let m = i.x - n.x,
                    p = i.y - n.y,
                    f = m * m + p * p,
                    g = 0.01 * (f > 1 ? 1 / Math.sqrt(f) : 1);
                  (n.xv += m * g), (n.yv += p * g);
                } else dimension.bounceCircles(n, i, t, 1, 0.5);
              } else i._objects[n.id] = n;
            }
          } else
            dimension.isSameTeam(n, i)
              ? e.noInvincibility || (n.inBase = !0)
              : (dimension.collideWall(t, n),
                e.object.team >= 0 &&
                  !(n.inBase || n.prevInBase || n.static || n.invincible) &&
                  n.maxHealth &&
                  ((n.health -= dimension.tickMultiplier * n.maxHealth * 0.003),
                  (n.regenTime = 0)));
        } else if ("detectEnemies" === $.type) {
          if ("polygon" === e.type) {
            if (
              5 !== $.parent.team &&
              dimension.checkAngle($.d, $.range, i.x - $.x, i.y - $.y)
            ) {
              $.objects.push(i);
              let y = Math.sqrt(t.distance) - t.size;
              $.distances.push(y),
                (y < $.closest || !1 === $.closest) &&
                  (($.closest = y), ($.closestObject = i));
            }
          } else if (
            "bullet" === e.type &&
            !dimension.isSameTeam($.parent, i.parent)
          ) {
            $.bullets && $.objects.push(i);
            let h = Math.sqrt(t.distance) - t.size;
            $.bullets && $.distances.push(h),
              (h < $.closestBulletDistance || !1 === $.closestBullet) &&
                (($.closestBulletDistance = h), ($.closestBullet = i));
          }
        } else if ("bullet" === $.type) {
          if ("bullet" === e.type) {
            if (dimension.isSameTeam(n.parent, i.parent)) {
              let k = [0, 1, 2, 1, 2, 0][n.type];
              k === [0, 1, 2, 1, 2, 0][i.type] &&
                (0 === k ||
                  (1 === k
                    ? dimension.bounceCircles(n, i, t, 0.5, 0)
                    : dimension.bounceCircles(n, i, t, 1, 0)));
            } else if (n.health >= 0 && i.health >= 0) {
              dimension.bounceCircles(n, i, t, 0.5, 0.1);
              let v = 2,
                b =
                  dimension.tickMultiplier *
                  dimension.bulletDamage *
                  i.barrel.data.damage *
                  i.parent.levelMultiplier *
                  v *
                  i.damageMultiplier,
                w =
                  dimension.tickMultiplier *
                  dimension.bulletDamage *
                  n.barrel.data.damage *
                  n.parent.levelMultiplier *
                  v *
                  n.damageMultiplier,
                x = b > n.health,
                T = w > i.health;
              if (x || T) {
                let z = n.health / b,
                  S = i.health / w,
                  P = z < S ? z : S;
                (b *= P), (w *= P);
              }
              n.damage(b), i.damage(w);
            }
          } else if ("polygon" === e.type) {
            let D = [0, 1, 2, 1, 2, 0][n.type];
            0 === D
              ? dimension.bounceCircles(n, i, t, 0.02, 0)
              : 1 === D
              ? dimension.bounceCircles(n, i, t, 0.2, 0)
              : dimension.bounceCircles(n, i, t, 0.5, 0.15),
              5 !== n.parent.team &&
                (n.damage(dimension.tickMultiplier * dimension.polygonDamage),
                i.damage(
                  dimension.tickMultiplier *
                    dimension.bulletDamage *
                    n.damageMultiplier *
                    n.barrel.data.damage *
                    n.parent.levelMultiplier *
                    n.damageMultiplier,
                  n.parent,
                  "tanks"
                ));
          } else
            "wall" === e.type
              ? dimension.isSameTeam(n.parent, i) ||
                e.noInvincibility ||
                (dimension.collideWall(t, n),
                !(e.object.team >= 0) ||
                  n.inBase ||
                  n.prevInBase ||
                  n.static ||
                  n.invincible ||
                  (n.damage(dimension.tickMultiplier * n.maxHealth * 0.003),
                  (n.regenTime = 0)))
              : "gate" === e.type
              ? dimension.collideGate(t, n)
              : "wormhole" === e.type &&
                2 === i.type &&
                dimension.bounceCircles(n, i, t, 1, 0.5);
        } else
          "polygon" === $.type
            ? "polygon" === e.type
              ? dimension.bounceCircles(n, i, t, 1, 0.2)
              : "wall" === e.type
              ? 5 !== e.object.team &&
                (dimension.collideWall(t, n),
                e.object.team >= 0 &&
                  ((n.health -= dimension.tickMultiplier * n.maxHealth * 0.003),
                  (n.regenTime = 0)))
              : "gate" === e.type
              ? dimension.collideGate(t, n)
              : "wormhole" === e.type &&
                dimension.bounceCircles(n, i, t, 1, 0.5)
            : $.type;
      },
      getRadiantName: function ($) {
        return $ < 1
          ? ""
          : $ < 5
          ? ["Radiant", "Gleaming", "Luminous", "Lustrous"][$ - 1]
          : `Highly Radiant (${$})`;
      },
      getPolygonName: function ($) {
        return $ < 0
          ? [
              "Tetrahedron",
              "Cube",
              "Octahedron",
              "Dodecahedron",
              "Icosahedron",
            ][-$ - 1]
          : $ < 3
          ? "???"
          : $ < 21
          ? [
              "Triangle",
              "Square",
              "Pentagon",
              "Hexagon",
              "Heptagon",
              "Octagon",
              "Nonagon",
              "Decagon",
              "Hendecagon",
              "Dodecagon",
              "Tridecagon",
              "Tetradecagon",
              "Pentadecagon",
              "Hexadecagon",
              "Heptadecagon",
              "Octadecagon",
              "Nonadecagon",
              "Icosagon",
            ][$ - 3]
          : `Circle (${$})`;
      },
      getFullPolygonName: function ($, e) {
        let t = dimension.getPolygonName($.sides),
          a = "";
        return (
          e
            ? $.radiant >= 1 && (a = `${dimension.getRadiantName($.radiant)} `)
            : (a =
                $.radiant < 1
                  ? 0 > "AEIOU".indexOf(t[0])
                    ? "a "
                    : "an "
                  : `a ${dimension.getRadiantName($.radiant)} `),
          a + t
        );
      },
      updateTurret: function ($, e, t) {
        if (
          (($.position = "weaponTurret"),
          ($.active = !t.passive),
          1 === $.rotationType)
        )
          ($.d += $.rotationSpeed), ($.d = $.d % (2 * Math.PI));
        else if (!$.rotationType) {
          let a = $.detector.closestTank || $.detector.closestObject;
          if (a) {
            let n = dimension.aimAtTarget(
              { x: $.gameX, y: $.gameY },
              a,
              $.barrels[0] ? dimension.getBulletSpeed($.barrels[0].data, t) : 0
            );
            $.d =
              e.d +
              dimension.clampAngle(
                Math.atan2(-n[0], n[1]) - e.d,
                $.angle,
                $.angleRange
              );
          } else {
            $.active = !1;
            let i = !0;
            if (t.firing) {
              let _,
                s =
                  Math.atan2(
                    $.gameX - t.mousePosition[0],
                    t.mousePosition[1] - $.gameY
                  ) - e.d;
              dimension.validateAngle(s, $.angle, $.angleRange) &&
                (($.d = e.d + s), (i = !1));
            }
            if (i) {
              if ($.angle >= 0 || $.angle <= 0) {
                let o = ($.angle + e.d) % (2 * Math.PI);
                $.d = dimension.averageAngles($.d, o, 2);
              } else
                ($.d += 0.01 * dimension.tickMultiplier),
                  $.d >= 2 * Math.PI && ($.d -= 2 * Math.PI);
            }
          }
        }
      },
      update: function ($, e, t) {
        let a = _performance.now(),
          n = {
            detect: { auras: 0, aurasTotal: 0, turrets: 0, turretsTotal: 0 },
          };
        if (
          (($.onUpdate && $.onUpdate({ now: t }), $.mapSizeSpeed > 0)
            ? Math.abs($.mapSize - $._mapSize) <= $.mapSizeSpeed
              ? (($.mapSize = $._mapSize), ($.mapSizeSpeed = 0))
              : ($.mapSize +=
                  $.mapSize > $._mapSize ? -$.mapSizeSpeed : $.mapSizeSpeed)
            : ($._mapSize = $.mapSize),
          $.tanks.length > 1e3)
        ) {
          for (let i = $.tanks.length - 1; i >= 0; i--) {
            let _ = $.tanks[i];
            _.static || _.ws.data.isPlayer || _.remove();
          }
          if ($.tanks.length > 1e3)
            for (let s = $.tanks.length - 1; s >= 0; s--) {
              let o = $.tanks[s];
              o.static || o.remove();
            }
        }
        if (
          (t - $.lastPolyhedra > 12e4 &&
            (($.lastPolyhedra = t),
            0.01 > Math.random() && ($.nextSpawnPolyhedra = !0)),
          e.gameUpdate)
        ) {
          $.lastMapSize !== $.mapSize &&
            ($.mapSizeUpdated = $.lastMapSize = $.mapSize);
          for (let r = $.newTanks.length - 1; r >= 0; r--) {
            let d = $.newTanks[r],
              c = d[1],
              u = 0,
              m = 0,
              p = 0;
            if (
              ((u =
                d[0].team >= 5 && !(dimension.noPinkTeam && 6 === d[0].team)
                  ? d[0].team
                  : "2teams" === $.type
                  ? c.data.lastTeam > 0 && c.data.lastTeam < 3
                    ? c.data.lastTeam
                    : 1 + Math.floor(2 * Math.random())
                  : "ffa" === $.type
                  ? 0
                  : c.data.lastTeam > 0 && c.data.lastTeam < 5
                  ? c.data.lastTeam
                  : 1 + Math.floor(4 * Math.random())),
              (c.data.lastTeam = u),
              (d[0].team = u),
              (d[1].data.tank = generator.tank(d[0], d[1])),
              ([m, p] = $.spawnPlayer(u, d[1].data.tank, d[2])),
              (d[1].data.tank.x = m),
              (d[1].data.tank.y = p),
              console.log(
                "dim",
                `name:${d[0].name} t${c.data.tank.id} score:${Math.round(
                  d[0].score
                )} dim:${$.name}`
              ),
              (d[1].data.waiting = !1),
              c && c.accountData)
            ) {
              let f = c.accountData,
                g = f.dims[$.name];
              f.dims[$.name] = g > 0 ? g + 1 : 1;
              let y = d[1].data.tank;
              if (
                f.dims.ffa &&
                f.dims["2teams"] &&
                f.dims["4teams"] &&
                !f.achievements[8]
              ) {
                let h = (f.achievements[8] = createAchievement(8));
                sendAchievement(y, h);
              }
              if (y.celestial && "sanctuary" === $.type) {
                if (!f.achievements[3]) {
                  let k = (f.achievements[3] = createAchievement(3));
                  sendAchievement(y, k);
                }
                if (y.level >= 90 && !f.achievements[5]) {
                  let v = (f.achievements[5] = createAchievement(5));
                  sendAchievement(y, v);
                }
              }
              if (!(g > 0)) {
                if (
                  "crossroads" === $.name &&
                  (args.parentPort.postMessage([
                    "dimension",
                    [c.accountName, "crossroads"],
                  ]),
                  !f.achievements[4])
                ) {
                  let b = (f.achievements[4] = createAchievement(4));
                  sendAchievement(y, b);
                }
                if (
                  "abyss" === $.name &&
                  (args.parentPort.postMessage([
                    "dimension",
                    [c.accountName, "abyss"],
                  ]),
                  !f.achievements[17])
                ) {
                  let w = (f.achievements[17] = createAchievement(17));
                  sendAchievement(y, w);
                }
              }
            }
            d[1].sendPacket &&
              d[1].sendPacket(
                "gameStart",
                packer.gameStart({
                  tank: d[1].data.tank,
                  dim: d[0].dim,
                  upgrades: d[1].data.tank.upgrades,
                  saveCode: d[1].data.saveCode,
                })
              ),
              d[1].data.isPlayer &&
                !d[1].data.tank.invisible &&
                (d[0].dim.broadcast(`${d[1].data.tank.name} has spawned.`),
                d[1].accountName &&
                  d[1].accountData &&
                  d[1].accountData.timeAlive <= 0 &&
                  d[1].sendPacket(
                    "announcement",
                    `Logged in to account: ${d[1].accountName}`
                  ));
          }
          $.newTanks = [];
        }
        let x = [],
          T = [];
        for (let z = $.gates.length - 1; z >= 0; z--) {
          let S = $.gates[z];
          1 === S[0] || 3 === S[0]
            ? (S[6] > 0 &&
                ((S[6] -= 0.01 * dimension.tickMultiplier),
                S[6] <= 0 && (S[6] = 0)),
              (S[5] = 0 !== S[6]))
            : ((S[5] = !1), (S[6] = 0));
        }
        let P = [],
          D = [],
          j = 0;
        for (let W = $.tanks.length - 1; W >= 0; W--) {
          let B = $.tanks[W];
          if (
            ((B.timeExisted += dimension.tickTime),
            B.score >= 0 ||
              ((B.score = 0), B.update(), (B.dim.updatedTanks[B.id] = B)),
            B.xv || (B.xv = 0),
            B.yv || (B.yv = 0),
            B.x || (B.x = 0),
            B.y || (B.y = 0),
            B.d || (B.d = 0),
            B.celestial && D.push(B),
            B.ws && B.ws.data && B.ws.data.isPlayer && j++,
            B.ai && "function" == typeof B.ai)
          )
            try {
              B.ai({ now: t, options: e });
            } catch (M) {}
          if (((!B.regen || B.regen < 1) && (B.regen = 1), B.regenTime < 1)) {
            let C = 25 - B.upgrades[6] / 1.4;
            (B.regenTime +=
              ((0.01 * dimension.tickMultiplier) / C) *
              (B.regenTime > 0.75 ? 1 : 1 + 0.3 * (B.regen - 1))),
              B.regenTime > 1 && (B.regenTime = 1);
          } else if (B.health < B.maxHealth) {
            let I = 25 - B.upgrades[6] / 2;
            (B.health +=
              ((dimension.tickMultiplier * B.maxHealth * 0.01) / I) *
              (1 + 0.3 * (B.regen - 1))),
              B.health > B.maxHealth && (B.health = B.maxHealth);
          }
          (B.regen = 1), (B.bodyDamageMultiplier = 1 + B.upgrades[5] / 15);
          let N =
            800 *
            B.levelMultiplier *
            B.maxHealthMultiplier *
            (B.celestial ? 4 : 1) *
            (1 + B.upgrades[7] / 22.5);
          if (
            (N != B.maxHealth && B.setMaxHealth(N),
            (B.mousePosition[0] = B.x + B.controlPosition[0]),
            (B.mousePosition[1] = B.y + B.controlPosition[1]),
            B.dragTarget)
          )
            for (let R = B.dragTarget.length - 1; R >= 0; R--) {
              let H = B.dragTarget[R];
              H.static ||
                ((H.x = B.mousePosition[0]), (H.y = B.mousePosition[1]));
            }
          if (B.dragWall) {
            let F = B.dragWall,
              O = B.mousePosition[0],
              U = B.mousePosition[1],
              A = 2;
            if (
              (B.dragWallSnap &&
                ((O = 50 * Math.round(O / 50)),
                (U = 50 * Math.round(U / 50)),
                (A = 0.8)),
              F[0] !== O || F[1] !== U)
            ) {
              (F[0] = Math.round((F[0] * A + O) / (A + 1))),
                (F[1] = Math.round((F[1] * A + U) / (A + 1)));
              let Y = $.walls.indexOf(F);
              Y >= 0 ? ($.updatedWalls[Y] = F) : (B.dragWall = !1);
            }
          }
          e.updateFinalDamage &&
            ((B.finalDamage.tanks = generator.updateFinalDamage(
              B.finalDamage.tanks
            )),
            (B.finalDamage.polygons = generator.updateFinalDamage(
              B.finalDamage.polygons
            ))),
            (B.x += B.xv),
            (B.y += B.yv),
            B.invincibleTime &&
              (B.invincibleTime > t
                ? B.firing
                  ? B.invincibleTime - t > 3e3 && (B.invincibleTime = t + 3e3)
                  : (B.input.movement[0] || B.input.movement[1]) &&
                    B.invincibleTime - t > 5e3 &&
                    (B.invincibleTime = t + 5e3)
                : ((B.invincibleTime = !1), (B.invincible = !1)));
          let E =
              B.speed *
              dimension.tickMultiplier *
              0.14 *
              (B.size > 30 ? 10 / (B.size - 20) : 1) *
              (1 + 0.1 * B.upgrades[4]) *
              B.movementSpeed,
            L = $.friction ? dimension.power97 : 1;
          1 !== B.friction &&
            (B.friction < 1
              ? (L = 1 - (1 - L) * B.friction)
              : (L /= B.friction)),
            1.01 !== $.sizeScale &&
              (E *= Math.pow($.sizeScale / 1.01, B.level)),
            (B.xv =
              B.xv * L + dimension.tickMultiplier * B.input.movement[0] * E),
            (B.yv =
              B.yv * L + dimension.tickMultiplier * B.input.movement[1] * E),
            e.recordDirection &&
              B._d.push(
                ((Math.round((B.d / Math.PI) * 1e3) % 2e3) + 2e3) % 2e3
              );
          let X = !B.static && !B.fullFov,
            q = (B.collideObject = B.collideObject || {});
          if (
            ((q.x = B.x),
            (q.y = B.y),
            (q.size = B.size),
            (q.object = B),
            (q.type = "tank"),
            (q.noCollide = B.noHitBox),
            x.push(q),
            (B.fovMultiplier =
              Math.sqrt(B.size / 75) * B.weaponCameraSize * B.bodyCameraSize),
            X)
          ) {
            let G = (B.viewObject = B.viewObject || {});
            (G.x = B.x),
              (G.y = B.y),
              (G.size = 1.5 * B.size + 200),
              (G.object = B),
              (G.type = "bullet"),
              (G.str = "tanks"),
              T.push(G);
            let K = (B.fovObject = B.fovObject || {});
            (K.x = B.x), (K.y = B.y);
            let J = B.fovMultiplier;
            (K.w = 1920 * J),
              (K.h = 1080 * J),
              (K.object = B),
              (K.type = "fov");
            let V = (K.fov = K.fov || {});
            (V.tanks = {}),
              (V.polygons = {}),
              (V.bullets = {}),
              T.push(K),
              P.push(K);
          }
          {
            let Q = (B.detectObject = B.detectObject || {});
            (Q.x = B.x),
              (Q.y = B.y),
              (Q.size = 300 + B.size * B.range),
              (Q.object = B),
              (Q.type = "detectEnemies"),
              (Q.parent = B),
              (Q.objects = []),
              (Q.distances = []),
              (Q.closest = !1),
              (Q.closestObject = !1),
              (Q.closestTank = !1),
              (Q.closestTankDistance = !1),
              (Q.closestBullet = !1),
              (Q.closestBulletDistance = !1),
              (Q.possible = []),
              (B.detector = Q),
              x.push(Q);
          }
          let Z = Math.sin(B.d),
            $$ = Math.cos(B.d),
            $e = function ($, e, t) {
              let a = Math.sin($.d),
                n = Math.cos($.d),
                i = t ? $.gameX : B.x,
                _ = t ? $.gameY : B.y,
                s = t ? e.relativeSize * B.size : B.size;
              return [i + s * (e.x * n + e.y * a), _ - s * (e.y * n - e.x * a)];
            },
            $t = function ($, e, t) {
              for (let a = 0, n = e.length; a < n; a++) {
                let i = e[a],
                  _ = $e($, i, t);
                if (((i.gameX = _[0]), (i.gameY = _[1]), i)) {
                  i.sectionWeapon && $t(i, i.sectionWeapon.weaponTurrets, 1);
                  i.sectionBody && $t(i, i.sectionBody.turrets, 1);
                }
              }
            };
          $t(B, B.weaponTurrets), $t(B, B.turrets);
          for (let $a = 0, $n = B._turrets.length; $a < $n; $a++) {
            let $i = B._turrets[$a];
            if ($i.rotationType) $i.detector = {};
            else {
              if ((n.detect.turretsTotal++, !($i.count >= 0) || $i.count >= 9))
                $i.count = 0;
              else {
                $i.count++;
                continue;
              }
              let $l = {
                x: $i.gameX,
                y: $i.gameY,
                d: B.d + ($i.angle >= 0 || $i.angle <= 0 ? $i.angle : 0),
                range: $i.angleRange,
                size:
                  (10 * B.size * $i.size + 400) *
                  ($i.detectRange >= 0 ? $i.detectRange : 1),
                object: $i,
                type: "detectEnemies",
                parent: B,
                objects: [],
                distances: [],
                closest: !1,
                closestObject: !1,
                closestTank: !1,
                closestTankDistance: !1,
                closestBullet: !1,
                closestBulletDistance: !1,
                possible: [],
              };
              n.detect.turrets++, ($i.detector = $l), x.push($l);
            }
          }
          for (let $_ = 0, $s = B.auras.length; $_ < $s; $_++) {
            let $o = B.auras[$_];
            ($o.gameSize = B.size * $o.auraSize), n.detect.aurasTotal++;
            let $r = !1;
            if (!($o.counter >= 0) || $o.counter >= 9)
              ($o.counter = 0), ($r = !0);
            else {
              $o.counter++;
              continue;
            }
            if (
              !1 === B.passive &&
              (!$o.detector || !$o.detector.objects || $r)
            ) {
              n.detect.auras++;
              let $d = {
                x: B.x + B.size * ($o.x * $$ + $o.y * Z),
                y: B.y - B.size * ($o.y * $$ - $o.x * Z),
                size: $o.gameSize,
                object: $o,
                type: "detectEnemies",
                parent: B,
                objects: [],
                distances: [],
                closest: !1,
                closestObject: !1,
                closestTank: !1,
                closestTankDistance: !1,
                closestBullet: !1,
                closestBulletDistance: !1,
                possible: [],
              };
              if (2 === $o.type) $d.bullets = !0;
              else if (1 === $o.type) $d.type = "detectFriends";
              else if (0 !== $o.type) continue;
              $d.x,
                $d.y,
                $d.size,
                ($o.detector = $d),
                ($o.gameX = $d.x),
                ($o.gameY = $d.y),
                x.push($d);
            }
          }
        }
        if (
          ("2teams" === $.type || ("4teams" === $.type && $.isMain)) &&
          1 === D.length &&
          D[0] &&
          j.length >= 13
        ) {
          let $3 = D[0];
          $3.loneSurvivorTime += dimension.tickTime;
          let $c = $3.ws.accountData;
          if (
            $c &&
            (($c.loneSurvivorTime += dimension.tickTime),
            !$c.achievements[23] && $3.loneSurvivorTime >= 600)
          ) {
            let $u = ($c.achievements[23] = createAchievement(23));
            sendAchievement($3, $u);
          }
        }
        for (let $m = $.bullets.length - 1; $m >= 0; $m--) {
          let $p = $.bullets[$m],
            $f = $p.parent;
          ($p.x += $p.xv), ($p.y += $p.yv);
          let $0 = Math.sin($p.d),
            $1 = Math.cos($p.d);
          (1 === $p.type || 2 === $p.type || 3 === $p.type || 4 === $p.type) &&
            $.friction &&
            (($p.xv *= dimension.power97), ($p.yv *= dimension.power97));
          let $g = $p.collideObject || {};
          ($g.x = $p.x),
            ($g.y = $p.y),
            ($g.size = $p.size),
            ($g.object = $p),
            ($g.type = "bullet"),
            x.push($g);
          let $y = $p.viewObject || {};
          if (
            (($y.x = $p.x),
            ($y.y = $p.y),
            ($y.size = 1.5 * $p.size + 200),
            ($y.object = $p),
            ($y.type = "bullet"),
            ($y.str = "bullets"),
            T.push($y),
            $p.auras)
          )
            for (let $h = 0, $4 = $p.auras.length; $h < $4; $h++) {
              let $k = $p.auras[$h];
              $k.gameSize = $p.size * $k.auraSize;
              let $2 = !1;
              if (
                (n.detect.aurasTotal++, !($k.counter >= 0) || $k.counter >= 9)
              )
                ($2 = !0), ($k.counter = 0);
              else {
                $k.counter++;
                continue;
              }
              if (
                !1 === $f.passive &&
                (!$k.detector || !$k.detector.objects || $2)
              ) {
                n.detect.auras++;
                let $v = {
                  x: $p.x + $p.size * ($k.x * $1 + $k.y * $0),
                  y: $p.y - $p.size * ($k.y * $1 - $k.x * $0),
                  size: $k.gameSize,
                  object: $k,
                  type: "detectEnemies",
                  parent: $f,
                  objects: [],
                  distances: [],
                  closest: !1,
                  closestObject: !1,
                  closestTank: !1,
                  closestTankDistance: !1,
                  closestBullet: !1,
                  closestBulletDistance: !1,
                  possible: [],
                };
                if (2 === $k.type) $v.bullets = !0;
                else if (1 === $k.type) $v.type = "detectFriends";
                else if (0 !== $k.type) continue;
                $v.x,
                  $v.y,
                  $v.size,
                  ($k.detector = $v),
                  ($k.gameX = $v.x),
                  ($k.gameY = $v.y),
                  x.push($v);
              }
            }
          if (
            (($p.timeExisted += 0.01 * dimension.tickMultiplier),
            (($p.timeExisted > $p.lifeTime && 2 !== $p.type && 4 !== $p.type) ||
              !($p.health > 0)) &&
              $p.remove(),
            $p.turrets && $p.turrets[0])
          )
            for (let $b = 0, $5 = $p.turrets.length; $b < $5; $b++) {
              let $w = $p.turrets[$b];
              if ((n.detect.turretsTotal++, !($w.count >= 0) || $w.count >= 9))
                $w.count = 0;
              else {
                $w.count++;
                continue;
              }
              let $7 = {
                x: $p.x - $p.size * ($w.x * $1 + $w.y * $0),
                y: $p.y + $p.size * ($w.y * $1 - $w.x * $0),
                size: 10 * $p.size * $w.size + 400,
                object: $w,
                type: "detectEnemies",
                parent: $p.parent,
                objects: [],
                distances: [],
                closest: !1,
                closestObject: !1,
                closestTank: !1,
                closestTankDistance: !1,
                closestBullet: !1,
                closestBulletDistance: !1,
                possible: [],
              };
              ($w.detector = $7),
                ($w.gameX = $7.x),
                ($w.gameY = $7.y),
                x.push($7);
            }
        }
        for (let $6 = $.polygons.length - 1; $6 >= 0; $6--) {
          let $x = $.polygons[$6];
          if (
            (e.gameUpdate &&
              ($x.finalDamage.tanks = generator.updateFinalDamage(
                $x.finalDamage.tanks
              )),
            $x.regenTime < 1)
          )
            ($x.regenTime +=
              (0.02 * dimension.tickMultiplier) / (9 + 2 * Math.abs($x.sides))),
              $x.regenTime > 1 && ($x.regenTime = 1);
          else if ($x.health < $x.maxHealth) {
            let $T = $x.sides >= 3 ? $x.sides : 10 - $x.sides;
            ($x.health +=
              (dimension.tickMultiplier * $x.maxHealth * 0.004) /
              ($T * $T * 0.1 - 0.15)),
              $x.health > $x.maxHealth && ($x.health = $x.maxHealth);
          }
          ($x.x += $x.xv),
            ($x.y += $x.yv),
            $.friction &&
              (($x.xv *= dimension.power97), ($x.yv *= dimension.power97));
          let $z = 0.005 * dimension.tickMultiplier * $x.speed;
          ($x.d += $z),
            $x.d >= 2 * Math.PI && ($x.d -= 2 * Math.PI),
            ($z *= 8),
            ($x.xv += Math.sin($x.d) * $z),
            ($x.yv -= Math.cos($x.d) * $z);
          let $S = {
              x: $x.x,
              y: $x.y,
              size: $x.size,
              object: $x,
              type: "polygon",
            },
            $P = {
              x: $x.x,
              y: $x.y,
              size:
                1.5 * $x.size * (1 + ($x.radiant > 0 ? 0.2 * $x.radiant : 0)) +
                200,
              object: $x,
              type: "bullet",
              str: "polygons",
            };
          x.push($S),
            T.push($P),
            $x.removeTime++,
            $x.removeTime >= 600 * dimension.tickRate &&
              $x.health >= $x.maxHealth &&
              $x.remove();
        }
        for (let $D = $.walls.length - 1; $D >= 0; $D--) {
          let $j = $.walls[$D];
          if (!$j || ($j[5] && $j[5].noHitBox)) continue;
          let $W = {
            x: $j[0],
            y: $j[1],
            w: $j[2],
            h: $j[3],
            type: "wall",
            rectangular: !0,
            object: { team: $j[4] || -1 },
            noInvincibility: !!$j[5] && $j[5].noInvincibility,
          };
          x.push($W);
        }
        for (let $B = $.gates.length - 1; $B >= 0; $B--) {
          let $M = $.gates[$B],
            $C,
            $I;
          0 === $M[3] || 2 === $M[3]
            ? (($C = 30), ($I = $M[4]))
            : (($C = $M[4]), ($I = 30));
          let $8 = {
            gateType: $M[0],
            x: $M[1],
            y: $M[2],
            d: $M[3],
            noClip: !0,
            object: $M,
            w: $C,
            h: $I,
            type: "gate",
            rectangular: !0,
          };
          x.push($8);
        }
        for (let $N in $.wormholes) {
          let $9 = $.wormholes[$N];
          if ($9.type < 2) {
            let $R = Object.keys($9._objects).length + 1;
            if (
              ($9.time < 10
                ? ($9.time -= 0.01 * dimension.tickMultiplier)
                : ($9.time -= 0.01 * dimension.tickMultiplier * (1 + $R)),
              $9.time < 0)
            ) {
              let $H = [];
              for (let $F in $9._objects) {
                let $O = $9._objects[$F];
                $9.action($O), $O.celestial && $H.push($O);
              }
              if ("sanctuary" === $.type && $H.length >= 6)
                for (let $U = $H.length - 1; $U >= 0; $U--) {
                  let $A = $H[$U],
                    $Y = $A.ws.accountData;
                  $Y &&
                    setTimeout(function () {
                      let $ = ($Y.achievements[14] = createAchievement(14));
                      sendAchievement(
                        { ws: { accountName: $A.ws.accountName }, dim: $A.dim },
                        $
                      );
                    }, 5e3);
                }
              $9.remove();
              continue;
            }
            $9.time < 10 &&
              (($9.fadeTime = (10 - $9.time) / 10),
              ($.fadeTimeChanges[$9.id] = $9));
          } else $9.time = 0;
          let $E = {
            x: $9.x,
            y: $9.y,
            object: $9,
            objects: {},
            size: $9.size,
            type: "wormhole",
          };
          ($9._objects = {}), x.push($E);
        }
        for (let $L = x.length - 1; $L >= 0; $L--) {
          let $X = x[$L],
            $q = $X.object;
          "tank" === $X.type &&
            (($q.fov.tanks = $.tanks),
            ($q.fov.bullets = $.bullets),
            ($q.fov.polygons = $.polygons));
        }
        try {
          Detector.detectCollisions(
            x,
            function ($, e, t) {
              dimension.collide($, e, t);
            },
            $.mapSize
          );
        } catch ($G) {
          return dimension.antilag();
        }
        if (e.gameUpdate) {
          View.detectCollisions(T, function ($, e, t) {
            if (("fov" === e.type && ([$, e] = [e, $]), "fov" === $.type)) {
              let a = $.fov,
                n = e.object;
              "bullet" === e.type && (a[e.str][n.id] = n);
            }
          });
          for (let $K = P.length - 1; $K >= 0; $K--) {
            let $J = P[$K],
              $V = $J.object;
            ($V.fov.bullets = Object.values($J.fov.bullets)),
              ($V.fov.polygons = Object.values($J.fov.polygons));
          }
        }
        for (let $Q in $.wormholes) {
          let $Z = $.wormholes[$Q],
            e$ = $Z._objects;
          if ($Z.type < 2) {
            let ee = 0;
            for (let et in e$) {
              let ea = e$[et].size;
              (ee += ea * ea * 2),
                !(et in $Z.objects) &&
                  (!$Z.ruptured &&
                    Math.random() < 0.03 + 0.07 * $Z.entries &&
                    ($Z.rupture(), ($.fadeTimeChanges[$Z.id] = $Z)),
                  $Z.entries++);
            }
            ($Z.objects = $Z._objects),
              ee !== $Z.contents &&
                (($Z.contents = ee),
                ($Z.size = Math.sqrt($Z.defaultSize + ee)),
                ($.resizedWormholes[$Z.id] = $Z));
          } else {
            for (let en in e$) {
              let ei = e$[en];
              $Z.action(ei),
                en in $Z.objects ||
                  !(ei.team >= 0) ||
                  (($Z.color = ei.team),
                  ($Z.radiant = ei.radiant || 0),
                  ($.updatedPortals[$Z.id] = $Z));
            }
            $Z.objects = $Z._objects;
          }
        }
        for (let el = $.bullets.length - 1; el >= 0; el--) {
          let e_ = $.bullets[el],
            es = e_.parent;
          if (
            (dimension.confine(
              e_,
              $.mapSize -
                (e_.size < 2 * dimension.clipSize
                  ? e_.size / 2
                  : e_.size - dimension.clipSize),
              $.mapSizeSpeed > 0
                ? $.mapSize > $._mapSize
                  ? $.mapSizeSpeed
                  : -$.mapSizeSpeed
                : 0
            ),
            2 === e_.type || 4 === e_.type)
          ) {
            let eo = dimension.tickMultiplier * e_.speed * 0.05,
              er = 1,
              ed = [es.x, es.y],
              e3 = !1;
            (e_.target = !1),
              es.firing || es.droneControl
                ? ((ed = es.mousePosition),
                  (e3 = !0),
                  es.droneControl && (eo = -eo))
                : !1 == es.passive &&
                  es.detector &&
                  (es.detector.closestObject
                    ? ((e_.target = es.detector.closestObject),
                      (ed = [e_.target.x, e_.target.y]),
                      (e3 = !0))
                    : (e_.target = !1));
            let ec;
            if (eo >= 0) {
              if (
                ((ec = Math.atan2(e_.x - ed[0], ed[1] - e_.y)),
                4 === e_.type && e3 && 2 !== e_.visualType)
              ) {
                let eu = [e_.x - ed[0], e_.y - ed[1]];
                (eu =
                  Math.sqrt(eu[0] * eu[0] + eu[1] * eu[1]) -
                  e_.size -
                  (e_.target ? e_.target.size : 0)) <
                  ((es.size + 0.5 * e_.size) * (es.firing ? 2.5 : 0.5) +
                    e_.size) *
                    (e_.parent.fovMultiplier || 1) && (er = -1);
              }
            } else (ec = Math.atan2(ed[0] - e_.x, e_.y - ed[1])), (eo = -eo);
            if (e_.timeExisted < 1.5) {
              let em = 10 * (1 - e_.timeExisted / 1.5);
              e_.d = dimension.averageAngles(e_.d, ec, em);
            } else e_.d = ec;
            (eo *= 2 === e_.type ? 1 : 0.8),
              (e_.xv += -dimension.tickMultiplier * Math.sin(e_.d) * eo * er),
              (e_.yv += dimension.tickMultiplier * Math.cos(e_.d) * eo * er);
          }
          if (3 === e_.type || 4 === e_.type) {
            for (let ep = 0, ef = e_._barrels.length; ep < ef; ep++) {
              let e0 = e_._barrels[ep];
              if (6 === e0.data.type || 7 === e0.data.type || e0.data.type >= 9)
                continue;
              e0.current += 0.01 * dimension.tickMultiplier;
              let e1 =
                  (0.5 * e0.data.reload * (1 - es.upgrades[3] / 30)) /
                  e_.parent.sReload,
                eg;
              if (
                (2 === e0.data.type || 4 === e0.data.type
                  ? (eg = !(
                      e0.bullets.length >=
                      e0.data.drones * (1 + es.upgrades[0] / 30)
                    ))
                  : ((eg =
                      4 === e_.type
                        ? es.firing ||
                          es.droneControl ||
                          (!es.passive && e_.target)
                        : !es.passive),
                    e0.turret && !e0.turret.active && (eg = !1)),
                eg)
              ) {
                if (e0.current >= e1) {
                  e1
                    ? ((e0.current -= e1),
                      e0.current >= e1 && (e0.current = e0.current % e1))
                    : (e0.current = 0),
                    (1 === e0.data.type || 3 === e0.data.type) &&
                      e0.bullets.length > e0.maxTraps &&
                      e0.bullets[0].remove();
                  let ey = (e0.turret ? e0.turret.d : e_.d) + e0.data.d,
                    eh = e_.x,
                    e4 = e_.y,
                    ek = -e0.data.x,
                    e2 = -e0.data.y + e0.data.height,
                    ev = Math.sin(ey),
                    eb = Math.cos(ey),
                    e5 = dimension.getBulletSpeed(e0.data, e_.parent),
                    ew = e_.parent,
                    [e7, e6] = dimension.getBulletData(e0.data.type, e_.parent),
                    ex = e0.data.relativeSizeS * ew.size,
                    eT =
                      (e0.data.relativeSizeS || e0.data.relativeSize) *
                      e0.data.width;
                  if (8 === e0.data.type) {
                    let ez = generator.polygon({
                      x: eh + ex * (eb * ek - ev * e2),
                      y: e4 + ex * (eb * e2 + ev * ek),
                      d: ey,
                      sides: 3,
                      dim: ew.dim,
                      radiant: 1,
                    });
                    (ez.xv = -ev * e5), (ez.yv = eb * e5);
                  } else {
                    let eS = ev,
                      eP = eb;
                    e0.data.spread &&
                      ((ey +=
                        ((Math.random() - 0.5) * e0.data.spread * Math.PI) %
                        (2 * Math.PI)),
                      (eS = Math.sin(ey)),
                      (eP = Math.cos(ey))),
                      generator.bullet({
                        dim: $,
                        parent: ew,
                        sparent: e_,
                        barrelId: e0.id,
                        size: eT,
                        d: ey,
                        damage:
                          (1 + ew.upgrades[2] / 22.5) *
                          ew.sBulletDamage *
                          (1 + ew.upgrades[1] / 60),
                        health:
                          e0.data.penetration *
                          e6 *
                          (1 + ew.upgrades[0] / 17.6),
                        lifeTime: e0.data.time * e7,
                        x: eh + ex * (eb * ek - ev * e2),
                        y: e4 + ex * (eb * e2 + ev * ek),
                        xv: -eS * e5,
                        yv: eP * e5,
                        speed: e5,
                        barrel: e0,
                      });
                  }
                  if (e0.data.recoil) {
                    let eD =
                      0.6 *
                      e0.data.recoil *
                      eT *
                      eT *
                      (1 + ew.upgrades[1] / 30);
                    (e_.xv += eD * ev), (e_.yv -= eD * eb);
                  }
                }
              } else {
                let ej = e1 * (1 - e0.data.delay);
                e0.current > ej && (e0.current = ej);
              }
            }
            if (e_.auras)
              for (let eW = 0, eB = e_.auras.length; eW < eB; eW++) {
                let eM = e_.auras[eW],
                  eC =
                    (1 + es.upgrades[3] / 15) *
                    es.sReload *
                    (1 + es.upgrades[2] / 15) *
                    es.sBulletDamage *
                    (1 + es.upgrades[0] / 15);
                if (
                  eM.detector &&
                  !1 === es.passive &&
                  eM.detector &&
                  eM.detector.objects
                ) {
                  if (0 === eM.type)
                    for (
                      let eI = eM.detector.objects.length - 1;
                      eI >= 0;
                      eI--
                    ) {
                      let e8 = eM.detector.objects[eI];
                      if (!(e8.invincible || e8.inBase || e8.prevInBase)) {
                        let eN = 2 * e8.size,
                          e9 = eM.detector.distances[eI] + eN,
                          eR = e9 < 0 ? 1 : (1 - e9 / eN) * 0.5 + 0.5;
                        e8.damage(
                          dimension.tickMultiplier *
                            eR *
                            eC *
                            eM.auraDamage *
                            5 *
                            es.levelMultiplier,
                          es,
                          "tanks"
                        );
                      }
                    }
                  else if (1 === eM.type && eM.healing)
                    for (let eH = eM.detector.objects.length - 1; eH >= 0; eH--)
                      eM.detector.objects[eH].regen +=
                        (eM.healing - 1) *
                        (1 + es.upgrades[3] / 20) *
                        es.sReload *
                        0.1 *
                        (1 + es.upgrades[6] / 15);
                  else if (2 === eM.type && eM.auraPull)
                    for (
                      let eF = eM.detector.objects.length - 1;
                      eF >= 0;
                      eF--
                    ) {
                      let eO = eM.detector.objects[eF];
                      if (!(eO.invincible || eO.inBase || eO.prevInBase)) {
                        let eU = eO.x - eM.gameX,
                          eA = eO.y - eM.gameY,
                          eY = Math.sqrt(eU * eU + eA * eA),
                          eE =
                            (0.3 * eM.auraPull * (e_.size * es.weight)) /
                            (eO.size * (eO.weight || 1));
                        (eY = eY < 1 ? eE : eE / eY),
                          (eO.xv -= eU * eY),
                          (eO.yv -= eA * eY);
                      }
                    }
                }
              }
          }
          if (e_.turrets && e_.turrets[0])
            for (let eL = 0, eX = e_.turrets.length; eL < eX; eL++) {
              let eq = e_.turrets[eL];
              dimension.updateTurret(eq, e_, es);
            }
        }
        for (let eG = $.tanks.length - 1; eG >= 0; eG--) {
          let eK = $.tanks[eG];
          dimension.confine(
            eK,
            $.mapSize -
              (eK.size < 2 * dimension.clipSize
                ? eK.size / 2
                : eK.size - dimension.clipSize),
            $.mapSizeSpeed > 0
              ? $.mapSize > $._mapSize
                ? $.mapSizeSpeed
                : -$.mapSizeSpeed
              : 0
          ),
            (eK.prevInBase = eK.inBase),
            (eK.inBase = !1);
          let eJ = !1;
          if (
            (eK.detector &&
              eK.detector.closestObject &&
              (eJ = eK.detector.closestObject),
            "peacekeeper" === eK.ai)
          ) {
            let eV = eK.detector.closestTank;
            if (eV && (eV.x >= 0 || eV.x <= 0) && (eV.y >= 0 || eV.y <= 0)) {
              eK.mousePosition = [eV.x, eV.y];
              let eQ = [eV.x - eK.x, eV.y - eK.y];
              eK.controlPosition = [eQ[0], eQ[1]];
              let eZ = Math.sqrt(eQ[0] * eQ[0] + eQ[1] * eQ[1]) || 1;
              eZ < eV.size + eK.size + 100 && !eK.aiRam && (eZ = -eZ),
                (eK.input.movement = [eQ[0] / eZ, eQ[1] / eZ]),
                (eK.firing = !0);
              let t$ = eK.dim.bodies[eK.body];
              (t$ = t$ && t$.celestial ? Math.PI : 0),
                (eK.d = Math.atan2(-eQ[0], eQ[1]) + t$);
            } else {
              let te = -Math.sin(eK.d),
                tt = Math.cos(eK.d);
              (eK.mousePosition = [0, 0]),
                (eK.controlPosition = [0, 0]),
                (eK.input.movement = [te, tt]),
                (eK.firing = !1),
                e.gameUpdate &&
                  0.01 > Math.random() &&
                  (eK.d = 2 * Math.random() * Math.PI);
            }
            (eK.droneControl = !1), eK.aiRam && (eK.firing = !0);
          } else if ("fallen" === eK.ai) {
            eK.passive = !1;
            let ta = tankData.bodyUpgradeMap[eK.body],
              tn = tankData.weaponUpgradeMap[eK.weapon];
            if (tn && eK.level >= tn.level) {
              let ti =
                tn.upgrades[Math.floor(Math.random() * tn.upgrades.length)];
              eK.removeBullets(),
                generator.setTankWeapon(eK, ti),
                (eK.firedBarrels = {}),
                generator.updateTank(eK),
                eK.update(),
                (eK.dim.updatedTanks[eK.id] = eK);
            }
            if (ta && eK.level >= ta.level) {
              let tl =
                ta.upgrades[Math.floor(Math.random() * ta.upgrades.length)];
              eK.removeBullets(),
                generator.setTankBody(eK, tl),
                (eK.firedBarrels = {}),
                generator.updateTank(eK),
                eK.update(),
                (eK.dim.updatedTanks[eK.id] = eK);
            }
            if (eK.upgradeCount < 120 && eK.upgradeCount < eK.level - 1) {
              eK.upgradeCount++;
              let t_ = [];
              for (let ts = 0; ts < 8; ts++)
                eK.upgrades[ts] < 15 && t_.push(ts);
              eK.upgrades[t_[Math.floor(Math.random() * t_.length)]]++;
            }
            let to = !1;
            if (
              (eK.health < 0.5 * eK.maxHealth &&
                eK.detector.closestTank &&
                ((eJ = eK.detector.closestTank), (to = !0)),
              !eK.aiRam &&
                eK.health < 0.75 * eK.maxHealth &&
                eK.detector.closestBulletDistance < 200 &&
                eK.detector.closestBullet &&
                ((eJ = eK.detector.closestBullet), (to = !0)),
              eJ && (eJ.x >= 0 || eJ.x <= 0) && (eJ.y >= 0 || eJ.y <= 0))
            ) {
              eK.mousePosition = [eJ.x, eJ.y];
              let tr = [eJ.x - eK.x, eJ.y - eK.y];
              eK.controlPosition = [tr[0], tr[1]];
              let td = Math.sqrt(tr[0] * tr[0] + tr[1] * tr[1]) || 1;
              (td < eJ.size + eK.size + 100 || to) && !eK.aiRam && (td = -td),
                (eK.input.movement = [tr[0] / td, tr[1] / td]),
                (eK.firing = !0);
              let t3 = eK.dim.bodies[eK.body];
              (t3 = t3 && t3.celestial ? Math.PI : 0),
                (eK.d = Math.atan2(-tr[0], tr[1]) + t3);
            } else {
              let tc = -Math.sin(eK.d),
                tu = Math.cos(eK.d);
              (eK.mousePosition = [0, 0]),
                (eK.controlPosition = [0, 0]),
                eK.aiRam
                  ? ((eK.input.movement = [0.3 * tc, 0.3 * tu]),
                    (eK.d += 0.01),
                    eK.d > 2 * Math.PI && (eK.d -= 2 * Math.PI))
                  : ((eK.input.movement = [tc, tu]),
                    (eK.firing = !1),
                    e.gameUpdate &&
                      0.01 > Math.random() &&
                      (eK.d = 2 * Math.random() * Math.PI));
            }
            (eK.droneControl = !1), eK.aiRam && (eK.firing = !0);
          }
          for (let tm = 0, tp = eK._turrets.length; tm < tp; tm++) {
            let tf = eK._turrets[tm];
            dimension.updateTurret(tf, eK, eK);
          }
          for (let t0 = 0, t1 = eK.auras.length; t0 < t1; t0++) {
            let tg = eK.auras[t0],
              ty =
                (1 + eK.upgrades[3] / 15) *
                eK.sReload *
                (1 + eK.upgrades[2] / 15) *
                eK.sBulletDamage *
                (1 + eK.upgrades[0] / 15);
            if (
              tg.detector &&
              !1 === eK.passive &&
              tg.detector &&
              tg.detector.objects
            ) {
              if (0 === tg.type)
                for (let th = tg.detector.objects.length - 1; th >= 0; th--) {
                  let t4 = tg.detector.objects[th];
                  if (!(t4.invincible || t4.inBase || t4.prevInBase)) {
                    let tk = 2 * t4.size,
                      t2 = tg.detector.distances[th] + tk,
                      tv = t2 < 0 ? 1 : (1 - t2 / tk) * 0.5 + 0.5;
                    t4.damage(
                      dimension.tickMultiplier *
                        tv *
                        ty *
                        tg.auraDamage *
                        5 *
                        eK.levelMultiplier,
                      eK,
                      "tanks"
                    );
                  }
                }
              else if (1 === tg.type && tg.healing)
                for (let tb = tg.detector.objects.length - 1; tb >= 0; tb--)
                  tg.detector.objects[tb].regen +=
                    tg.healing *
                      (1 + eK.upgrades[3] / 20) *
                      eK.sReload *
                      0.7 *
                      (1 + eK.upgrades[6] / 15) -
                    0.5;
              else if (2 === tg.type && tg.auraPull)
                for (let t5 = tg.detector.objects.length - 1; t5 >= 0; t5--) {
                  let tw = tg.detector.objects[t5];
                  if (!(tw.invincible || tw.inBase || tw.prevInBase)) {
                    let t7 = tw.x - tg.gameX,
                      t6 = tw.y - tg.gameY,
                      tx = Math.sqrt(t7 * t7 + t6 * t6),
                      tT =
                        (0.3 * tg.auraPull * (eK.size * eK.weight)) /
                        (tw.size * (tw.weight || 1));
                    (tx = tx < 1 ? tT : tT / tx),
                      (tw.xv -= t7 * tx),
                      (tw.yv -= t6 * tx);
                  }
                }
            }
          }
          for (let tz = 0, tS = eK._barrels.length; tz < tS; tz++) {
            let tP = eK._barrels[tz];
            if (
              6 === tP.data.type ||
              7 === tP.data.type ||
              tP.data.type >= 9 ||
              tP.child
            )
              continue;
            tP.current += 0.01 * dimension.tickMultiplier;
            let tD =
                (0.5 * tP.data.reload * (1 - eK.upgrades[3] / 30)) / eK.sReload,
              tj = eK.firing;
            if (
              (tP.turret &&
                (tj = !!tP.turret.detector.closest && tP.turret.active),
              (2 === tP.data.type || 4 === tP.data.type) &&
                (tj =
                  !(
                    tP.bullets.length >=
                    tP.data.drones * (1 + eK.upgrades[0] / 30)
                  ) &&
                  (!eK.passive || eK.firing)),
              tj)
            ) {
              if (tP.current >= tD) {
                tD
                  ? ((tP.current -= tD),
                    tP.current >= tD && (tP.current = tP.current % tD))
                  : (tP.current = 0),
                  (1 === tP.data.type || 3 === tP.data.type) &&
                    tP.bullets.length > tP.maxTraps &&
                    tP.bullets[0].remove();
                let tW = (tP.turret ? tP.turret.d : eK.d) + tP.data.d,
                  tB = tP.turret ? tP.turret.gameX : eK.x,
                  tM = tP.turret ? tP.turret.gameY : eK.y,
                  tC = Math.sin(tW),
                  tI = Math.cos(tW),
                  t8 = -tP.data.x,
                  tN = -tP.data.y + 2 * tP.data.height,
                  t9 = dimension.getBulletSpeed(tP.data, eK),
                  [tR, tH] = dimension.getBulletData(tP.data.type, eK),
                  tF = tP.data.relativeSize * eK.size;
                eK.firedBarrels[tz] = tz;
                let tO =
                  (tP.data.relativeSizeS || tP.data.relativeSize) *
                  tP.data.width;
                if (8 === tP.data.type) {
                  let tU = generator.polygon({
                    x: tB + tF * (tI * t8 - tC * tN),
                    y: tM + tF * (tI * tN + tC * t8),
                    d: tW,
                    sides: tP.data.polygonSides,
                    dim: eK.dim,
                    radiant: 1 + eK.radiant,
                  });
                  (tU.xv = -tC * t9 * 5), (tU.yv = tI * t9 * 5);
                } else {
                  let tA = tC,
                    tY = tI;
                  tP.data.spread &&
                    ((tW +=
                      ((Math.random() - 0.5) * tP.data.spread * Math.PI) %
                      (2 * Math.PI)),
                    (tA = Math.sin(tW)),
                    (tY = Math.cos(tW))),
                    generator.bullet({
                      dim: $,
                      parent: eK,
                      barrelId: tz,
                      size: tO,
                      d: tW,
                      damage:
                        (1 + eK.upgrades[2] / 22.5) *
                        eK.sBulletDamage *
                        (1 + eK.upgrades[1] / 60),
                      health:
                        tP.data.penetration * tH * (1 + eK.upgrades[0] / 17.6),
                      lifeTime: tP.data.time * tR,
                      x: tB + tF * (tI * t8 - tC * tN),
                      y: tM + tF * (tI * tN + tC * t8),
                      xv: -tA * t9,
                      yv: tY * t9,
                      speed: t9,
                      barrel: tP,
                    });
                }
                if (tP.data.recoil && !eK.static) {
                  let tE =
                    0.6 * tP.data.recoil * tO * (1 + eK.upgrades[1] / 30);
                  (eK.xv += tE * tC), (eK.yv -= tE * tI);
                }
              }
            } else {
              let tL = tD * (1 - tP.data.delay);
              tP.current > tL && (tP.current = tL);
            }
          }
          if (eK.health <= 0) {
            logEvent(
              "killedTank",
              `team:${eK.team}`,
              `score:${Math.round(eK.score)}`,
              `name:${eK.name}`,
              `weapon:${eK.weapon}`,
              `body:${eK.body}`
            );
            let tX = !0,
              tq = !0,
              tG = {},
              tK = {};
            for (let tJ = eK.dim.tanks.length - 1; tJ >= 0; tJ--) {
              let tV = eK.dim.tanks[tJ];
              tG[tV.id] = tV;
            }
            for (let tQ = eK.dim.polygons.length - 1; tQ >= 0; tQ--) {
              let tZ = eK.dim.polygons[tQ];
              tK[tZ.id] = tZ;
            }
            if (
              (eK.onDeath &&
                eK.onDeath({
                  tank: eK,
                  preventDefault: function () {
                    tX = !1;
                  },
                  preventRemove: function () {
                    tq = !1;
                  },
                  dimTanks: tG,
                  dimPolygons: tK,
                }),
              eK.dim.onDeath &&
                eK.dim.onDeath({
                  tank: eK,
                  preventDefault: function () {
                    tX = !1;
                  },
                  preventRemove: function () {
                    tq = !1;
                  },
                  dimTanks: tG,
                  dimPolygons: tK,
                }),
              tX)
            ) {
              tq && eK.remove(),
                eK.noKillNotification ||
                  console.log(
                    "killedTank",
                    `name:${eK.name} score:${eK.score} dim:${eK.dim.name}`
                  );
              let a$ = eK.score;
              eK.forceDeathScore >= 0 && (a$ = eK.forceDeathScore);
              let ae = 0,
                at = a$ * dimension.getRadiantMultiplier(eK.radiant) * 0.9,
                aa = {},
                an = {},
                ai = [],
                al = {},
                a_ = 0;
              for (let as in eK.finalDamage.tanks) {
                let ao = tG[as];
                if (ao && !ao.static) {
                  let ar = eK.finalDamage.tanks[as],
                    ad = 0;
                  for (let a3 = 0; a3 < 16; a3++) ad += ar[a3];
                  (aa[as] = ad),
                    ai.push(ao.name),
                    (al[as] = a_),
                    a_++,
                    (ae += ad);
                }
              }
              for (let ac in eK.finalDamage.polygons) {
                let au = tK[ac];
                if (au) {
                  let am = eK.finalDamage.polygons[ac],
                    ap = 0;
                  for (let af = 0; af < 16; af++) ap += am[af];
                  (an[ac] = ap),
                    ai.push(dimension.getFullPolygonName(au)),
                    (ae += ap);
                }
              }
              let a0 = gameEnd(eK),
                a1 = a0 ? a0.timeAlive : 250,
                ag = [!1, 0];
              for (let ay in aa) {
                let ah = aa[ay] / ae,
                  a4 = tG[ay],
                  ak = a4.score > 1 ? eK.score / a4.score : eK.score,
                  a2 =
                    ah *
                    at *
                    (ak =
                      ak <= 0
                        ? 0.25
                        : Math.atan(0.75 * Math.log(ak) + 1) / (2 * Math.PI) +
                          0.5);
                if (a2) {
                  if (
                    (ah > ag[1] && ((ag[1] = ah), (ag[0] = a4)),
                    (at -= a2),
                    (a4.score += a2),
                    a4.ws.accountData && eK.score >= 1)
                  ) {
                    let av = Math.log(eK.score);
                    (av =
                      (av * av) / 10 -
                      10 -
                      (a4.score >= 1 ? Math.log(a4.score) / 2 : 0)),
                      (av *= (1.2 * ah * a1) / (a1 + 100)) > 0 &&
                        (a4.ws.accountData.stars += av);
                  }
                  if (
                    ($.skinwalkers &&
                      (a4.removeBullets(),
                      generator.setTankWeapon(a4, eK.weapon),
                      generator.setTankBody(a4, eK.body),
                      (a4.firedBarrels = {}),
                      generator.updateTank(a4),
                      (a4.dim.updatedTanks[a4.id] = a4)),
                    a4.update(),
                    a4.ws.sendPacket && !eK.noKillNotification)
                  ) {
                    let ab = al[ay],
                      a5 = ai.slice(0, ab).concat(ai.slice(ab + 1)),
                      aw = a5.length;
                    0 === aw
                      ? a4.ws.sendPacket(
                          "announcement",
                          `You killed ${eK.name}.`
                        )
                      : 1 === aw
                      ? a4.ws.sendPacket(
                          "announcement",
                          `You and ${a5[0]} killed ${eK.name}.`
                        )
                      : a4.ws.sendPacket(
                          "announcement",
                          `You, ${a5.slice(0, aw - 1).join(", ")}, and ${
                            a5[aw - 1]
                          } killed ${eK.name}.`
                        );
                  }
                }
              }
              if (ag[0] && ag[0].ws && ag[0].ws.accountData && !$.sandbox) {
                let a7 = ag[0].ws.accountData;
                if (
                  eK &&
                  (eK.celestial
                    ? (a7.celestialKills++,
                      args.parentPort.postMessage([
                        "kill",
                        [ag[0].ws.accountName, "celestialKills"],
                      ]))
                    : (a7.tankKills++,
                      args.parentPort.postMessage([
                        "kill",
                        [ag[0].ws.accountName, "tankKills"],
                      ])),
                  !a7.achievements[0])
                ) {
                  let a6 = (a7.achievements[0] = createAchievement(0));
                  sendAchievement(ag[0], a6);
                }
              }
              for (let ax in an) {
                let aT = an[ax] / ae,
                  az = tK[ax],
                  aS =
                    1.5 *
                    (az.radiant < 1 ? 1 : 12 * Math.pow(4, az.radiant - 1)),
                  aP = aT * at * 0.75;
                aP && ((at -= aP), (az.score += aP / aS), az.update());
              }
              if (
                (eK.ws &&
                  eK.ws.data.isPlayer &&
                  eK.name &&
                  createMessage(
                    "1210052935728369665",
                    "`" +
                      eK.name.replaceAll("`", "") +
                      " died to " +
                      ai.join(", ") +
                      "`"
                  ),
                eK.ws.sendPacket && tq)
              ) {
                let aD = Math.round(at);
                eK.dim.forceRespawnScore >= 0 &&
                  (aD = eK.dim.forceRespawnScore),
                  (eK.ws.data.respawnScore = aD),
                  eK.ws.data.isPlayer &&
                    (eK.ws.data.uid >= 0 || args.standalone) &&
                    (args.standalone
                      ? (console.log("death", [ai, aD]),
                        eK.ws.sendPacket("death", [ai, aD]))
                      : ((eK.ws.data.ready = !1),
                        args.parentPort.postMessage([
                          "death",
                          [eK.ws.data.uid, aD, [ai, aD], eK.ws.data.lastTeam],
                        ])));
              }
            }
          }
        }
        $.polygons.length < $.maxPolygonCount &&
        !$.noPolygons &&
        $.maxPolygonSides >= 3
          ? spawnPolygon($)
          : $.polygons.length > 2 * $.maxPolygonCount &&
            $.polygons[0] &&
            $.polygons[0].remove();
        for (let aj = $.polygons.length - 1; aj >= 0; aj--) {
          let aW = $.polygons[aj];
          if (
            (dimension.confine(
              aW,
              $.mapSize -
                (aW.size < 2 * dimension.clipSize
                  ? aW.size / 2
                  : aW.size - dimension.clipSize),
              $.mapSizeSpeed > 0
                ? $.mapSize > $._mapSize
                  ? $.mapSizeSpeed
                  : -$.mapSizeSpeed
                : 0
            ),
            aW.health <= 0)
          ) {
            let aB = 0,
              aM = aW.score * dimension.getRadiantMultiplier(aW.radiant),
              aC = aM >= 1e8 || aW.radiant > 3,
              aI = {},
              a8 = [],
              aN = {},
              a9 = {},
              aR = dimension.getFullPolygonName(aW);
            for (let aH = aW.dim.tanks.length - 1; aH >= 0; aH--) {
              let aF = aW.dim.tanks[aH];
              a9[aF.id] = aF;
            }
            let aO = 0;
            for (let aU in aW.finalDamage.tanks) {
              let aA = a9[aU];
              if (aA && !aA.static) {
                let aY = aW.finalDamage.tanks[aU],
                  aE = 0;
                for (let aL = 0; aL < 16; aL++) aE += aY[aL];
                (aI[aU] = aE),
                  a8.push(aA.name),
                  (aN[aU] = aO),
                  aO++,
                  (aB += aE);
              }
            }
            let aX = [!1, 0],
              aq = 0;
            for (let aG in aI) {
              let aK = aI[aG] / aB,
                aJ = a9[aG],
                aV = aK * aM;
              if (aV) {
                if (
                  (aK > aX[1] && ((aX[1] = aK), (aX[0] = aJ)),
                  aq++,
                  aJ.ws && aJ.ws.accountData)
                ) {
                  let aQ = aJ.ws.accountData;
                  if (aK < 0.1 && !aQ.achievements[2]) {
                    let aZ = (aQ.achievements[2] = createAchievement(2));
                    sendAchievement(aJ, aZ);
                  }
                  let n$ = ~~aW.sides,
                    ne = ~~aW.radiant;
                  if ((ne < 0 && (ne = 0), n$ >= 3)) {
                    let nt =
                      (Math.pow(3, n$ - 3) / 1500) *
                      Math.pow(Math.pow(n$, 1 / 3) - 0.7, ne);
                    (nt *= aK) > 0 && (aJ.ws.accountData.stars += nt);
                  } else if (n$ <= -1 && n$ >= -5) {
                    let na = 50 * Math.pow(1.2, -n$) * Math.pow(1 - n$, ne);
                    (na *= aK) > 0 && (aJ.ws.accountData.stars += na);
                  }
                }
                if (
                  ((aJ.score += aV),
                  aV > 1e6 &&
                    aJ.ws &&
                    aJ.ws.accountData &&
                    ((aJ.ws.accountData.ohNode = !1),
                    (aJ.ws.accountData.classic = !1)),
                  aJ.update(),
                  aJ.ws.sendPacket && aC)
                ) {
                  let nn = aN[aG],
                    ni = a8.slice(0, nn).concat(a8.slice(nn + 1)),
                    nl = ni.length;
                  0 === nl
                    ? aJ.ws.sendPacket("announcement", `You killed ${aR}.`)
                    : 1 === nl
                    ? aJ.ws.sendPacket(
                        "announcement",
                        `You and ${ni[0]} killed ${aR}.`
                      )
                    : aJ.ws.sendPacket(
                        "announcement",
                        `You, ${ni.slice(0, nl - 1).join(", ")}, and ${
                          ni[nl - 1]
                        } killed ${aR}.`
                      );
                }
              }
            }
            if (
              aW.o &&
              aX[0] &&
              aX[0].ws &&
              aX[0].ws.accountData &&
              !$.sandbox
            ) {
              let n_ = aX[0].ws.accountData;
              n_.polygonKills++;
              let ns = aW.o[0],
                no = aW.o[1];
              if (
                ns === ~~ns &&
                no >= 0 &&
                no <= 20 &&
                no === ~~no &&
                ((ns <= -1 && ns >= -5) || (ns >= 3 && ns <= 17))
              ) {
                let nr = ns < 0 ? -ns - 1 : ns + 2,
                  nd = n_.gallery[nr] || 0,
                  n3 = 1 << no;
                nd & n3 ||
                  ((nd |= n3),
                  (n_.gallery[nr] = nd),
                  console.log(no, ns),
                  aX[0].ws.sendPacket(
                    "announcement",
                    `New Polygon Discovered: ${dimension.getFullPolygonName(
                      { sides: ns, radiant: no },
                      !0
                    )}`
                  ),
                  args.parentPort.postMessage([
                    "updateGallery",
                    [aX[0].ws.accountName, ns, no],
                  ]));
              }
              if (aW.radiant > 0) {
                if (
                  (n_.radiantPolygonKills++,
                  args.parentPort.postMessage([
                    "polygon",
                    [aX[0].ws.accountName, !0],
                  ]),
                  !n_.achievements[6] && aX[0].dim.isMain)
                ) {
                  let nc = (n_.achievements[6] = createAchievement(6));
                  sendAchievement(aX[0], nc);
                }
                if (aW.radiant >= 4 && !n_.achievements[18]) {
                  let nu = (n_.achievements[18] = createAchievement(18));
                  sendAchievement(aX[0], nu);
                }
              } else
                args.parentPort.postMessage([
                  "polygon",
                  [aX[0].ws.accountName],
                ]);
              if (1 === aq && aW.sides >= 10 && !n_.achievements[1]) {
                let nm = (n_.achievements[1] = createAchievement(1));
                sendAchievement(aX[0], nm);
              }
              if (aW.sides >= 13 && !n_.achievements[9]) {
                let np = (n_.achievements[9] = createAchievement(9));
                sendAchievement(aX[0], np);
              }
            }
            aW.remove();
          }
        }
        if (e.gameUpdate) {
          for (let nf = $.gates.length - 1; nf >= 0; nf--) {
            let n0 = $.gates[nf];
            n0[5] !== n0[7] &&
              ((n0[7] = n0[5]), ($.updatedGates[nf] = [nf, n0[5]]));
          }
          let n1 = dimension.leaderboard($);
          if (j >= 13 && n1[0] && "tank" === n1[0].objectType) {
            let ng = n1[0],
              ny = ng.ws.accountData;
            if (
              ny &&
              ((ny.monarchTime += 0.1),
              ny.monarchTime >= 1200 && !ny.achievements[12])
            ) {
              let nh = (ny.achievements[12] = createAchievement(12));
              sendAchievement(ng, nh);
            }
          }
          let n4 = [],
            nk = {};
          for (let n2 = 0; n2 < 8; n2++) {
            let nv = n1[n2],
              nb;
            nb = nv
              ? {
                  place: n2,
                  id: nv.id,
                  type: "tank" === nv.objectType ? 1 : 0,
                  score: Math.round(nv.score),
                  sides: nv.sides,
                  radiant: nv.radiant,
                }
              : {
                  place: n2,
                  id: -n2 - 1,
                  type: 0,
                  score: 1,
                  sides: 0,
                  radiant: 0,
                };
            let n5 = $.leaderboard[n2];
            n5 &&
              (n5.id !== nb.id ||
                Math.round(n5.score) !== nb.score ||
                n5.type !== nb.type ||
                n5.radiant !== nb.radiant) &&
              (nk[n2] = nb),
              n4.push(nb);
          }
          $.leaderboard = n4;
          let nw = [];
          for (let n7 in nk) {
            let n6 = nk[n7];
            nw.push([
              n7,
              n6.id,
              n6.type ? 0 : [n6.sides, n6.radiant],
              Math.round(n6.score),
            ]);
          }
          $.leaderboardChanges = nw;
        }
        let nx = _performance.now() - a;
        $.dt += nx;
      },
      leaderboard: function ($) {
        let e = [];
        for (let t = 0, a = $.polygons.length; t < a; t++) {
          let n = $.polygons[t];
          (n.radiant > 1 ||
            n.score * dimension.getRadiantMultiplier(n.radiant) >= 1e9) &&
            e.push(n);
        }
        let i = $.tanks
            .concat(e)
            .sort(($, e) =>
              $.displayScore === e.displayScore
                ? e.radiant - $.radiant
                : e.displayScore - $.displayScore
            ),
          _ = [],
          s = 0;
        for (
          let o = 0, r = i.length;
          o < r &&
          !(
            !i[o].static &&
            !i[o].invisible &&
            !i[o].hideFromLeaderboard &&
            (_.push(i[o]), ++s >= 10)
          );
          o++
        );
        return _;
      },
    },
    generator = {
      getId: function ($, e) {
        let t = e.ids[$],
          a = t.length;
        if (0 === a) return t.push(0), 0;
        let n = 0;
        for (; t[n] === n && n < a; ) n++;
        return t.splice(n, 0, n), n;
      },
      removeId: function ($, e, t) {
        setTimeout(function () {
          let a = t.ids[$],
            n = a.indexOf(e);
          n >= 0 && a.splice(n, 1);
        }, 5e3);
      },
      updateTank: function ($) {
        $._barrels = [];
        let e = function (t) {
          $._barrels.push(t),
            (1 === t.data.type || 3 === t.data.type) &&
              (t.maxTraps = (12 / t.data.reload) * 3);
          let a =
            t.data.relativeSizeS >= 0
              ? t.data.relativeSizeS * t.data.width
              : t.data.width;
          if (t.data && (3 === t.data.type || 4 === t.data.type)) {
            let n = t.data.bulletWeapon;
            if (n)
              for (let i = 0, _ = n.barrels.length; i < _; i++) {
                let s = n.barrels[i];
                (s.relativeSize = a),
                  (s.relativeSizeS = a * (("size" in s && s.size) || 1)),
                  e({ data: s, child: !0 });
              }
            let o = t.data.bulletBody;
            if (o)
              for (let r = 0, d = o.turrets.length; r < d; r++) {
                let c = o.turrets[r],
                  u = c,
                  m = c.barrels || [];
                for (let p = 0, f = m.length; p < f; p++) {
                  let g = m[p];
                  (g.relativeSize = a * u.size),
                    (g.relativeSizeS =
                      g.relativeSize * (("size" in g && g.size) || 1)),
                    e({ data: g, turret: u, child: !0 });
                }
              }
          }
        };
        for (let t = 0, a = $.barrels.length; t < a; t++) e($.barrels[t]);
        $._turrets = [];
        let n = function (e) {
          $._turrets.push(
            e.count >= 0 ? e : { ...e, count: Math.floor(10 * Math.random()) }
          );
          let t = e.sectionWeapon;
          if (t && t.weaponTurrets)
            for (let a = 0, i = t.weaponTurrets.length; a < i; a++)
              n(t.weaponTurrets[a]);
          let _ = e.sectionBody;
          if (_ && _.turrets)
            for (let s = 0, o = _.turrets.length; s < o; s++) n(_.turrets[s]);
        };
        if ($.weaponTurrets)
          for (let i = 0, _ = $.weaponTurrets.length; i < _; i++)
            n($.weaponTurrets[i]);
        if ($.turrets)
          for (let s = 0, o = $.turrets.length; s < o; s++) n($.turrets[s]);
        for (let r = 0, d = $._turrets.length; r < d; r++) {
          let c = $._turrets[r];
          for (let u = 0, m = c.barrels.length; u < m; u++) e(c.barrels[u]);
        }
        $.removeBullets();
      },
      checkWeaponTurrets: function ($, e, t) {
        let a = [];
        for (let n = 0, i = $.weaponTurrets.length; n < i; n++) {
          let _ = {
            ...$.weaponTurrets[n],
            count: Math.floor(10 * Math.random()),
          };
          (_.gameX = e.x),
            (_.gameY = e.y),
            (_.detector = {}),
            (_.d = 0),
            (_.position = "weaponTurret");
          let s = _.sectionWeapon.barrels || [];
          (_.barrels = []), (_.relativeSize = _.size * t * 0.5);
          for (let o = 0, r = s.length; o < r; o++) {
            let d = s[o];
            (d.relativeSize = 0.5 * _.size),
              (d.relativeSizeS =
                d.relativeSize * (("size" in d && d.size) || 1)),
              _.barrels.push({
                current:
                  0.5 * d.reload * (1 - e.upgrades[3] / 30) * (1 - d.delay) -
                  0.1,
                bullets: [],
                data: d,
                turret: _,
                active: !1,
              });
          }
          if (_) {
            let c = _.sectionWeapon;
            c &&
              ((_.sectionWeapon = { ...c }),
              (_.sectionWeapon.weaponTurrets = generator.checkWeaponTurrets(
                c,
                e,
                1 * _.relativeSize
              )));
            let u = _.sectionBody;
            u &&
              ((_.sectionBody = { ...u }),
              (_.sectionBody.turrets = generator.checkTurrets(
                u,
                e,
                1 * _.relativeSize
              )));
          }
          a.push(_);
        }
        return a;
      },
      setTankWeapon: function ($, e) {
        "node" !== e && $.ws.accountData && ($.ws.accountData.ohNode = !1);
        let t = e;
        if ((e = $.dim.weapons[e])) {
          ($.weapon = t),
            ($.weaponData = e),
            ($.weaponCameraSize = e.cameraSizeMultiplier),
            ($.barrels = []),
            ($.weaponTurrets = []);
          for (let a = 0, n = e.barrels.length; a < n; a++) {
            let i = e.barrels[a];
            (i.relativeSize = 1),
              (i.relativeSizeS = ("size" in i && i.size) || 1),
              $.barrels.push({
                current:
                  0.5 * i.reload * (1 - $.upgrades[3] / 30) * (1 - i.delay) -
                  0.1,
                bullets: [],
                data: i,
              });
          }
          return (
            ($.weaponTurrets = generator.checkWeaponTurrets(e, $, 1)),
            generator.updateTank($),
            !0
          );
        }
      },
      checkTurrets: function ($, e, t, a, n) {
        let i = [];
        a > 0 || (a = 1);
        let _ = 0.5 * t;
        if ($.turrets)
          for (let s = 0, o = $.turrets.length; s < o; s++) {
            let r = { ...$.turrets[s], count: Math.floor(10 * Math.random()) };
            (r.gameX = e.x),
              (r.gameY = e.y),
              (r.detector = {}),
              (r.d = 0),
              (r.position = "turret");
            let d = r.sectionWeapon.barrels || [];
            (r.barrels = []), (r.relativeSize = r.size * _);
            for (let c = 0, u = d.length; c < u; c++) {
              let m = d[c];
              (m.relativeSize = 0.5 * r.size),
                (m.relativeSizeS =
                  m.relativeSize * (("size" in m && m.size) || 1)),
                r.barrels.push({
                  current:
                    0.5 * m.reload * (1 - e.upgrades[3] / 30) * (1 - m.delay) -
                    0.1,
                  bullets: [],
                  data: m,
                  turret: r,
                  active: !1,
                });
            }
            let p = a ? _ : r.relativeSize;
            if (r) {
              let f = r.sectionWeapon;
              f &&
                ((r.sectionWeapon = { ...f }),
                (r.sectionWeapon.weaponTurrets = generator.checkWeaponTurrets(
                  f,
                  e,
                  p
                )));
              let g = r.sectionBody;
              g &&
                ((r.sectionBody = { ...g }),
                (r.sectionBody.turrets = generator.checkTurrets(g, e, 2 * p)));
            }
            i.push(r);
          }
        return i;
      },
      setTankBody: function ($, e) {
        "base" !== e && $.ws.accountData && ($.ws.accountData.classic = !1);
        let t = e;
        if ((e = $.dim.bodies[e])) {
          ($.celestial = !!e.celestial),
            ($.body = t),
            ($.bodyData = e),
            ($.maxHealthMultiplier = e.maxHealth),
            ($.movementSpeed = e.movementSpeed * ($.celestial ? 1.6 : 1)),
            ($.bodyDamage = e.bodyDamage),
            ($.bodyCameraSize = e.cameraSizeMultiplier),
            ($.turrets = []),
            ($.auras = []),
            ($.noHitBox = !!e.noHitBox),
            ($.turrets = generator.checkTurrets(e, $, 1, 1, 1));
          for (let a = 0, n = e.auras.length; a < n; a++) {
            let i = { ...e.auras[a] };
            (i.gameX = $.x),
              (i.gameY = $.y),
              (i.detector = {}),
              (i.counter = Math.floor(10 * Math.random())),
              $.auras.push(i);
          }
          return generator.updateTank($), !0;
        }
      },
      updateFinalDamage: function ($) {
        let e = {};
        for (let t in $) {
          let a = $[t];
          Math.max(...a) > 0 && (e[t] = a.slice(1).concat(0));
        }
        return e;
      },
      log1: 1 / Math.log(1.2),
      log2: 1 / Math.log(4),
      getLevel: function ($) {
        return (
          Math.floor(
            Math.round(1e6 * Math.log($ / 500 + 1) * generator.log1) / 1e6
          ) + 1
        );
      },
      getCelestialLevel: function ($) {
        return (
          Math.floor(
            Math.round(
              1e6 * Math.log(($ - 23477631) / 5e6 + 1) * generator.log1
            ) / 1e6
          ) + 75
        );
      },
      getSides: function ($) {
        return (
          Math.floor(
            Math.round(
              1e6 * Math.log(1 + (3 * ($ - 250)) / 1e3) * generator.log2
            ) / 1e6
          ) + 3
        );
      },
      tank: function ($, e) {
        let t = !1;
        e || ((e = { data: {}, sendPacket: function () {} }), (t = !0));
        let a = {
          fovMultiplier: 1,
          sReload: 1,
          sBulletDamage: 1,
          sBulletSpeed: 1,
          sPenetration: 1,
          sMaxHealth: 1,
          sHealthRegeneration: 1,
          sBodyDamage: 1,
          SMovementSpeed: 1,
          id: generator.getId("tank", $.dim),
          lastChat: 0,
          chat: function ($) {
            (a.lastChat = _performance.now()), (a.dim.chatMessages[a.id] = $);
          },
          loneSurvivorTime: 0,
          hideFromLeaderboard: $.hideFromLeaderboard || !1,
          friction: $.friction >= 0 ? $.friction : 1,
          canBePushed: $.canBePushed || !$.static,
          alwaysShowOnMinimap: $.alwaysShowOnMinimap || !1,
          polygon: $.polygon || !1,
          noKillNotification: $.noKillNotification || !1,
          invisible: $.invisible || !1,
          dim: $.dim || !1,
          ignorePolygonDamage: $.ignorePolygonDamage || !1,
          weight: $.weight || 1,
          density: $.density || 1,
          speed: $.speed || 1,
          onDeath: $.onDeath || function () {},
          forceDeathScore: $.forceDeathScore >= 0 ? $.forceDeathScore : -1,
          x: $.x || 0,
          y: $.y || 0,
          d: $.d || 0,
          fullFov: !1,
          _d: [],
          xv: 0,
          yv: 0,
          range: "range" in $ ? $.range : 12,
          static: $.static || !1,
          clip: $.clip || !1,
          firing: !1,
          droneControl: !1,
          firedBarrels: {},
          upgrades: $.upgrades || [0, 0, 0, 0, 0, 0, 0, 0],
          maxHealthMultiplier: 1,
          upgradeCount: $.upgradeCount || 0,
          alive: !0,
          timeExisted: 0,
          countUpgrades: function () {
            let $ = 0;
            for (let e = 0; e < 8; e++) $ += a.upgrades[e];
            a.upgradeCount = $;
          },
          bodyDamageMultiplier: 1,
          radiant: $.radiant || 0,
          controlPosition: [0, 0],
          mousePosition: [0, 0],
          name: $.name || "",
          team: $.team || 0,
          score: $.score || 0,
          displayScore: $.score || 0,
          level: 0,
          lastSendLevel: 0,
          levelMultiplier: 1,
          health: 800,
          maxHealth: 800,
          regenTime: 1,
          size: 30,
          detector: !1,
          input: { movement: [0, 0] },
          typing: $.typing || !1,
          passive: $.passive || !1,
          invincible: !("invincible" in $) || $.invincible,
          invincibleTime: _performance.now() + 3e4,
          weapon: $.weapon || "node",
          body: $.body || "base",
          turrets: [],
          auras: [],
          bullets: {},
          ascend: function () {
            if (
              (a.ws.accountData &&
                !a.ws.accountData.ascended &&
                ((a.ws.accountData.ascended = !0),
                args.parentPort.postMessage(["ascention", [a.ws.accountName]])),
              !a.invincible)
            ) {
              a.invincible = !0;
              let $ = _performance.now() + 1e4;
              a.invincibleTime < $ && (a.invincibleTime = $);
            }
            (a.upgrades = [0, 0, 0, 0, 0, 0, 0, 0]),
              a.countUpgrades(),
              (a.weapon = "nova"),
              (a.body = "celestial"),
              7 !== a.team && (a.team = 6),
              (a.dim.updatedTanks[a.id] = a),
              a.update(),
              a.removeBullets(),
              generator.setTankWeapon(a, a.weapon),
              generator.setTankBody(a, a.body),
              (a.firedBarrels = {}),
              generator.updateTank(a),
              (e.data.tank.dim.updatedTanks[e.data.tank.id] = e.data.tank);
          },
          fov: { tanks: [], polygons: [], bullets: [] },
          finalDamage: { tanks: {}, polygons: {} },
          removeBullets: function () {
            for (let $ in a.bullets) a.bullets[$].remove();
          },
          setMaxHealth: function ($) {
            (a.health = (a.health / a.maxHealth) * $), (a.maxHealth = $);
          },
          damage: function ($, e, t) {
            if ($ > 0) {
              a.ws.accountData && (a.ws.accountData.pristine = !1),
                (a.health -= $),
                a.health < 0 && (a.health = 0),
                (a.regenTime = 0);
              let n = a.finalDamage[t];
              n &&
                (n[e.id]
                  ? (n[e.id][15] += $)
                  : (n[e.id] = [
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      $,
                    ]));
            }
          },
          remove: function ($) {
            (a.alive = !1), a.removeBullets();
            let t = a.dim.tanks.indexOf(a);
            t >= 0 && a.dim.tanks.splice(t, 1),
              generator.removeId("tank", a.id, a.dim),
              e && e.data && e.data.tank === a && (e.data.tank = !1),
              a.dim.autoScale && (a.dim.mapSize, a.dim.autoScale());
          },
          update: function () {
            let $ = a.dim.bodies[a.body],
              e = 1;
            if (
              ($ && $.celestial && (a.celestial = !0),
              $ && $.size && (e = $.size),
              a.ws.accountData)
            ) {
              let t = a.ws.accountData;
              if (a.score >= 1e9 && !t.achievements[16]) {
                let n = (t.achievements[16] = createAchievement(16));
                sendAchievement(a, n);
              }
            }
            if (a.celestial)
              a.score < 23477631 && (a.score = 23477631),
                (a.level = generator.getCelestialLevel(a.score));
            else {
              a.level = generator.getLevel(a.score);
              let i = a.ws.accountData;
              if (a.level >= 75 && i && !i.achievements[11]) {
                let _ = (i.achievements[11] = createAchievement(11));
                sendAchievement(a, _);
              }
              if (a.level >= 45 && i && a.ws) {
                if (i.ohNode && ((i.ohNode = !1), !i.achievements[13])) {
                  let s = (i.achievements[13] = createAchievement(13));
                  sendAchievement(a, s);
                }
                if (i.classic && ((i.classic = !1), !i.achievements[10])) {
                  let o = (i.achievements[10] = createAchievement(10));
                  sendAchievement(a, o);
                }
                if (
                  a.level >= 60 &&
                  i.pristine &&
                  ((i.pristine = !1), !i.achievements[24])
                ) {
                  let r = (i.achievements[24] = createAchievement(24));
                  sendAchievement(a, r);
                }
              }
            }
            if (
              ((a.displayScore =
                a.score * dimension.getRadiantMultiplier(a.radiant)),
              (a.levelMultiplier = Math.pow(
                1.01,
                a.level - (a.celestial ? 15 : 1)
              )),
              (a.size =
                30 *
                Math.pow(a.dim.sizeScale, a.level - (a.celestial ? 0 : 1)) *
                (a.celestial ? 1.5 : 1) *
                e),
              a.size > 1e3 && (a.size = 1e3),
              a.barrels)
            )
              for (let d = a.barrels.length - 1; d >= 0; d--) {
                let c = a.barrels[d].bullets;
                for (let u = c.length - 1; u >= 0; u--)
                  c[u].size = c[u].sparent.size * c[u].rawSize;
              }
            "fallen" === a.ai &&
              a.name.startsWith("Fallen ") &&
              (a.name = `Fallen ${
                a.weapon && a.weapon[0]
                  ? a.weapon[0].toUpperCase() + a.weapon.slice(1)
                  : "???"
              }-${
                a.body && a.body[0]
                  ? a.body[0].toUpperCase() + a.body.slice(1)
                  : "???"
              }`);
          },
          ws: e,
          setWs: function ($) {
            a.ws = e = $;
          },
          objectType: "tank",
          aiInput: $.ai,
        };
        if (
          (logEvent("createTank", `name:${a.name}`, `team:${a.team}`),
          t && (e.data.tank = a),
          "fallen" === $.ai)
        )
          (a.aiInput = a.ai = "fallen"), (a.aiRam = !!$.aiRam);
        else if ("defender" === $.ai) {
          a.range = 5;
          let n = 2 * Math.random() * Math.PI,
            i = 0;
          a.ai = function ($) {
            (a.d = dimension.averageAngles(a.d, n, 100)),
              i < $.now &&
                ((i = $.now + 1e4 + 1e4 * Math.random()),
                (n = 2 * Math.random() * Math.PI));
          };
        } else
          "peacekeeper" === a.ai
            ? (a.ai = "peacekeeper")
            : $.ai && (a.ai = $.ai);
        return (
          a.update(),
          generator.setTankWeapon(a, a.weapon) ||
            generator.setTankWeapon(a, "node"),
          generator.setTankBody(a, a.body) || generator.setTankBody(a, "base"),
          a.dim && ((a.dim.updatedTanks[a.id] = a), a.dim.add("tanks", a)),
          a.dim.autoScale && a.dim.autoScale(),
          a
        );
      },
      bullet: function ($) {
        let e = $.parent._barrels[$.barrelId],
          t = $.barrel || e;
        if (!e) return;
        let a = {
          id: generator.getId("bullet", $.dim),
          type: e.data.type,
          visualType: e.data.visualType || e.data.type,
          parent: $.parent,
          sparent: $.sparent || $.parent,
          parentId: $.parent.id,
          barrelId: $.barrelId,
          barrel: e,
          barrels: [],
          _barrels: [],
          dim: $.dim || !1,
          damageMultiplier: $.damage || 1,
          timeExisted: 0,
          target: !1,
          lifeTime: $.lifeTime || 1,
          health: $.health || 125,
          maxHealth: $.health || 125,
          damage: function ($) {
            $ > 0 && ((a.health -= $), a.health < 0 && (a.health = 0));
          },
          d: $.d || 0,
          x: $.x || 0,
          y: $.y || 0,
          xv: dimension.tickMultiplier * ($.xv || 0),
          yv: dimension.tickMultiplier * ($.yv || 0),
          speed: $.speed || 0,
          size: $.size * ($.sparent || $.parent).size,
          rawSize: $.size,
          remove: function () {
            if (
              (a === $.parent.bullets[a.id] && delete $.parent.bullets[a.id],
              a.barrels)
            )
              for (let e = a.barrels.length - 1; e >= 0; e--) {
                let n = a.barrels[e].bullets;
                for (let i = n.length - 1; i >= 0; i--) n[i].remove();
              }
            let _ = a.dim.bullets.indexOf(a);
            _ >= 0 && a.dim.bullets.splice(_, 1),
              generator.removeId("bullet", a.id, a.dim),
              (_ = t.bullets.indexOf(a)) >= 0 && t.bullets.splice(_, 1);
          },
        };
        if (3 === e.data.type || 4 === e.data.type) {
          let n = e.data.bulletWeapon;
          if (n) {
            a.barrels = [];
            for (let i = 0, _ = n.barrels.length; i < _; i++) {
              let s = n.barrels[i],
                o = -1;
              for (
                o = $.parent._barrels.length - 1;
                o >= 0 && $.parent._barrels[o].data !== s;
                o--
              );
              a.barrels.push({
                current:
                  0.5 *
                    s.reload *
                    (1 - a.parent.upgrades[3] / 30) *
                    (1 - s.delay) -
                  0.1,
                bullets: [],
                data: s,
                id: o,
              });
            }
          }
          a._barrels = a.barrels.slice(0);
          let r = e.data.bulletBody;
          if (r) {
            (a.bodyData = r),
              (a.speed *= r.movementSpeed),
              (a.health *= r.maxHealth),
              (a.damageMultiplier *= r.bodyDamage),
              (a.bodyCameraSize = r.cameraSizeMultiplier),
              (a.turrets = []),
              (a.auras = []);
            for (let d = 0, c = r.turrets.length; d < c; d++) {
              let u = {
                ...r.turrets[d],
                count: Math.floor(10 * Math.random()),
              };
              (u.gameX = a.x),
                (u.gameY = a.y),
                (u.detector = {}),
                (u.d = a.d),
                (u.position = "turret");
              let m = u.sectionWeapon
                ? u.sectionWeapon.barrels
                : u.barrels || [];
              (u.barrels = []), (u.relativeSize = 1);
              for (let p = 0, f = m.length; p < f; p++) {
                let g = m[p];
                (g.relativeSize = 0.5 * u.size),
                  (g.relativeSizeS =
                    g.relativeSize * (("size" in g && g.size) || 1));
                let y = -1;
                for (
                  y = $.parent._barrels.length - 1;
                  y >= 0 && $.parent._barrels[y].data !== g;
                  y--
                );
                let h = {
                  current:
                    0.5 *
                      g.reload *
                      (1 - a.parent.upgrades[3] / 30) *
                      (1 - g.delay) -
                    0.1,
                  bullets: [],
                  data: g,
                  turret: u,
                  active: !1,
                  id: y,
                };
                u.barrels.push(h), a._barrels.push(h);
              }
              if (u) {
                let k = u.sectionWeapon;
                k &&
                  ((u.sectionWeapon = { ...k }),
                  (u.sectionWeapon.weaponTurrets = generator.checkWeaponTurrets(
                    k,
                    tank,
                    u.relativeSize
                  )));
                let v = u.sectionBody;
                v &&
                  ((u.sectionBody = { ...v }),
                  (u.sectionBody.turrets = generator.checkTurrets(
                    v,
                    tank,
                    u.relativeSize
                  )));
              }
              a.turrets.push(u);
            }
            for (let b = 0, w = r.auras.length; b < w; b++) {
              let x = { ...r.auras[b] };
              (x.gameX = a.x),
                (x.gameY = a.y),
                (x.detector = {}),
                a.auras.push(x);
            }
          }
        }
        return (
          t.bullets.push(a),
          ($.parent.bullets[a.id] = a),
          a.dim && a.dim.add("bullets", a),
          a
        );
      },
      polygon: function ($, e) {
        if (
          (!$.dim.sandbox &&
            ($.sides < 0
              ? createMessage(
                  "1187917859742027786",
                  `\`[${
                    new Date().toTimeString().split(" ")[0]
                  }] Spawned ${dimension.getFullPolygonName($)} in ${
                    $.dim.name
                  }!\``
                )
              : $.radiant > 4 &&
                createMessage(
                  "1187917859742027786",
                  `\`[${
                    new Date().toTimeString().split(" ")[0]
                  }] Spawned ${dimension.getFullPolygonName($)} in ${
                    $.dim.name
                  }!\``
                )),
          ($.sides = Math.floor($.sides)),
          $.sides < -5)
        )
          return;
        let t = {
          o: e,
          id: generator.getId("polygon", $.dim),
          dim: $.dim || !1,
          x: $.x || 0,
          y: $.y || 0,
          d: $.d || 0,
          xv: 0,
          yv: 0,
          alive: !0,
          radiant: $.radiant || 0,
          sides: ~~($.sides || 3),
          score: 0,
          health: 0,
          maxHealth: 0,
          regenTime: 1,
          removeTime: 0,
          size: 0,
          finalDamage: { tanks: {} },
          damage: function ($, e, a) {
            if ($ > 0) {
              (t.removeTime = 0),
                (t.health -= $),
                t.health < 0 && (t.health = 0),
                (t.regenTime = 0);
              let n = t.finalDamage[a];
              n &&
                (n[e.id]
                  ? (n[e.id][15] += $)
                  : (n[e.id] = [
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      0,
                      $,
                    ]));
            }
          },
          remove: function () {
            t.alive = !1;
            let $ = t.dim.polygons.indexOf(t);
            $ >= 0 && t.dim.polygons.splice($, 1),
              generator.removeId("polygon", t.id, t.dim);
          },
          update: function () {
            if (t.sides < 0) return;
            t.score < 150 && (t.score = 250),
              (t.displayScore =
                t.score * dimension.getRadiantMultiplier(t.radiant));
            let $ = generator.getSides(t.score),
              e = Math.floor(t.dim.maxPolygonSides);
            if ((e < 3 && (e = 3), $ > e && ($ = e), $ !== t.sides)) {
              (t.sides = $), (t.size = generator.getPolygonSize(t.sides));
              let a = generator.getPolygonHealth(t.sides);
              (t.speed =
                dimension.tickMultiplier * generator.getPolygonSpeed(t.sides)),
                (t.health *= a / t.maxHealth),
                (t.maxHealth = a);
            }
          },
        };
        return (
          t.sides < 0
            ? (t.score = 1e9 * Math.pow(3, -t.sides - 1))
            : (t.score = 250 + (1e3 * (Math.pow(4, t.sides - 3) - 1)) / 3),
          (t.displayScore =
            t.score * dimension.getRadiantMultiplier(t.radiant)),
          (t.size = generator.getPolygonSize(t.sides)),
          (t.speed =
            dimension.tickMultiplier * generator.getPolygonSpeed(t.sides)),
          (t.health = t.maxHealth = generator.getPolygonHealth(t.sides)),
          t.dim && t.dim.add("polygons", t),
          t
        );
      },
      getPolygonSize: function ($) {
        return $ >= 3 ? 20 * Math.pow(1.5, $ - 3) : 50 * Math.pow(1.4, -$ - 1);
      },
      getPolygonSpeed: function ($) {
        return $ >= 3 ? Math.pow(0.6, $ - 3) : 0.5 * Math.pow(0.4, -$ - 1);
      },
      getPolygonHealth: function ($) {
        return $ >= 3 ? 15 * Math.pow(3.5, $ - 3) : 5e4 * Math.pow(2, -$ - 1);
      },
      wormhole: function ($) {
        let e = $.size || 75,
          t = {
            id: generator.getId("wormhole", $.dim),
            dim: $.dim || !1,
            type: $.type || 0,
            color: $.color >= 0 ? $.color : 8,
            radiant:
              $.radiant >= 0 || $.radiant <= 0
                ? $.radiant
                : 0 === $.type
                ? 0
                : 1,
            x: $.x || 0,
            y: $.y || 0,
            objects: {},
            _objects: {},
            time: $.time || 30,
            fadeTime: 0,
            action: $.action || function () {},
            onRupture: $.onRupture,
            ruptured: $.ruptured || !1,
            entries: 0,
            contents: 0,
            size: e,
            defaultSize: e * e,
            remove: function () {
              t.dim.wormholes[t.id] === t && delete t.dim.wormholes[t.id],
                (t.dim.removedWormholes[t.id] = t),
                generator.removeId("wormhole", t.id, t.dim);
            },
            rupture: function () {
              !t.ruptured &&
                ((t.ruptured = !0),
                (t.time = 30 + 20 * Math.random()),
                (t.fadeTime = 0),
                (t.dim.rupturedWormholes[t.id] = t),
                t.onRupture && t.onRupture(t));
            },
          };
        return (
          t.dim &&
            ((t.dim.wormholes[t.id] = t), (t.dim.addedWormholes[t.id] = t)),
          t
        );
      },
    },
    packer = {
      gameStart: function ($) {
        let e = $.dim,
          t = [];
        for (let a = e.tanks.length - 1; a >= 0; a--) {
          let n = e.tanks[a];
          t.push([
            n.id,
            n.name,
            n.team,
            n.radiant,
            n.weapon,
            n.body,
            !!n.ws && !!n.ws.accountNameParsed,
          ]);
        }
        let i = dimension.leaderboard(e),
          _ = [];
        for (let s = 0; s < 8; s++) {
          let o = i[s];
          o
            ? _.push([
                o.id,
                "tank" === o.objectType ? 0 : [o.sides, o.radiant],
                Math.round(o.score),
              ])
            : _.push([-s - 1, [0, 0], 1]);
        }
        let r = [];
        for (let d = 0, c = e.gates.length; d < c; d++)
          r.push(e.gates[d].slice(0, 6));
        let u = [];
        for (let m in e.wormholes) {
          let p = e.wormholes[m];
          u.push([
            p.id,
            p.x,
            p.y,
            p.type,
            p.size,
            p.ruptured || !1,
            Math.round(100 * p.fadeTime),
            p.color,
            p.radiant,
          ]);
        }
        let f = [];
        for (let g = 0, y = e.walls.length; g < y; g++) {
          let h = e.walls[g];
          h ? f.push(h) : f.push(!1);
        }
        let k = [];
        for (let v = 0, b = e.ambientParticles.length; v < b; v++) {
          let w = e.ambientParticles[v];
          k.push([
            w.amount,
            w.radiant,
            w.size[0],
            w.size[1],
            w.color.r,
            w.color.g,
            w.color.b,
            w.d,
            w.range,
            w.speed,
            w.fade,
            w.t,
            w.opacity,
          ]);
        }
        return [
          t,
          e.mapSize,
          _,
          f,
          r,
          u,
          $.upgrades,
          Math.round(e.darkness),
          [
            e.background.r,
            e.background.g,
            e.background.b,
            e.grid.r,
            e.grid.g,
            e.grid.b,
            e.gridSize,
          ],
          $.saveCode,
          !!e.fillWalls,
          k,
          Math.round(1e3 * e.sizeScale),
          !!e.customWeapons &&
            Object.keys(e.customWeapons).length > 0 &&
            e.customWeapons,
          !!e.customBodies &&
            Object.keys(e.customBodies).length > 0 &&
            e.customBodies,
        ];
      },
      gameUpdate: function ($) {
        let e = [$.id, $.score, Math.round(10 * $.dim.tickTime)];
        if (Object.keys($.tanks)[0] >= 0) {
          let t = [0];
          for (let a in $.tanks) {
            let n = $.tanks[a],
              i = ((Math.round((n.d / Math.PI) * 1e3) % 2e3) + 2e3) % 2e3,
              _ = [],
              s = n._d.length;
            if (s <= 1) _ = i;
            else {
              let o = !0;
              for (let r = 0; r < 5; r++)
                r < s
                  ? (_.push(n._d[r]),
                    o && r > 0 && n._d[r] !== _[r - 1] && (o = !1))
                  : _.push(i);
              o && (_ = i);
            }
            let d = [];
            for (let c = 0, u = n._turrets.length; c < u; c++) {
              let m = n._turrets[c];
              d.push(((Math.round((m.d / Math.PI) * 50) % 100) + 100) % 100);
            }
            let p = [
                n.id,
                Math.round(n.x),
                Math.round(n.y),
                _,
                d,
                Math.floor((1 - n.health / n.maxHealth) * 100),
                (n.typing ? 1 : 0) +
                  (n.passive ? 2 : 0) +
                  (n.invincible ? 4 : 0) +
                  (n.invisible ? 8 : 0) +
                  (n.alwaysShowOnMinimap ? 16 : 0),
                n.level,
              ],
              f = Object.values(n.firedBarrels);
            f[0] >= 0 && p.push(f), t.push(p);
          }
          e.push(t);
        }
        if (Object.keys($.dim.updatedTanks)[0] >= 0) {
          let g = [1];
          for (let y in $.dim.updatedTanks) {
            let h = $.dim.updatedTanks[y],
              k = [
                h.id,
                h.name,
                h.team,
                h.radiant,
                h.weapon,
                h.body,
                !!h.ws && !!h.ws && !!h.ws.accountNameParsed,
              ];
            g.push(k);
          }
          e.push(g);
        }
        if (Object.keys($.dim.chatMessages)[0] >= 0) {
          let v = [2];
          for (let b in $.dim.chatMessages) v.push([b, $.dim.chatMessages[b]]);
          e.push(v);
        }
        if (Object.keys($.bullets)[0] >= 0) {
          let w = [3],
            x = {},
            T = {};
          for (let z in $.bullets) {
            let S = $.bullets[z],
              P = S.parentId,
              D = S.barrelId;
            P in x || ((x[P] = {}), (T[P] = P));
            let j = x[P],
              W = [
                S.id,
                Math.round(S.x),
                Math.round(S.y),
                ((Math.round((S.d / Math.PI) * 100) % 200) + 200) % 200,
                Math.floor((1 - S.health / S.maxHealth) * 100),
              ];
            if (S.turrets && S.turrets[0]) {
              let B = [];
              for (let M in S.turrets) {
                let C = S.turrets[M];
                B.push(((Math.round((C.d / Math.PI) * 100) % 200) + 200) % 200);
              }
              W.push(B);
            }
            D in j ? j[D].push(W) : (j[D] = [D, W]);
          }
          for (let I in x) {
            let N = x[I],
              R = [T[I]];
            for (let H in N) R.push(N[H]);
            w.push(R);
          }
          e.push(w);
        }
        if (Object.keys($.polygons)[0] >= 0) {
          let F = [4],
            O = {},
            U = {},
            A = {};
          for (let Y in $.polygons) {
            let E = $.polygons[Y],
              L = O[E.radiant];
            if (
              (L || ((L = O[E.radiant] = {}), (U[E.radiant] = E.radiant)),
              L[E.sides])
            )
              L[E.sides][E.id] = E;
            else {
              let X = {};
              (X[E.id] = E), (L[E.sides] = X), (A[E.sides] = E.sides);
            }
          }
          for (let q in O) {
            let G = O[(q = U[q])],
              K = [q];
            for (let J in G) {
              let V = G[J],
                Q = [A[J]];
              for (let Z in V) {
                let $$ = V[Z];
                Q.push([
                  $$.id,
                  Math.round($$.x),
                  Math.round($$.y),
                  ((Math.round(($$.d / Math.PI) * 500) % 1e3) + 1e3) % 1e3,
                  Math.floor((1 - $$.health / $$.maxHealth) * 500),
                ]);
              }
              K.push(Q);
            }
            F.push(K);
          }
          e.push(F);
        }
        if (Object.keys($.dim.leaderboardChanges)[0] >= 0) {
          let $e = [5].concat($.dim.leaderboardChanges);
          e.push($e);
        }
        if (Object.keys($.dim.updatedGates)[0] >= 0) {
          let $t = [6];
          for (let $a in $.dim.updatedGates) {
            let $n = $.dim.updatedGates[$a];
            $t.push($n);
          }
          e.push($t);
        }
        if (Object.keys($.dim.resizedWormholes)[0] >= 0) {
          let $i = [7];
          for (let $l in $.dim.resizedWormholes) {
            let $_ = $.dim.resizedWormholes[$l];
            $i.push([$_.id, Math.round($_.size)]);
          }
          e.push($i);
        }
        if (Object.keys($.dim.rupturedWormholes)[0] >= 0) {
          let $s = [8];
          for (let $o in $.dim.rupturedWormholes) {
            let $r = $.dim.rupturedWormholes[$o];
            $s.push($r.id);
          }
          e.push($s);
        }
        if (Object.keys($.dim.fadeTimeChanges)[0] >= 0) {
          let $d = [9];
          for (let $3 in $.dim.fadeTimeChanges) {
            let $c = $.dim.fadeTimeChanges[$3];
            $d.push([$c.id, Math.round(100 * $c.fadeTime)]);
          }
          e.push($d);
        }
        if (Object.keys($.dim.removedWormholes)[0] >= 0) {
          let $u = [10];
          for (let $m in $.dim.removedWormholes) {
            let $p = $.dim.removedWormholes[$m];
            $u.push($p.id);
          }
          e.push($u);
        }
        if (Object.keys($.dim.addedWormholes)[0] >= 0) {
          let $f = [11];
          for (let $0 in $.dim.addedWormholes) {
            let $1 = $.dim.addedWormholes[$0];
            $f.push([
              $1.id,
              $1.x,
              $1.y,
              $1.type,
              $1.size,
              $1.ruptured || !1,
              Math.round(100 * $1.fadeTime),
              $1.color,
              $1.radiant,
            ]);
          }
          e.push($f);
        }
        if (
          ($.dim.darknessUpdated
            ? e.push([12, $.dim.darkness])
            : $.tank.darknessUpdated >= 0 &&
              (e.push([12, $.tank.darknessUpdated]),
              ($.tank.darknessUpdated = -1)),
          Object.keys($.dim.updatedPortals)[0] >= 0)
        ) {
          let $g = [13];
          for (let $y in $.dim.updatedPortals) {
            let $h = $.dim.updatedPortals[$y];
            $g.push([$h.id, $h.color, $h.radiant]);
          }
          e.push($g);
        }
        if (Object.keys($.dim.updatedWalls)[0] >= 0) {
          let $4 = [14];
          for (let $k in $.dim.updatedWalls) {
            let $2 = $.dim.updatedWalls[$k];
            $2 &&
              $4.push([parseInt($k), $2[4] || !1, $2[0], $2[1], $2[2], $2[3]]);
          }
          e.push($4);
        }
        if (
          ($.dim.mapSizeUpdated && e.push([15, $.dim.mapSizeUpdated]),
          Object.keys($.dim.removedWalls)[0] >= 0)
        ) {
          let $v = [16];
          for (let $b in $.dim.removedWalls) {
            let $5 = $.dim.removedWalls[$b];
            $v.push($5);
          }
          e.push($v);
        }
        return e;
      },
    },
    commands = {
      getTargets: function ($, e) {
        if (!$) return;
        let t = [],
          a = e.dim.tanks;
        switch ($) {
          case "all":
            return e.dim.tanks.concat(e.dim.polygons).concat(e.dim.bullets);
          case "bullets":
            return e.dim.bullets.slice();
          case "tanks":
            let n = [];
            for (let i = a.length - 1; i >= 0; i--) {
              let _ = a[i];
              _.polygon || n.push(_);
            }
            return n;
          case "polygons":
            return e.dim.polygons.slice();
          case "me":
            return [e];
          case "fallens":
            for (let s = a.length - 1; s >= 0; s--) {
              let o = a[s];
              "fallen" === o.ai && t.push(o);
            }
            return t;
          case "pinks":
          case "celes":
          case "celestials":
            for (let r = a.length - 1; r >= 0; r--) {
              let d = a[r];
              6 === d.team && t.push(d);
            }
            return t;
          case "blues":
            for (let c = a.length - 1; c >= 0; c--) {
              let u = a[c];
              1 === u.team && t.push(u);
            }
            return t;
          case "reds":
            for (let m = a.length - 1; m >= 0; m--) {
              let p = a[m];
              2 === p.team && t.push(p);
            }
            return t;
          case "greens":
            for (let f = a.length - 1; f >= 0; f--) {
              let g = a[f];
              3 === g.team && t.push(g);
            }
            return t;
          case "purples":
            for (let y = a.length - 1; y >= 0; y--) {
              let h = a[y];
              4 === h.team && t.push(h);
            }
            return t;
          case "yellows":
            for (let k = a.length - 1; k >= 0; k--) {
              let v = a[k];
              8 === v.team && t.push(v);
            }
            return t;
          case "others":
            for (let b = a.length - 1; b >= 0; b--) {
              let w = a[b];
              w !== e && t.push(w);
            }
            return t;
          case "polyps":
            for (let x = a.length - 1; x >= 0; x--) {
              let T = a[x];
              5 === T.team && t.push(T);
            }
            return t;
          default:
            let z = $[0],
              S = parseInt($.slice(1));
            if (S >= 0) {
              if ("t" === z) {
                let P = e.dim.tanks;
                for (let D = P.length - 1; D >= 0; D--) {
                  let j = P[D];
                  if (j.id === S) return [j];
                }
              }
              if ("p" === z) {
                let W = e.dim.polygons;
                for (let B = W.length - 1; B >= 0; B--) {
                  let M = W[B];
                  if (M.id === S) return [M];
                }
              }
            }
        }
      },
      parse: function ($, e, t) {
        let a = [];
        for (let n = 0, i = $.length; n < i; n++) {
          let _ = $[n];
          if ("position" === _) {
            let s = e.splice(0, 1)[0],
              o = commands.getTargets(s, t);
            if (o && 1 === o.length) a.push([o[0].x, o[0].y]);
            else {
              s = parseFloat(s);
              let r = parseFloat(e.splice(0, 1)[0]);
              if ((!(s >= 0) && !(s <= 0)) || (!(r >= 0) && !(r <= 0)))
                return {
                  ok: !1,
                  error: `Failed to parse position '${s} ${r}'`,
                };
              a.push([s, r]);
            }
          } else if ("targets" === _) {
            let d = e.splice(0, 1)[0],
              c = commands.getTargets(d, t);
            if (!c || !(c.length > 0))
              return {
                ok: !1,
                error: `Cannot find targets with selector '${d}'`,
              };
            a.push(c);
          } else if ("int" === _) {
            let u = e.splice(0, 1)[0],
              m = parseInt(u);
            if (!(m >= 0) && !(m <= 0))
              return { ok: !1, error: `Cannot parse int '${u}'` };
            a.push(m);
          } else if ("float" === _) {
            let p = e.splice(0, 1)[0],
              f = parseFloat(p);
            if (!(f >= 0) && !(f <= 0))
              return { ok: !1, error: `Cannot parse float '${p}'` };
            a.push(f);
          } else if ("string" === _) a.push(e.splice(0, 1)[0]);
          else if ("*" === _) {
            a.push(e.join(" ")), (e = []);
            break;
          }
        }
        return e.length > 0
          ? { ok: !1, error: `Too many arguments! '${e.join(" ")}'` }
          : a;
      },
      rules: {
        name: [
          [
            ["targets", "*"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              for (let i = a.length - 1; i >= 0; i--) {
                let _ = a[i];
                "tank" === _.objectType &&
                  ((_.name = n), (_.dim.updatedTanks[_.id] = _));
              }
            },
          ],
          [
            ["*"],
            function ($, e, t) {
              (e.name = $[0]), (e.dim.updatedTanks[e.id] = e);
            },
          ],
        ],
        reload: [
          [
            ["targets", "float"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              if (!(n <= 0))
                for (let i = a.length - 1; i >= 0; i--) {
                  let _ = a[i];
                  "tank" === _.objectType && (_.sReload = n);
                }
            },
          ],
        ],
        damage: [
          [
            ["targets", "float"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              if (!(n <= 0))
                for (let i = a.length - 1; i >= 0; i--) {
                  let _ = a[i];
                  "tank" === _.objectType && (_.sBulletDamage = n);
                }
            },
          ],
        ],
        radiant: [
          [
            ["float"],
            function ($, e, t) {
              (e.radiant = $[0]), (e.dim.updatedTanks[e.id] = e), e.update();
            },
          ],
          [
            ["targets", "float"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              for (let i = a.length - 1; i >= 0; i--) {
                let _ = a[i];
                "radiant" in _ &&
                  ((_.radiant = n),
                  "tank" === _.objectType && (_.dim.updatedTanks[_.id] = _),
                  _.update && _.update());
              }
            },
          ],
        ],
        missile: [
          [
            ["targets", "position"],
            function ($, e, t) {
              let a = $[0],
                n = $[1],
                i = function ($) {
                  if (!$.alive) return;
                  let e = generator.tank({
                      dim: $.dim,
                      x: n[0],
                      y: n[1],
                      name: "I'm hungry, and I want " + $.name + "s",
                      weapon: "abyssling",
                      body: "abyssling",
                      forceDeathScore: 2e7,
                      score: 1e9,
                      radiant: 1,
                      team: 8,
                      invincible: !1,
                      ai: function (a) {
                        let n = [0, 0],
                          i = $.x,
                          _ = $.y;
                        if (!$.alive) {
                          e.remove();
                          return;
                        }
                        try {
                          t.update(a.now, i, _, [e.x, e.y]);
                          let s = t.getImpulse(e.x, e.y);
                          if (t.directPath(e.x, e.y, i, _))
                            (n[0] = i), (n[1] = _), (t.lastTarget = n);
                          else if (s >= 0) {
                            let o = [50, 0, -50, 0][s],
                              r = [0, 50, 0, -50][s];
                            (n[0] = o ? e.x + o : e.x),
                              (n[1] = r ? e.y + r : e.y),
                              (t.lastTarget = n);
                          } else n = t.lastTarget;
                        } catch (d) {
                          console.log(d, $.name);
                        }
                        e.firing = !0;
                        let c = [n[0] - e.x, n[1] - e.y];
                        (e.d = dimension.averageAngles(
                          e.d,
                          Math.atan2(-c[0], c[1]),
                          2
                        )),
                          (e.input.movement[0] = -Math.sin(e.d)),
                          (e.input.movement[1] = Math.cos(e.d));
                      },
                    }),
                    t = pathfind.controller({
                      tank: $,
                      range: Math.ceil(($.dim.mapSize / 100) * 2),
                      maxSteps: 1e3,
                      updateInterval: 1e3,
                      dx: 0,
                      dy: 0,
                      r: 100,
                    });
                  return (t.lastTarget = [e.x, e.y]), e;
                };
              for (let _ = a.length - 1; _ >= 0; _--) {
                let s = a[_];
                s.static || i(s);
              }
            },
          ],
        ],
        fallen: [
          [
            ["targets"],
            function ($, e, t) {
              let a = $[0];
              for (let n = a.length - 1; n >= 0; n--) {
                let i = a[n];
                "tank" !== i.objectType ||
                  i.static ||
                  ((i.invisible || i.noHitBox) && i.remove(),
                  (i.team = 7),
                  (i.aiInput = i.ai = "fallen"),
                  (i.invincible = !1),
                  (i.invincibleTime = 0),
                  i.ws.sendPacket &&
                    i.ws.data.isPlayer &&
                    (i.ws.data.uid >= 0 || args.standalone) &&
                    (args.standalone
                      ? i.ws.sendPacket("death", [["/fallen"], 0])
                      : ((e.ws.data.ready = !1),
                        args.parentPort.postMessage([
                          "death",
                          [
                            i.ws.data.uid,
                            0,
                            [["/fallen"], 0],
                            i.ws.data.lastTeam,
                          ],
                        ]))),
                  i.ws &&
                    ((i.ws.data.tank = !1),
                    (i.ws.data.respawnScore = 0),
                    (i.ws = {
                      data: { isPlayer: !1 },
                      sendPacket: function () {},
                    })),
                  (i.dim.updatedTanks[i.id] = i));
              }
            },
          ],
        ],
        bot: [
          [
            ["position", "*"],
            function ($, e) {
              let t = $[0];
              generator.tank({
                dim: e.dim,
                x: t[0],
                y: t[1],
                name: $[1],
                weapon: "node",
                body: "base",
                score: 0,
                radiant: 0,
                team: 8,
              });
            },
          ],
        ],
        fallenbot: [
          [
            ["position", "*"],
            function ($, e) {
              let t = $[0];
              generator.tank({
                dim: e.dim,
                x: t[0],
                y: t[1],
                name: $[1],
                weapon: "node",
                body: "base",
                score: 0,
                radiant: 0,
                team: 7,
                ai: "fallen",
              });
            },
          ],
        ],
        drag: [
          [
            [],
            function ($, e, t) {
              e.dragTarget = !1;
            },
          ],
          [
            ["targets"],
            function ($, e, t) {
              let a = $[0];
              e.dragTarget = a;
            },
          ],
        ],
        dragwall: [
          [
            [],
            function ($, e, t) {
              e.dragWall = !1;
            },
          ],
          [
            ["string"],
            function ($, e, t) {
              let a = e.dim;
              if ("w" === $[0][0]) {
                let n = parseInt($[0].slice(1)),
                  i = a.walls[n];
                i && n >= a.defaultWalls && (e.dragWall = i);
              } else
                "snap" === $[0]
                  ? (e.dragWallSnap = !0)
                  : (($[0] = "nosnap"), delete e.dragWallSnap);
            },
          ],
        ],
        wallsize: [
          [
            ["int", "int"],
            function ($, e, t) {
              let a = e.dim.walls.indexOf(e.dragWall);
              e.dragWall &&
                a >= 0 &&
                ((e.dragWall[2] = $[0] > 10 ? $[0] : 10),
                (e.dragWall[3] = $[1] > 10 ? $[1] : 10),
                (e.dim.updatedWalls[a] = e.dragWall));
            },
          ],
        ],
        wallteam: [
          [
            ["int"],
            function ($, e, t) {
              let a = e.dim.walls.indexOf(e.dragWall);
              e.dragWall &&
                a >= 0 &&
                ((e.dragWall[4] = $[0] >= 0 ? $[0] : 0),
                (e.dim.updatedWalls[a] = e.dragWall));
            },
          ],
        ],
        createwall: [
          [
            [],
            function ($, e, t) {
              let a = [e.mousePosition[0], e.mousePosition[1], 100, 100],
                n = e.dim,
                i = 0;
              for (
                i = n.defaultWalls, l = n.walls.length;
                i < l && n.walls[i];
                i++
              );
              (e.dragWall = a), (n.walls[i] = a), (n.updatedWalls[i] = a);
            },
          ],
        ],
        savewalls: [
          [
            ["string"],
            function ($, e, t) {
              let a = dimension.saveWalls(e.dim, $[0]);
              t.sendPacket("announcement", a);
            },
          ],
        ],
        downloadwalls: [
          [
            ["string"],
            function ($, e, t) {
              let a = e.dim.walls.slice(e.dim.defaultWalls);
              a.length > 0 &&
                (t.sendPacket(
                  "eval",
                  `navigator.clipboard.writeText(${JSON.stringify(
                    JSON.stringify(a)
                  )})`
                ),
                t.sendPacket("announcement", "Copied to clipboard"));
            },
          ],
        ],
        loadwalls: [
          [
            ["string"],
            function ($, e, t) {
              let a = dimension.loadWalls(e.dim, $[0]);
              t.sendPacket("announcement", a);
            },
          ],
        ],
        uploadwalls: [
          [
            ["*"],
            function ($, e, t) {
              try {
                let a = JSON.parse($[0]);
                if (a && a.length > 0) {
                  let n = dimension.loadWalls(e.dim, a, !0);
                  t.sendPacket("announcement", n);
                } else t.sendPacket("announcement", "Failed: ");
              } catch (i) {
                t.sendPacket("announcement", "Failed: " + i);
              }
            },
          ],
        ],
        removewall: [
          [
            ["string"],
            function ($, e, t) {
              let a = e.dim;
              if ("walls" === $[0]) {
                let n = a.walls.length;
                if (n > a.defaultWalls) {
                  for (let i = a.defaultWalls; i < n; i++)
                    a.removedWalls[i] = i;
                  a.walls = a.walls.slice(0, a.defaultWalls);
                }
              }
              if ("w" === $[0][0]) {
                let _ = parseInt($[0].slice(1));
                if (a.walls[_] && _ >= a.defaultWalls) {
                  let s = a.walls.length - 1;
                  _ === s ? a.walls.splice(s, 1) : delete a.walls[_],
                    (a.removedWalls[_] = _);
                }
              }
            },
          ],
        ],
        kill: [
          [
            ["targets"],
            function ($, e, t) {
              let a = $[0];
              for (let n = a.length - 1; n >= 0; n--) {
                let i = a[n];
                (i.static && (i.invincible || i.inBase || i.prevInBase)) ||
                  ((i.health = 0), "regenTime" in i && (i.regenTime = 0));
              }
            },
          ],
        ],
        maxstats: [
          [
            [],
            function ($, e, t) {
              $[0],
                (e.upgrades = [15, 15, 15, 15, 15, 15, 15, 15]),
                e.countUpgrades(),
                e.ws.sendPacket("setStats", e.upgrades);
            },
          ],
          [
            ["targets"],
            function ($, e, t) {
              let a = $[0];
              for (let n = a.length - 1; n >= 0; n--) {
                let i = a[n];
                i.static ||
                  "tank" !== i.objectType ||
                  ((i.upgrades = [15, 15, 15, 15, 15, 15, 15, 15]),
                  i.countUpgrades(),
                  i.ws.sendPacket("setStats", i.upgrades));
              }
            },
          ],
        ],
        reset: [
          [
            [],
            function ($, e, t) {
              (e.health = e.maxHealth),
                (e.upgrades = [0, 0, 0, 0, 0, 0, 0, 0]),
                (e.score = 0),
                e.countUpgrades(),
                e.removeBullets(),
                generator.setTankWeapon(e, "node"),
                generator.setTankBody(e, "base"),
                (e.firedBarrels = {}),
                e.update(),
                generator.updateTank(e),
                (e.dim.updatedTanks[e.id] = e),
                e.removeBullets(),
                e.ws.sendPacket("setStats", e.upgrades);
            },
          ],
          [
            ["targets"],
            function ($, e, t) {
              let a = $[0];
              for (let n = a.length - 1; n >= 0; n--) {
                let i = a[n];
                i.static ||
                  "tank" !== i.objectType ||
                  ((i.health = i.maxHealth),
                  (i.upgrades = [0, 0, 0, 0, 0, 0, 0, 0]),
                  (i.score = 0),
                  i.countUpgrades(),
                  i.removeBullets(),
                  generator.setTankWeapon(i, "node"),
                  generator.setTankBody(i, "base"),
                  (i.firedBarrels = {}),
                  i.update(),
                  generator.updateTank(i),
                  (i.dim.updatedTanks[i.id] = i),
                  i.removeBullets(),
                  i.ws.sendPacket("setStats", i.upgrades));
              }
            },
          ],
        ],
        resetstats: [
          [
            [],
            function ($, e, t) {
              (e.upgrades = [0, 0, 0, 0, 0, 0, 0, 0]),
                e.countUpgrades(),
                e.ws.sendPacket("setStats", e.upgrades);
            },
          ],
          [
            ["targets"],
            function ($, e, t) {
              let a = $[0];
              for (let n = a.length - 1; n >= 0; n--) {
                let i = a[n];
                i.static ||
                  "tank" !== i.objectType ||
                  ((i.upgrades = [0, 0, 0, 0, 0, 0, 0, 0]),
                  i.countUpgrades(),
                  i.ws.sendPacket("setStats", i.upgrades));
              }
            },
          ],
        ],
        ascend: [
          [
            [],
            function ($, e, t) {
              e.ascend(),
                e.update(),
                (e.dim.updatedTanks[e.id] = e),
                e.ws.sendPacket("setStats", e.upgrades);
            },
          ],
          [
            ["targets"],
            function ($, e, t) {
              let a = $[0];
              for (let n = a.length - 1; n >= 0; n--) {
                let i = a[n];
                "tank" === i.objectType &&
                  !i.static &&
                  (i.ascend(),
                  i.update(),
                  (i.dim.updatedTanks[i.id] = i),
                  i.ws && i.ws.sendPacket("setStats", i.upgrades));
              }
            },
          ],
        ],
        announce: [
          [
            ["*"],
            function ($, e, t) {
              let a = e.dim.tanks;
              for (let n = a.length - 1; n >= 0; n--) {
                let i = a[n];
                i.ws && i.ws.sendPacket("announcement", $[0]);
              }
            },
          ],
        ],
        globalannounce: [
          [
            ["*"],
            function ($, e, t) {
              args.parentPort.postMessage(["globalAnnounce", $[0]]);
            },
          ],
        ],
        pulltanks: [
          [
            [],
            function ($, e, t) {
              for (let a in dimension.dims)
                if (!a.startsWith("pvp")) {
                  let n = dimension.dims[a].tanks;
                  for (let i = n.length - 1; i >= 0; i--) {
                    let _ = n[i];
                    !_ ||
                      "tank" !== _.objectType ||
                      _.static ||
                      _.dim === e.dim ||
                      e.polygon ||
                      dimension.sendTankTo({ tank: _, dim: e.dim.name });
                  }
                }
            },
          ],
        ],
        ban: [[["targets"], function ($, e, t) {}]],
        kick: [[["targets"], function ($, e, t) {}]],
        remove: [
          [
            ["targets"],
            function ($, e, t) {
              let a = $[0];
              for (let n = a.length - 1; n >= 0; n--) {
                let i = a[n];
                i.remove &&
                  !i.static &&
                  (i.remove(),
                  i.ws &&
                    i.ws.sendPacket &&
                    ((i.ws.data.respawnScore = 0),
                    (i.ws.data.tank = !1),
                    i.ws.data.isPlayer &&
                      (i.ws.data.uid >= 0 || args.standalone) &&
                      (args.standalone
                        ? i.ws.sendPacket("death", [["/remove"], 0])
                        : ((e.ws.data.ready = !1),
                          args.parentPort.postMessage([
                            "death",
                            [
                              i.ws.data.uid,
                              0,
                              [["/remove"], 0],
                              i.ws.data.lastTeam,
                            ],
                          ])))));
              }
            },
          ],
        ],
        wormhole: [
          [
            ["position", "string"],
            function ($, e, t) {
              generator.wormhole({
                x: $[0][0],
                y: $[0][1],
                size: 40,
                type: 1,
                time: 30,
                dim: e.dim,
                ruptured: !0,
                action: function (e) {
                  dimension.sendTankTo({ tank: e, dim: $[1] });
                },
              });
            },
          ],
        ],
        tp: [
          [
            ["targets"],
            function ($, e, t) {
              let a = $[0],
                n = e.mousePosition;
              for (let i = a.length - 1; i >= 0; i--) {
                let _ = a[i];
                _.static || ((_.x = n[0]), (_.y = n[1]));
              }
            },
          ],
          [
            ["targets", "position"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              for (let i = a.length - 1; i >= 0; i--) {
                let _ = a[i];
                _.static || ((_.x = n[0]), (_.y = n[1]));
              }
            },
          ],
        ],
        polygon: [
          [
            ["int"],
            function ($, e, t) {
              let a = $[0];
              a >= 3 &&
                a <= 20 &&
                generator.polygon({
                  x: e.x,
                  y: e.y,
                  d: 2 * Math.PI * Math.random(),
                  sides: a,
                  dim: e.dim,
                  radiant: 0,
                });
            },
          ],
          [
            ["int", "int"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              a >= 3 &&
                a <= 20 &&
                generator.polygon({
                  x: e.x,
                  y: e.y,
                  d: 2 * Math.PI * Math.random(),
                  sides: a,
                  dim: e.dim,
                  radiant: n,
                });
            },
          ],
          [
            ["int", "position"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              a >= 3 &&
                generator.polygon({
                  x: n[0],
                  y: n[1],
                  d: 2 * Math.PI * Math.random(),
                  sides: a,
                  dim: e.dim,
                  radiant: 0,
                });
            },
          ],
          [
            ["int", "int", "position"],
            function ($, e, t) {
              let a = $[0],
                n = $[1],
                i = $[2];
              a >= 3 &&
                generator.polygon({
                  x: i[0],
                  y: i[1],
                  d: 2 * Math.PI * Math.random(),
                  sides: a,
                  dim: e.dim,
                  radiant: n,
                });
            },
          ],
        ],
        polyhedra: [
          [
            ["int"],
            function ($, e, t) {
              let a = $[0];
              a >= 1 &&
                a <= 5 &&
                generator.polygon({
                  x: e.x,
                  y: e.y,
                  d: 2 * Math.PI * Math.random(),
                  sides: -a,
                  dim: e.dim,
                  radiant: 0,
                });
            },
          ],
          [
            ["int", "int"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              a >= 1 &&
                a <= 5 &&
                generator.polygon({
                  x: e.x,
                  y: e.y,
                  d: 2 * Math.PI * Math.random(),
                  sides: -a,
                  dim: e.dim,
                  radiant: n,
                });
            },
          ],
          [
            ["int", "position"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              a >= 1 &&
                a <= 5 &&
                generator.polygon({
                  x: n[0],
                  y: n[1],
                  d: 2 * Math.PI * Math.random(),
                  sides: -a,
                  dim: e.dim,
                  radiant: 0,
                });
            },
          ],
          [
            ["int", "int", "position"],
            function ($, e, t) {
              let a = $[0],
                n = $[1],
                i = $[2];
              a >= 1 &&
                a <= 5 &&
                generator.polygon({
                  x: i[0],
                  y: i[1],
                  d: 2 * Math.PI * Math.random(),
                  sides: -a,
                  dim: e.dim,
                  radiant: n,
                });
            },
          ],
        ],
        darkness: [
          [
            ["float"],
            function ($, e, t) {
              e.dim.setDarkness($[0]);
            },
          ],
        ],
        overridedarkness: [
          [
            ["targets", "float"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              if (n >= 0) {
                n = Math.round(100 * n);
                for (let i = a.length - 1; i >= 0; i--) {
                  let _ = a[i];
                  "score" in _ &&
                    !_.static &&
                    (!("sides" in _) || _.sides >= 0) &&
                    (_.darknessUpdated = n);
                }
              }
            },
          ],
        ],
        maxpolygonsides: [
          [
            [],
            function ($, e, t) {
              let a = e.dim;
              a.maxPolygonSides = a._maxPolygonSides;
            },
          ],
          [
            ["int"],
            function ($, e, t) {
              e.dim.maxPolygonSides = $[0];
            },
          ],
        ],
        maxpolygoncount: [
          [
            [],
            function ($, e, t) {
              let a = e.dim;
              a.maxPolygonCount = a._maxPolygonCount;
            },
          ],
          [
            ["int"],
            function ($, e, t) {
              e.dim.maxPolygonCount = $[0];
            },
          ],
        ],
        mapsize: [
          [
            [],
            function ($, e, t) {
              let a = e.dim;
              a.allowScale && ((a._mapSize = a.mapSize), (a.mapSizeSpeed = 0));
            },
          ],
          [
            ["int"],
            function ($, e, t) {
              let a = e.dim;
              if (a.allowScale) {
                let n = $[0];
                n < 1 && (n = 1), n > 1e5 && (n = 1e5), (a.mapSize = n);
              }
            },
          ],
          [
            ["int", "int"],
            function ($, e, t) {
              let a = e.dim;
              if (a.allowScale) {
                let n = $[0],
                  i = $[1];
                n < 1 && (n = 1),
                  n > 1e5 && (n = 1e5),
                  i < 1 && (i = 1),
                  (a._mapSize = n),
                  (a.mapSizeSpeed = 0.01 * i);
              }
            },
          ],
        ],
        xp: [
          [
            ["float"],
            function ($, e, t) {
              (e.score = $[0]), (e.dim.updatedTanks[e.id] = e), e.update();
            },
          ],
          [
            ["targets", "float"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              for (let i = a.length - 1; i >= 0; i--) {
                let _ = a[i];
                "score" in _ &&
                  !_.static &&
                  (!("sides" in _) || _.sides >= 0) &&
                  ((_.score = n),
                  "tank" === _.objectType && (_.dim.updatedTanks[_.id] = _),
                  _.update && _.update());
              }
            },
          ],
        ],
        addxp: [
          [
            ["float"],
            function ($, e, t) {
              (e.score += $[0]), (e.dim.updatedTanks[e.id] = e), e.update();
            },
          ],
          [
            ["targets", "float"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              for (let i = a.length - 1; i >= 0; i--) {
                let _ = a[i];
                "score" in _ &&
                  !_.static &&
                  (!("sides" in _) || _.sides >= 0) &&
                  ((_.score += n),
                  "tank" === _.objectType && (_.dim.updatedTanks[_.id] = _),
                  _.update && _.update());
              }
            },
          ],
        ],
        maxxp: [
          [
            ["float"],
            function ($, e, t) {
              e.score > $[0] &&
                ((e.score = $[0]), (e.dim.updatedTanks[e.id] = e), e.update());
            },
          ],
          [
            ["targets", "float"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              for (let i = a.length - 1; i >= 0; i--) {
                let _ = a[i];
                "score" in _ &&
                  !_.static &&
                  (!("sides" in _) || _.sides >= 0) &&
                  _.score > n &&
                  ((_.score = n),
                  "tank" === _.objectType && (_.dim.updatedTanks[_.id] = _),
                  _.update && _.update());
              }
            },
          ],
        ],
        minxp: [
          [
            ["float"],
            function ($, e, t) {
              e.score < $[0] &&
                ((e.score = $[0]), (e.dim.updatedTanks[e.id] = e), e.update());
            },
          ],
          [
            ["targets", "float"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              for (let i = a.length - 1; i >= 0; i--) {
                let _ = a[i];
                "score" in _ &&
                  !_.static &&
                  (!("sides" in _) || _.sides >= 0) &&
                  _.score < n &&
                  ((_.score = n),
                  "tank" === _.objectType && (_.dim.updatedTanks[_.id] = _),
                  _.update && _.update());
              }
            },
          ],
        ],
        team: [
          [
            ["targets", "string"],
            function ($, e, t) {
              let a = {
                ffa: 0,
                blue: 1,
                red: 2,
                green: 3,
                purple: 4,
                polygon: 5,
                celestial: 6,
                cele: 6,
                pink: 6,
                fallen: 7,
                gray: 7,
                yellow: 8,
              };
              if ($[1] && $[1].toLowerCase) {
                let n = $[1].toLowerCase();
                a = a[n];
                let i = $[0];
                if (a >= 0 || "random" === n)
                  for (let _ = i.length - 1; _ >= 0; _--) {
                    let s = i[_];
                    "team" in s &&
                      "tank" === s.objectType &&
                      !s.static &&
                      ((s.team =
                        "random" === n ? 1 + Math.floor(4 * Math.random()) : a),
                      (s.dim.updatedTanks[s.id] = s));
                  }
              }
            },
          ],
          [
            ["string"],
            function ($, e, t) {
              let a = {
                ffa: 0,
                blue: 1,
                red: 2,
                green: 3,
                purple: 4,
                polygon: 5,
                celestial: 6,
                cele: 6,
                pink: 6,
                fallen: 7,
                gray: 7,
                yellow: 8,
              };
              if ($[0]) {
                let n = $[0].toLowerCase();
                ((a = a[n]) >= 0 || "random" === n) &&
                  ((e.team =
                    "random" === n ? 1 + Math.floor(4 * Math.random()) : a),
                  (e.dim.updatedTanks[e.id] = e));
              }
            },
          ],
        ],
        weapon: [
          [
            ["string"],
            function ($, e, t) {
              let a = $[0] || "";
              a !== e.weapon &&
                a in e.dim.weapons &&
                (e.removeBullets(),
                generator.setTankWeapon(e, a),
                (e.firedBarrels = {}),
                e.update(),
                generator.updateTank(e),
                (e.dim.updatedTanks[e.id] = e));
            },
          ],
          [
            ["targets", "string"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              if (n in e.dim.weapons)
                for (let i = a.length - 1; i >= 0; i--) {
                  let _ = a[i];
                  _ &&
                    "tank" === _.objectType &&
                    n !== _.weapon &&
                    (_.removeBullets(),
                    generator.setTankWeapon(_, n),
                    (_.firedBarrels = {}),
                    _.update(),
                    generator.updateTank(_),
                    (_.dim.updatedTanks[_.id] = _));
                }
            },
          ],
        ],
        body: [
          [
            ["string"],
            function ($, e, t) {
              let a = $[0] || "";
              a !== e.body &&
                a in e.dim.bodies &&
                (e.removeBullets(),
                generator.setTankBody(e, a),
                (e.firedBarrels = {}),
                e.update(),
                generator.updateTank(e),
                (e.dim.updatedTanks[e.id] = e));
            },
          ],
          [
            ["targets", "string"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              if (n in e.dim.bodies)
                for (let i = a.length - 1; i >= 0; i--) {
                  let _ = a[i];
                  _ &&
                    "tank" === _.objectType &&
                    n !== _.body &&
                    (_.removeBullets(),
                    generator.setTankBody(_, n),
                    (_.firedBarrels = {}),
                    _.update(),
                    generator.updateTank(_),
                    (_.dim.updatedTanks[_.id] = _));
                }
            },
          ],
        ],
        dim: [
          [
            ["string"],
            function ($, e, t) {
              let a = $[0];
              a && dimension.sendTankTo({ dim: a, tank: e });
            },
          ],
          [
            ["targets", "string"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              if (
                !(
                  n &&
                  e &&
                  e.dim.name.startsWith("pvp") ^ n.startsWith("pvp")
                ) &&
                n
              )
                for (let i = a.length - 1; i >= 0; i--) {
                  let _ = a[i];
                  _ &&
                    "tank" === _.objectType &&
                    !_.static &&
                    dimension.sendTankTo({ dim: n, tank: _ });
                }
            },
          ],
        ],
        s: [
          [
            ["string"],
            function ($, e, t) {
              let a = $[0];
              a && dimension.sendTankTo({ dim: a, tank: e, override: !0 });
            },
          ],
          [
            ["targets", "string"],
            function ($, e, t) {
              let a = $[0],
                n = $[1];
              if (
                !(
                  n &&
                  e &&
                  e.dim.name.startsWith("pvp") ^ n.startsWith("pvp")
                ) &&
                n
              )
                for (let i = a.length - 1; i >= 0; i--) {
                  let _ = a[i];
                  _ &&
                    "tank" === _.objectType &&
                    !_.static &&
                    dimension.sendTankTo({ dim: n, tank: _, override: !0 });
                }
            },
          ],
        ],
        vanish: [
          [
            [],
            function ($, e, t) {
              (e.invisible = !0),
                e.ws.sendPacket("announcement", "Vanished into thin air.");
            },
          ],
          [
            ["string"],
            function ($, e, t) {
              let a = $[0];
              ["true", "yes", "me"].indexOf(a) >= 0
                ? ((e.invisible = !0),
                  e.ws.sendPacket("announcement", "Vanished into thin air."))
                : ["false", "no"].indexOf(a) >= 0 &&
                  ((e.invisible = !1),
                  e.ws.sendPacket("announcement", "Popped into existence."));
            },
          ],
          [
            ["targets", "string"],
            function ($, e, t) {
              let a = $[0],
                n = $[1],
                i = !1;
              if (["true", "yes", "me"].indexOf(n) >= 0) i = !0;
              else {
                if (!(["false", "no"].indexOf(n) >= 0)) return;
                i = !1;
              }
              for (let _ = a.length - 1; _ >= 0; _--) {
                let s = a[_];
                s &&
                  "tank" === s.objectType &&
                  !s.static &&
                  ((s.invisible = i),
                  s.ws.sendPacket(
                    "announcement",
                    i ? "Vanished into thin air." : "Popped into existence."
                  ));
              }
            },
          ],
        ],
        god: [
          [
            [],
            function ($, e, t) {
              (e.invincible = !0),
                (e.invincibleTime = !1),
                e.ws.sendPacket("announcement", "You are now invincible.");
            },
          ],
          [
            ["string"],
            function ($, e, t) {
              let a = $[0];
              ["true", "yes", "me"].indexOf(a) >= 0
                ? ((e.invincible = !0),
                  (e.invincibleTime = !1),
                  e.ws.sendPacket("announcement", "You are now invincible."))
                : ["false", "no"].indexOf(a) >= 0 &&
                  ((e.invincible = !1),
                  (e.invincibleTime = !1),
                  e.ws.sendPacket(
                    "announcement",
                    "You are now not invincible."
                  ));
            },
          ],
          [
            ["targets", "string"],
            function ($, e, t) {
              let a = $[0],
                n = $[1],
                i = !1;
              if (["true", "yes", "me"].indexOf(n) >= 0) i = !0;
              else {
                if (!(["false", "no"].indexOf(n) >= 0)) return;
                i = !1;
              }
              for (let _ = a.length - 1; _ >= 0; _--) {
                let s = a[_];
                s &&
                  "tank" === s.objectType &&
                  !s.static &&
                  ((s.invincible = i),
                  (s.invincibleTime = !1),
                  s.ws.sendPacket(
                    "announcement",
                    i
                      ? "You are now invincible."
                      : "You are now not invincible."
                  ));
              }
            },
          ],
        ],
        antilag: [
          [
            [],
            function ($, e, t) {
              dimension.antilag();
            },
          ],
        ],
        antibot: [
          [
            [],
            function ($, e, t) {
              dimension.antibot();
            },
          ],
        ],
        restart: [
          [
            [],
            function ($, e, t) {
              args.parentPort.postMessage(["restart"]);
            },
          ],
        ],
        fullfov: [
          [
            [],
            function ($, e, t) {
              e.fullFov = !0;
            },
          ],
          [
            ["string"],
            function ($, e, t) {
              let a = $[0];
              ["true", "yes", "me"].indexOf(a) >= 0
                ? (e.fullFov = !0)
                : ["false", "no"].indexOf(a) >= 0 && (e.fullFov = !1);
            },
          ],
        ],
      },
      execute: function ($, e, t, a) {
        e.dim;
        let n = $.slice(1).split(" "),
          i = n[0];
        if (((n = n.slice(1)), "help" === i)) {
          let _ = [];
          for (let s in commands.rules)
            _.push(s),
              _.length > 5 &&
                (t.sendPacket("announcement", _.join(", ")), (_ = []));
          return (
            _.length && t.sendPacket("announcement", _.join(", ")),
            t.sendPacket("announcement", "List of commands: "),
            !1
          );
        }
        let o = commands.rules[i];
        if (!o)
          return (
            t.sendPacket("announcement", "That command doesnt exist. /help"), !1
          );
        if (!((t.data.commands && t.data.commands[i]) || a))
          return (
            t.sendPacket(
              "announcement",
              "You don't have access to use that command."
            ),
            !1
          );
        if (o) {
          let r = [];
          for (let d = 0, c = o.length; d < c; d++) {
            let u = o[d],
              m = commands.parse(u[0], n.slice(0), e);
            if (!1 !== m.ok) return u[1](m, e, t), !0;
            r.push(m.error);
          }
          for (let p = 0, f = r.length; p < f; p++)
            t.sendPacket("announcement", r[p] + ".");
          return !1;
        }
      },
    },
    clientCount = 0;
  server.on("connection", ($, e) => {
    ($.data = {
      ready: !1,
      tank: !1,
      waiting: !1,
      lastChat: 0,
      respawnScore: 0,
      lastTeam: 0,
      admin: !1,
      isPlayer: !0,
      closed: !1,
      commands: {},
      saveCode: "",
      timeStart: !1,
    }),
      $._headers &&
        ($._headers["scenexe2-savecode"] &&
          ($.data.saveCode = $._headers["scenexe2-savecode"]),
        $._headers["scenexe2-uid"] >= 0 &&
          ($.data.uid = parseInt($._headers["scenexe2-uid"])),
        $._headers["scenexe2-lastteam"] >= 0 &&
          ($.data.lastTeam = parseInt($._headers["scenexe2-lastteam"])),
        $._headers["scenexe2-accountdata"] &&
          $._headers["scenexe2-accountname"] &&
          (($.accountData = JSON.parse($._headers["scenexe2-accountdata"])),
          ($.accountName = $._headers["scenexe2-accountname"].toLowerCase()),
          ($.accountNameParsed = $._headers["scenexe2-accountname"]),
          console.log($.accountName, $.accountNameParsed)));
    let t = function ($) {
      return $;
    };
    $.sendPacket = function (e) {
      e in game.codes.recieve &&
        $.send &&
        (arguments.length > 1
          ? $.send(t(pack([game.codes.recieve[e], arguments[1]])))
          : $.send(t(pack([game.codes.recieve[e]]))));
    };
    let a = [];
    for (let n in dimension.dims) {
      let i = dimension.dims[n];
      i.freeJoin &&
        a.push([n, i.displayName, i.displayColor, i.displayRadiant]);
    }
    clients.push($),
      $.failedHeaderCheck && (failed = !0),
      ($.data.ready = 1),
      args.standalone &&
        setTimeout(function () {
          $.sendPacket("ready", a);
        }),
      $.on("message", (e) => {
        let t;
        try {
          t = unpack(e);
        } catch (a) {
          $.close(), ($.sendPacket = function () {});
          return;
        }
        if (t[0] in game.codes.send)
          try {
            let n = game.codes.send[t[0]];
            if ("captcha" === n) return;
            if ("ping" === n) return;
            if ("token" === n) return;
            else if (!$.data.ready) return;
            if ("restore" === n);
            else if ("joinGame" === n) {
              if (
                (($.timeStart = _performance.now()),
                t[1][2],
                !1 === $.data.tank && !1 === $.data.waiting && t[1])
              ) {
                if (($.sendPacket("waiting", [!1]), args.testing)) {
                  let i = access.testing;
                  for (let _ = i.length - 1; _ >= 0; _--)
                    $.data.commands[i[_]] = !0;
                }
                let s = 0;
                if (262144 * Math.random() < 1)
                  for (s++; 9 * Math.random() < 1; ) s++;
                let o = dimension.dims[t[1][1]];
                if (!o) return;
                if (
                  $.accountNameParsed &&
                  ____.indexOf($.accountNameParsed.toLowerCase()) >= 0
                ) {
                  let r = access.p2;
                  if (o.name.includes("sandbox")) {
                    for (let d = r.length - 1; d >= 0; d--)
                      $.data.commands[r[d]] = !0;
                    setTimeout(function () {
                      $.sendPacket("announcement", "Command access granted.");
                    }, 500);
                  }
                }
                o.sandbox &&
                  (($.accountName = !1),
                  ($.accountData = !1),
                  setTimeout(function () {
                    $.sendPacket(
                      "announcement",
                      "Alert: You can no longer earn achievements and this run won't be saved!"
                    );
                  }, 500));
                let c = t[1][0];
                if (
                  c &&
                  ((c = c.slice(0, 50)), void 0 !== checkName && !checkName(c))
                ) {
                  $.close(), ($.sendPacket = function () {});
                  return;
                }
                if (t[1][3]) {
                  let u = t[1][3];
                  if (!1 === u[0]) $.data.respawnScore = u[1] || 0;
                  else {
                    (u[0].dim = o),
                      o.newTanks.push([u[0], $, u[1]]),
                      ($.data.commands = {
                        ...$.data.commands,
                        ...u[0].commands,
                      }),
                      ($.data.lastTeam = u[0].team);
                    return;
                  }
                }
                let m = 0;
                (m =
                  "2teams" === o.type
                    ? $.data.lastTeam > 0 && $.data.lastTeam < 3
                      ? $.data.lastTeam
                      : 1 + Math.floor(2 * Math.random())
                    : "ffa" === o.type
                    ? 0
                    : $.data.lastTeam > 0 && $.data.lastTeam < 5
                    ? $.data.lastTeam
                    : 1 + Math.floor(4 * Math.random())),
                  ($.data.lastTeam = m);
                let p = $.data.respawnScore || 0;
                $.accountData &&
                  (p < 100
                    ? (($.accountData.ohNode = !0),
                      ($.accountData.classic = !0),
                      ($.accountData.pristine = !0))
                    : (($.accountData.ohNode = !1),
                      ($.accountData.classic = !1),
                      ($.accountData.pristine = !1)));
                let f = {
                  dim: o,
                  x: 0,
                  y: 0,
                  name: c || "",
                  weapon: "node",
                  body: "base",
                  score: p,
                  radiant: s,
                  team: m,
                };
                console.log(
                  "joinGame",
                  `name:${c} score:${Math.round(p)} dim:${o.name}`
                ),
                  ($.data.waiting = !0),
                  o.newTanks.push([f, $]),
                  ($.data.respawnScore = 0);
              }
            } else if ("direction" === n) {
              if ($.data.tank) {
                if (!1 === t[1]) $.data.tank.input.movement = [0, 0];
                else if (t[1] >= 0 && t[1] <= 200) {
                  let g = (t[1] / 100) * Math.PI;
                  $.data.tank.input.movement = [Math.cos(g), Math.sin(g)];
                }
              }
            } else if ("d" === n)
              $.data.tank &&
                ($.data.tank.d =
                  ((((t[1] % 200) + 200) % 200) / 100) * Math.PI);
            else if ("chat" === n) {
              if ($.data.tank.ws !== $) return;
              let y = t[1];
              if ($.data.tank.dim.onChat) {
                let h = !1,
                  k = $.data.tank.dim.onChat(y, $.data.tank, function () {
                    h = !0;
                  });
                if ((k && (y = k), h)) return;
              }
              if ("/" === y[0]) {
                if ((y === "/" + secret.p1 || args.autoAdmin) && !$.____) {
                  for (i in commands.rules) $.data.commands[i] = !0;
                  ($.____ = !0),
                    $.sendPacket("announcement", "Command access granted.");
                }
                if (y === "/" + secret.p2 && !$.____) {
                  let v = access.p2;
                  for (let b = v.length - 1; b >= 0; b--)
                    $.data.commands[v[b]] = !0;
                  ($.____ = !0),
                    $.sendPacket("announcement", "Command access granted.");
                }
                if ($.data.tank) {
                  let w = commands.execute(y, $.data.tank, $);
                  w &&
                    $.accountName &&
                    $.accountName &&
                    commands.rules[y.slice(1).split(" ")[0]] &&
                    (($.accountName = !1),
                    ($.accountData = !1),
                    $.sendPacket(
                      "announcement",
                      "Alert: You can no longer earn achievements and this run won't be saved!"
                    ));
                }
              } else {
                y && (y = y.slice(0, 100));
                let x = _performance.now();
                if (x - $.data.lastChat < 750)
                  $.sendPacket(
                    "announcement",
                    "You are sending chat messages too quickly. Please slow down."
                  );
                else if ($.data.tank && y && y.length > 0) {
                  $.data.lastChat = x;
                  let T = $.data.tank.dim;
                  $.data.tank.id in T.chatMessages
                    ? $.sendPacket(
                        "announcement",
                        "You are sending chat messages too quickly. Please slow down."
                      )
                    : $.data.tank.chat(y);
                }
              }
              if (y.indexOf("/dim") != 0) {
                console.log(
                  '"' + $.data.tank.name + '"',
                  $.data.tank.dim.name,
                  "t" + $.data.tank.id,
                  ":",
                  y
                );
              }
            } else if ("typing" === n)
              $.data.tank && ($.data.tank.typing = !!t[1]);
            else if ("passive" === n)
              $.data.tank && ($.data.tank.passive = !!t[1]);
            else if ("firing" === n)
              $.data.tank &&
                (($.data.tank.firing = t[1] % 2 == 1),
                ($.data.tank.droneControl = !(t[1] < 2)));
            else if ("controlPosition" === n) {
              if ($.data.tank) {
                let z = t[1][0] || 0,
                  S = t[1][1] || 0;
                $.data.tank.controlPosition = [z, S];
              }
            } else if ("upgradeStat" === n) {
              if ($.data.tank) {
                $.data.tank.countUpgrades();
                let P = t[1][0];
                if (P >= 0 && P <= 7) {
                  let D = t[1][1],
                    j = D - $.data.tank.upgrades[P],
                    W = $.data.tank.dim.bodies[$.data.tank.body];
                  (W = W && W.celestial ? 14 : 0),
                    j > 0 &&
                    $.data.tank.upgradeCount + j + W < $.data.tank.level &&
                    D <= 15
                      ? (($.data.tank.upgradeCount += j),
                        ($.data.tank.upgrades[P] = D))
                      : $.sendPacket("setStats", $.data.tank.upgrades);
                }
              }
            } else if ("upgradeWeapon" === n) {
              if ($.data.tank) {
                let B = t[1] || "",
                  M = tankData.weaponUpgradeMap[$.data.tank.weapon];
                M &&
                  B in $.data.tank.dim.weapons &&
                  M.upgrades.indexOf(B) >= 0 &&
                  $.data.tank.level >= M.level &&
                  ($.data.tank.removeBullets(),
                  generator.setTankWeapon($.data.tank, B),
                  ($.data.tank.firedBarrels = {}),
                  generator.updateTank($.data.tank),
                  ($.data.tank.dim.updatedTanks[$.data.tank.id] = $.data.tank));
              }
            } else if ("upgradeBody" === n) {
              if ($.data.tank) {
                let C = t[1] || "",
                  I = tankData.bodyUpgradeMap[$.data.tank.body];
                I &&
                  C in $.data.tank.dim.bodies &&
                  I.upgrades.indexOf(C) >= 0 &&
                  $.data.tank.level >= I.level &&
                  ($.data.tank.removeBullets(),
                  generator.setTankBody($.data.tank, C),
                  ($.data.tank.firedBarrels = {}),
                  generator.updateTank($.data.tank),
                  ($.data.tank.dim.updatedTanks[$.data.tank.id] = $.data.tank));
              }
            } else $.close(), ($.sendPacket = function () {});
          } catch (N) {
            console.log(N);
          }
        else $.close(), ($.sendPacket = function () {});
      }),
      $.on("close", () => {
        $.closed = !0;
        let e = clients.indexOf($);
        e >= 0 && clients.splice(e, 1),
          (game.clients = clients = Array.from(server.clients));
        let t = function () {
          if ($.data.tank) {
            let e = $.data.tank;
            gameEnd(e),
              (e.ws.send = !1),
              delete $.data.uid,
              (e.team = 7),
              (e.aiInput = e.ai = "fallen"),
              (e.invisible || e.noHitBox || e.dim.removeFallens) && e.remove(),
              (e.invincible = !1),
              (e.invincibleTime = 0),
              (e.ws.data.isPlayer = !1),
              (e.ws.accountName = !1),
              (e.ws.accountData = !1),
              (e.name = `Fallen ${
                e.weapon && e.weapon[0]
                  ? e.weapon[0].toUpperCase() + e.weapon.slice(1)
                  : "???"
              }-${
                e.body && e.body[0]
                  ? e.body[0].toUpperCase() + e.body.slice(1)
                  : "???"
              }`),
              (e.dim.updatedTanks[e.id] = e);
            let t = 0;
            for (let a = e.dim.tanks.length - 1; a >= 0; a--)
              "fallen" === e.dim.tanks[a].ai && !e.ws.data.isPlayer && t++;
            t >= 10
              ? e.remove()
              : ("sanctuary" === e.dim.name || "abyss" === e.dim.name) &&
                dimension.sendTankTo({
                  tank: e,
                  dim: ["ffa", "2teams", "4teams"][
                    Math.floor(3 * Math.random())
                  ],
                }),
              console.log(
                "removeTank",
                `name:${e.name} score:${e.score} dim:${e.dim.name}`
              );
          }
        };
        t();
      });
  });
  let startTick = function ($) {
      let e = 0,
        t = 0,
        a = [];
      function n(n) {
        a.push(n + 1e3);
        let i = 0;
        for (; a[i] < n; ) i++;
        a.splice(0, i), t >= 24 ? (t = 0) : t++;
        let _ = e >= 4;
        if (
          (dimension.update(
            $,
            { recordDirection: !0, updateFinalDamage: 0 === t, gameUpdate: _ },
            n
          ),
          _)
        ) {
          ($.tickTime = $.dt / 5), ($.dt = 0), (e = 0);
          for (let s = $.tanks.length - 1; s >= 0; s--) {
            let o = $.tanks[s],
              r = o.ws;
            r.data.isPlayer &&
              r.sendPacket(
                "gameUpdate",
                packer.gameUpdate({
                  tank: o,
                  tanks: o.fov.tanks,
                  bullets: o.fov.bullets,
                  polygons: o.fov.polygons,
                  id: o.id,
                  score: Math.floor(o.score),
                  dim: o.dim,
                })
              );
          }
          dimension.reset($);
        } else e++;
      }
      let i = 0,
        _ = 0;
      $.intervalId = setInterval(function () {
        let $ = _performance.now();
        $ - _ > 500 && dimension.antilag(),
          $ >= i &&
            ((_ = $), (i += 20 * (1 + Math.floor(($ - i) * 0.05))), n($));
      }, 9);
    },
    wormhole = {
      count: function ($, e) {
        let t = [];
        for (let a in $.wormholes) {
          let n = $.wormholes[a];
          n.type === e && t.push(n);
        }
        return t;
      },
      main: function ($) {
        setInterval(function () {
          if (0.3 > Math.random()) {
            let e = wormhole.count($, 0),
              t = 0;
            if (
              Math.random() < (t = 0 === e.length ? 0.5 : 2 / (3 + e.length))
            ) {
              let a = $.mapSize - 2e3,
                n = (2 * Math.random() - 1) * a,
                i = (2 * Math.random() - 1) * a;
              Math.random() > 0.01
                ? generator.wormhole({
                    x: n,
                    y: i,
                    size: 100,
                    type: 0,
                    time: 30 + 60 * Math.random(),
                    dim: $,
                    action: function ($) {
                      let e = $.dim.bodies[$.body] || {};
                      6 === $.team || e.celestial || $.ascend(),
                        7 !== $.team
                          ? dimension.sendTankTo({ tank: $, dim: "sanctuary" })
                          : dimension.sendTankTo({
                              tank: $,
                              dim: ["ffa", "2teams", "4teams"][
                                Math.floor(3 * Math.random())
                              ],
                            });
                    },
                    onRupture: function ($) {
                      $.action = function ($) {
                        dimension.sendTankTo({
                          tank: $,
                          dim: "crossroadsLobby",
                        });
                      };
                    },
                  })
                : generator.wormhole({
                    x: n,
                    y: i,
                    size: 100,
                    type: 0,
                    radiant: 1,
                    time: 30 + 60 * Math.random(),
                    dim: $,
                    action: function ($) {
                      dimension.sendTankTo({ tank: $, dim: "abyssHallway" });
                    },
                  });
            }
          }
        }, 1e3);
      },
    },
    load = function (p) {
      try {
        eval(fs.readFileSync(p).toString());
      } catch (e) {
        console.log(`Failed to load dim from ${p}: ${e}`);
      }
    },
    special = function (p, dim) {
      if (dim)
        try {
          eval(fs.readFileSync(p).toString());
        } catch (e) {
          console.log(`Failed to load special from ${p}: ${e}`);
        }
    };
  eval(args.start);
  let createAbyssling = function ($) {
      if ($.tank.isAbyssling) return;
      let e = $.tank,
        t = generator.tank({
          weight: $.weight,
          speed: $.speed,
          dim: $.dim,
          x: "x" in $ ? $.x : 3600,
          y: $.y || 0,
          name: "I'm hungry, and I want " + e.name + "s",
          weapon: "abyssling",
          body: "abyssling",
          forceDeathScore: 2e7,
          score: 1e9,
          radiant: 1,
          team: 8,
          invincible: !1,
          clip: !0,
          ai: function ($) {
            let a = $.now,
              n = [e.x - t.x, e.y - t.y],
              i = Math.sqrt(n[0] * n[0] + n[1] * n[1]);
            if (
              (i < 1 && (i = 1),
              (t.input.movement = [n[0] / i, n[1] / i]),
              (t.d = Math.atan2(-n[0], n[1])),
              a - e.lastChat > 5e3 && 0.002 > Math.random())
            ) {
              let _ = [
                "pls feed me",
                "come to daddy",
                "they never said i had to chase my food",
                "im thirsty",
                "why are you running :(",
                "come here, lets be friends",
                "im friendly, come have a hug",
              ];
              _.push(
                `omg, ${
                  e.weapon && e.weapon[0]
                    ? e.weapon[0].toUpperCase() + e.weapon.slice(1)
                    : "???"
                }-${
                  e.body && e.body[0]
                    ? e.body[0].toUpperCase() + e.body.slice(1)
                    : "???"
                }s, my favourite`
              ),
                t.chat(_[Math.floor(Math.random() * _.length)]);
            }
            e.alive || t.remove();
          },
        });
      return (t.isAbyssling = !0), (t.firing = !0), t;
    },
    addBot = function ($) {
      let e = $[1],
        t = 0,
        a = 0,
        n = 0,
        i = dimension.dims[$[0]];
      (t =
        e[0].team >= 5 && !(dimension.noPinkTeam && 6 === e[0].team)
          ? e[0].team
          : "2teams" === i.type
          ? ws.data.lastTeam > 0 && ws.data.lastTeam < 3
            ? ws.data.lastTeam
            : 1 + Math.floor(2 * Math.random())
          : "ffa" === i.type
          ? 0
          : ws.data.lastTeam > 0 && ws.data.lastTeam < 5
          ? ws.data.lastTeam
          : 1 + Math.floor(4 * Math.random())),
        (e[0].team = t),
        (e[0].dim = i);
      let _ = generator.tank(e[0]);
      ([a, n] = i.spawnPlayer(t, _, e[1])), (_.x = a), (_.y = n);
    },
    spawnPolygon = function ($) {
      let e;
      e = $.spawnPolygon
        ? $.spawnPolygon()
        : [
            (0.5 > Math.random() ? 1 : -1) * $.mapSize * Math.random(),
            (0.5 > Math.random() ? 1 : -1) * $.mapSize * Math.random(),
          ];
      let t = 5 + 5 * Math.random();
      for (let a = 0; a < t; a++) spawnPolygon2($, e);
    },
    spawnPolygon2 = function ($, e) {
      let t = {};
      for (let a = $.polygons.length - 1; a >= 0; a--) {
        let n = $.polygons[a];
        n.sides in t ? t[n.sides]++ : (t[n.sides] = 1);
      }
      let i = 0,
        _ = $ === dimension.dims.abyss || $ === dimension.dims.abyssHallway,
        s = $ === dimension.dims.crossroads;
      if (
        (((_ && Math.random() > 0.15) || "assault" === $.name) && i++,
        $.gleaming && Math.random() > 0.4 && (i++, Math.random() > 0.4 && i++),
        s && 12.5 * Math.random() < 1 && i++,
        4096 * Math.random() < 1 && i++,
        i > 0)
      ) {
        let o = _ ? 12 : 9;
        for (; Math.random() * o < 1; ) i++;
      }
      let r = {},
        d = 0,
        c = 1;
      for (let u = 3; u <= $.maxPolygonSides; u++) {
        let m = (1 * c) / (1 + (t[u] || 0));
        u > 5 && (_ || s)
          ? ((r[u] = 50 * m), (d += 50 * m))
          : ((r[u] = m), (d += m)),
          $.clans ? (c *= 0.4) : s ? (c *= 0.28) : (c *= _ ? 0.33 : 0.24);
      }
      let p = Math.random() * d,
        f = 0,
        g = 3;
      for (let y in r)
        if (p < (f += r[y])) {
          g = parseInt(y);
          break;
        }
      if ($.nextSpawnPolyhedra) {
        for (
          $.nextSpawnPolyhedra = !1, g = -1, i = 0;
          g > -5 && 5 * Math.random() < 1;

        )
          g--;
        if (4096 * Math.random() < 1) for (i++; 9 * Math.random() < 1; ) i++;
      }
      generator.polygon(
        {
          x: e[0],
          y: e[1],
          d: 2 * Math.PI * Math.random(),
          sides: g,
          dim: $,
          radiant: i,
        },
        [g, i]
      );
    };
  return (
    setInterval(function () {
      let $ = {};
      for (let e in dimension.dims) {
        let t = dimension.dims[e];
        $[e] = t.playerCount();
      }
      args.parentPort.postMessage(["playerCount", $]);
    }, 1e3),
    {
      game,
      dimension,
      packer,
      generator,
      Detector,
      View,
      httpServer,
      server,
      commands,
      addBot,
      ____: function ($) {
        ____ = $;
      },
    }
  );
};
(module.exports = {
  run: function (options, t) {
    let text = fs
        .readFileSync(options.tankDataFile || "./tankData.js")
        .toString(),
      window = {};
    eval(text), (secret = options.secret);
    let data = main(window.tankData, options);
    return t && eval(t), data;
  },
}),
  process.on("SIGINT", function () {
    console.log("\nExit from SIGINT (Ctrl-C)"), process.exit(0);
  });
