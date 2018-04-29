function callServer(params, endpoint) {
  var xhr = new XMLHttpRequest();
  endpoint += "?data=true"
  for (var param in params) {
    endpoint +=  "&" + param + "=" + params[param];
  }
  endpoint.replace("?data=true&", "?");
  xhr.open( "GET", endpoint, false );
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4 && xhr.status == 200)
        return xhr.responseText;
  }
  xhr.send( null );
  return xhr.onreadystatechange();
}

var Client = {
  retrieve: function(command, params) {
    return Client[command].callback(callServer((params || {}), Client[command].endpoint));
  },
  rawData: {
    endpoint: "/rawData",
    callback: function(data) {
      return JSON.parse(data)
    }
  },
  topCounters: {
    endpoint: "/topCounters",
    callback: function(data) {
      return JSON.parse(data)
    }
  },
  rawDataUntiered: {
    endpoint: "/rawDataUntiered",
    callback: function(data) {
      return JSON.parse(data)
    }
  }
}

var Vue;
const app = new Vue({
  el: "#app",
  data: {
    currentHero: "Alpha",
    tier: "all",
    filteredHeroes: [],
    mode: "counters",
    data: Client.retrieve("rawData").heroes,
    dataUntiered: Client.retrieve("rawDataUntiered").heroes,
    counters: Client.retrieve("topCounters")
  },
  methods: {
    chooseTier: function() {
      if(this.mode === "counters") {
        if(this.tier !== "all") this.counters = Client.retrieve("topCounters", {tier:this.tier});
        else this.counters = Client.retrieve("topCounters");
        console.log(this.counters)
      } else if (this.mode === "winrates") {
        if(this.tier !== "all") this.dataUntiered = Client.retrieve("rawDataUntiered", {tier:this.tier});
        else this.dataUntiered = Client.retrieve("rawDataUntiered").heroes;
      }
    }
    /*filterHero: function(input) {
       for (var i = 0; i < arr.length; i++) {
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          
        }
      }
    }*/
  }
});