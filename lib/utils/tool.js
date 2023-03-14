
const getFileName = (name) => {
  const path = require('path');
  const filename = path.basename(name);
  return path.parse(filename).name
}

module.exports = {
  getFileName
}