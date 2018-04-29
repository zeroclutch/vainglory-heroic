// import data
const options = require('../../data/options');

// import library
var Vainglory = require('vainglory');
const vainglory = new Vainglory(process.env.VG_API_KEY);

module.exports = async (ign) => {
  options.filter.playerNames = [ign]
  //Get player info from server
  const promise = () => { return (vainglory.setRegion('na').matches.collection(options)); }
  let res = await promise();
  return res;
}