// import functions
const getMatchData = require('./getMatchData');
const findTier = require('./findTier');
const sort = require('../analysis/sort');

module.exports = async (ign, output, outputUntiered) => {
  //Here come the loops...
  //Here come the loops...
  //Here come the loops...
  //InternalError: too much recursion
  
  // get list of matches to parse
  let matchData = await getMatchData(ign);
  const data = matchData.response;
  
  // iterate over matches
  for(var i = 0; i < data.length; i++) {
    
    // iterate over winning team roster
    for(var j = 0; j < data[i]["true"].length; j++) {
      const player = data[i]["true"][j],
            losingTeam = data[i]["false"],
            winner = player.hero;
      let tier = await findTier(player.tier).toString();
      
      // define tiers in case they weren't used yet
      if(!output[tier]) output[tier] = {};
      if(!output[tier][winner]) output[tier][winner] = {};
      
      if(!output[tier][winner]["_overall"]) output[tier][winner]["_overall"] = {matches: 0, wins: 0, winrate: 0};
      
      // define tiers for outputUntiered in case they weren't used yet
      if(!outputUntiered[winner]) outputUntiered[winner] = {};
      
      if(!outputUntiered[winner]["_overall"]) outputUntiered[winner]["_overall"] = {matches: 0, wins: 0, winrate: 0};
      
      // iterate over losing team
      for(var k = 0; k < losingTeam.length; k++) {
        const loser = losingTeam[k].hero;
        
        // sort heroes for output
        // define loser heroes and such in case they weren't used yet and sort them
        if(!output[tier][loser]) {
          output[tier][loser] = {};
          output[tier] = sort(output[tier]);
        }
        
        if(!output[tier][winner][loser]) {
          output[tier][winner][loser] = {matches: 0, wins: 0, winrate: 0};
          output[tier][winner] = sort(output[tier][winner]);
        }
        
        if(!output[tier][loser][winner]) {
          output[tier][loser][winner] = {matches: 0, wins: 0, winrate: 0};
          output[tier][loser] = sort(output[tier][loser]);
        }
        
        if(!output[tier][loser]["_overall"]) output[tier][loser]["_overall"] = {matches: 0, wins: 0, winrate: 0};
        
        // add values for winner
        output[tier][winner][loser].matches++;
        output[tier][winner][loser].wins++;
        output[tier][winner][loser].winrate = Math.round((output[tier][winner][loser].wins/output[tier][winner][loser].matches)*10000)/10000;
        
        output[tier][winner]["_overall"].matches++;
        output[tier][winner]["_overall"].wins++;
        output[tier][winner]["_overall"].winrate = Math.round((output[tier][winner]["_overall"].wins/output[tier][winner]["_overall"].matches)*10000)/10000;
        
        
        // add values for loser
        output[tier][loser][winner].matches++;
        output[tier][loser][winner].winrate = Math.round((output[tier][loser][winner].wins/output[tier][loser][winner].matches)*10000)/10000;
        
        output[tier][loser]["_overall"].matches++;
        output[tier][loser]["_overall"].winrate = Math.round((output[tier][loser]["_overall"].wins/output[tier][loser]["_overall"].matches)*10000)/10000;
        
        // do the same for outputUntiered
        // define loser heroes
        if(!outputUntiered[loser]) {
          outputUntiered[loser] = {};
          outputUntiered = sort(outputUntiered);
        }
        
        if(!outputUntiered[winner][loser]) {
          outputUntiered[winner][loser] = {matches: 0, wins: 0, winrate: 0};
          outputUntiered[winner] = sort(outputUntiered[winner]);
        }
        
        if(!outputUntiered[loser][winner]) {
          outputUntiered[loser][winner] = {matches: 0, wins: 0, winrate: 0};
          outputUntiered[loser] = sort(outputUntiered[loser]);
        }
        
        if(!outputUntiered[loser]["_overall"]) outputUntiered[loser]["_overall"] = {matches: 0, wins: 0, winrate: 0};
        
        // add values for winner
        outputUntiered[winner][loser].matches++;
        outputUntiered[winner][loser].wins++;
        outputUntiered[winner][loser].winrate = Math.round((outputUntiered[winner][loser].wins/outputUntiered[winner][loser].matches)*10000)/10000;
        
        outputUntiered[winner]["_overall"].matches++;
        outputUntiered[winner]["_overall"].wins++;
        outputUntiered[winner]["_overall"].winrate = Math.round((outputUntiered[winner]["_overall"].wins/outputUntiered[winner]["_overall"].matches)*10000)/10000;
        
        // add values for loser
        outputUntiered[loser][winner].matches++;
        outputUntiered[loser][winner].winrate = Math.round((outputUntiered[loser][winner].wins/outputUntiered[loser][winner].matches)*10000)/10000;
        
        outputUntiered[loser]["_overall"].matches++;
        outputUntiered[loser]["_overall"].winrate = Math.round((outputUntiered[loser]["_overall"].wins/outputUntiered[loser]["_overall"].matches)*10000)/10000;
      }
    }
    //output.info.matchesSearched++;
  }
  //output.info.usersSearched++;
  return {output, outputUntiered, IGNs: matchData.IGNs };
}