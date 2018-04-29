// import data
const tiers = require('../../data/tiers');

//@param: numeric Visual Skill Tier
//returns name of skill tier
module.exports = function (vst) {
  const iterator = tiers.keys();
  var skillTier = "Unranked";
  
  tiers.forEach( (value, key, map) => {
    if (key <= vst) skillTier = value;
  });
  
  return skillTier;
}