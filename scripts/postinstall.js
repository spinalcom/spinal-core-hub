/*
* Copyright 2015 SpinalCom - www.spinalcom.com
* 
* This file is part of SpinalCore.
* 
* Please read all of the following terms and conditions
* of the Free Software license Agreement ("Agreement")
* carefully.
* 
* This Agreement is a legally binding contract between
* the Licensee (as defined below) and SpinalCom that
* sets forth the terms and conditions that govern your
* use of the Program. By installing and/or using the
* Program, you agree to abide by all the terms and
* conditions stated or referenced herein.
* 
* If you do not agree to abide by these terms and
* conditions, do not demonstrate your acceptance and do
* not install or use the Program.
* You should have received a copy of the license along
* with this file. If not, see
* <http://resources.spinalcom.com/licenses.pdf>.
*/

const fs = require('fs'),
      path = require('path');

var name = JSON.parse(fs.readFileSync('./package.json', 'utf8')).name;
var script = JSON.parse(fs.readFileSync('./package.json', 'utf8')).main;

var nerveCenterPath = path.resolve('../../nerve-center');
var rootPath = path.resolve('../..');
var browserPath = path.resolve('../../.browser_organs');

console.log('Postinstall script inititated.');

if (!fs.existsSync(nerveCenterPath)) { 
  copyBin()
    .then(() => {
      console.log('Postinstall script finished.');
    })
}

if (!fs.existsSync(browserPath)) {
  fs.mkdirSync(browserPath);
  fs.symlinkSync(path.resolve('../.apps.json'), path.resolve(browserPath + '/.apps.json'));
  fs.symlinkSync(path.resolve('../.config.json'), path.resolve(browserPath + '/.config.json'));
}

function copyBin() {

  return new Promise((res, rej) => {

    fs.mkdir(nerveCenterPath, (err) => {
      if (err) return rej(err);

      try {

        let r = fs.createReadStream(path.resolve('./bin/spinalhub.js'));
        r.pipe(fs.createWriteStream(path.resolve(nerveCenterPath + '/spinalhub.js')));

        r.on('end', () => {
          // TODO: change permissions
          fs.chmodSync(path.resolve(nerveCenterPath + '/spinalhub.js'), '777');
          res();
        })

        //fs.createReadStream('./bin/nerve-center/run.js').pipe(fs.createWriteStream(nerveCenterPath + '/run.js'));
        fs.createReadStream(path.resolve('./bin/launch.config.js')).pipe(fs.createWriteStream(path.resolve(rootPath + '/launch.config.js')));

      } catch (e) {
        rej(e);
      }
    });

  })
}
