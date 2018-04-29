module.exports = function (obj) {
  var sortedOutput = {};
  Object.keys(obj).sort().forEach(function(key) {
    sortedOutput[key] = obj[key];
  });
  return sortedOutput;
}