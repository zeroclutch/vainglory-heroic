// init project
var express = require('express');
var app = express();

// database functionality
var assert = require('assert');
var mongodb = require('mongodb');

// import data
var options = require('./data/options.js');
var tiers = require('./data/tiers');

// import functions
var parseHeroData = require('./dist/mining/parseHeroData');
var findCounters = require('./dist/analysis/findCounters');

app.use(express.static('public'));

// Create seed data
var outputUntiered = {
      info: {
          gameMode: options.filter.gameMode,
          patchVersion: options.filter.patchVersion,
          matchesSearched: 0,
          usersSearched: 0
        },
        heroes: {}
    },
output = (function(data) {
  data = {
    info: {
      gameMode: options.filter.gameMode,
      patchVersion: options.filter.patchVersion,
      matchesSearched: 0,
      usersSearched: 0
    },
    heroes: {}
  };
  tiers.forEach(function(value, key, map) {
    data.heroes[value] = {};
  });
  return data;
})(),
    IGNs = ['DarkFlame07', 'mrdollywaggit'];

//Search
setInterval( () => {
  //Ensure a random distribution by using the data furthest from the initial values as the new seeds.
  if(IGNs.length >= 10000) IGNs = IGNs.slice(-200);
  const randomIGN = IGNs[Math.floor(Math.random() * Math.floor(IGNs.length))];
  parseHeroData(randomIGN, output.heroes, outputUntiered.heroes)
  // if successful, write data to storage values
  .then((data) => {
    output.heroes = data.output;
    outputUntiered.heroes = data.outputUntiered;
    IGNs = [...IGNs, ...data.IGNs];
  })
  .catch((err) => {
    console.error(err);
  });
}, 1000);

// access database
var uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;
const dbName = process.env.DB;

mongodb.MongoClient.connect(uri, function(err, client) {
  if(err) throw err;
  const db = client.db(dbName);
  db.createCollection('output', { strict:true }, function(err, collection) {});
  //db.write('output', output, function(err, collection) {
    
  //});
  
  client.close();
});

app.get("/", async function (request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

app.get("/rawData", async function (request, response) {
  response.set({"Content-Type": "application/json"})
  response.send(output);
});

app.get("/rawDataUntiered", async function (request, response) {
  response.set({"Content-Type": "application/json"})
  if(request.query.tier) response.send(output.heroes[request.query.tier]);
  else response.send(outputUntiered);
});

app.get("/topCounters", async function (request, response) {
  response.set({"Content-Type": "application/json"});
  if(request.query.tier) response.send(findCounters(output.heroes[request.query.tier]));
  else response.send(findCounters(outputUntiered.heroes));
});

app.get("/viewable", async function (request, response) {
  response.set({"Content-Type": "text/html"})
  response.send("<script>var data = JSON.parse('" + JSON.stringify(output) + "')</script>");
});

// listen for requests :)
var listener = app.listen("3000", function () {
  console.log('Your app is listening on port ' + listener.address().port);
});