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

var fs = require('fs');

var name = JSON.parse(fs.readFileSync('./package.json', 'utf8')).name;
var script = JSON.parse(fs.readFileSync('./package.json', 'utf8')).main;

var nerveCenterPath = '../../nerve-center';
var rootPath = '../..';
var browserPath = '../../.browser_organs'

console.log('Postinstall script inititated.');

if (!fs.existsSync(nerveCenterPath)) { 
  copyBin()
    .then(() => {
      console.log('Postinstall script finished.');
    })
}

if (!fs.existsSync(browserPath)) {
  fs.mkdirSync(browserPath);
  fs.symlinkSync('../.apps.json', browserPath + '/.apps.json');
  fs.symlinkSync('../.config.json', browserPath + '/.config.json');
}

function copyBin() {

  return new Promise((res, rej) => {

    fs.mkdir(nerveCenterPath, (err) => {
      if (err) return rej(err);

      try {

        let r = fs.createReadStream('./bin/spinalhub.js');
        r.pipe(fs.createWriteStream(nerveCenterPath + '/spinalhub.js'));

        r.on('end', () => {
          // TODO: change permissions
          fs.chmodSync(nerveCenterPath + '/spinalhub.js', '777');
          res();
        })

        //fs.createReadStream('./bin/nerve-center/run.js').pipe(fs.createWriteStream(nerveCenterPath + '/run.js'));
        fs.createReadStream('./bin/launch.config.js').pipe(fs.createWriteStream(rootPath + '/launch.config.js'));

      } catch (e) {
        rej(e);
      }
    });

  })
}
