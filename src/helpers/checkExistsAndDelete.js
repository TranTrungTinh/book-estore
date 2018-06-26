const fs = require('fs');

function checkExistsAndDelete(imageName) {
  return new Promise((resolve, reject) => {
    const path = `src/public/assets/media/images/${imageName}`;
    if(!fs.existsSync(path)) return resolve('CANNOT_FIND_IMAGE');
  
    fs.unlink(path, (err, results) => {
      if(err) return reject(err);
      resolve('SUCCESS');
    });
  });
}

module.exports = { checkExistsAndDelete };