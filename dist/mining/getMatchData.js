// import functions
// import functions
const findMatches = require('./findMatches');

//Sort the data from the matches
module.exports = async (ign) => {
  let matches = await findMatches(ign);
  var response = [],
      IGNs = [];
  for(var i in matches.match) {
    var teams = {};
    
    for(var j in matches.match[i].matchRoster) {
      var team = matches.match[i].matchRoster[j].data.attributes.won;
      for(var k in matches.match[i].matchRoster[j].rosterParticipants) {
        const player = matches.match[i].matchRoster[j].rosterParticipants[k];
        if(!teams[team]) teams[team] = [];
        
        // add to IGNs
        const playerIGN = player.participantPlayer.data.attributes.name;
        if(!IGNs.includes(playerIGN) && playerIGN !== ign) IGNs.push(playerIGN);
        teams[team].push({hero: player.data.attributes.actor.replace(/[\W_]+/g, ""), tier: player.participantPlayer.data.attributes.stats.rankPoints.ranked});
      }
    }
    response.push(teams);
  }
  return {response, IGNs};
}