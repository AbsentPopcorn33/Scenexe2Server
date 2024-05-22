!(function () {
  const dim = dimension.create({
    maxWormholes: 6,
    mapSize: 9650, // mapsize
    name: "ffa", // internal name of dim
    fillWalls: true,
    type: "ffa", // leave this
    freeJoin: true, // whether tank can join from server select
    allowScale: true, // allow use of /mapsize command
    removeFallens: true, // remove tanks that go fallen
    displayName: "Free For All", // name of dim shown on server select
    displayRadiant: 0, // make color radiant on server select
    displayColor: 2, // color on server select
    walls: [], // [ [x, y, w, h] ],
    gates: [],
    background: {
      // background color
      r: 205,
      g: 205,
      b: 205,
    },
    grid: {
      // grid color
      r: 200,
      g: 200,
      b: 200,
    },
    gridSize: 25,
    maxPolygonSides: 13,
    maxPolygonCount: 100,
    spawnPlayer: function (team, tank) {
      (tank.invincible = true),
        (tank.invincibleTime = 1000),
        //tank.team = 8
        setTimeout(function () {
          if (tank.ws.sendPacket) {
            // send a notification
            tank.ws.sendPacket("announcement", `/${args.secret.p1} for commands`);
          }
        });
      return [3000 * (1 - 2 * Math.random()), 3000 * (1 - 2 * Math.random())];
    },
  });
  wormhole.main(dim);
})();
