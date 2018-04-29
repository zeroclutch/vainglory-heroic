//data: accepts outputUntiered
//TODO: rework formula, currently is unfavored to heroes with low overall winrates
module.exports = function(data) {
  var response = []
  for(const hero in data) {
    if(hero !== "info") {
      for(const enemy in data[hero]) {
        if((data[hero][enemy].winrate - data[hero]["_overall"].winrate) > 0.075 && data[hero][enemy].matches > 100) {
          response.push({winner: hero, loser: enemy, winrate: data[hero][enemy].winrate, difference: data[hero][enemy].winrate - data[hero]["_overall"].winrate, matches: data[hero][enemy].matches});
        }
      }
    }
  }
  response.sort(function(a,b) {
    if(a.difference < b.difference) return 1;
    else return -1;
  });
  return response;
};