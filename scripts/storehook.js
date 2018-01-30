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

const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

var hookDir = path.resolve('../.hooks/');

var hookPath = {
  origin: path.resolve('./hooks/postinstall'),
  target: path.resolve('../.hooks/postinstall')
}

var hookScriptPath = {
  origin: path.resolve('./hooks/run_post.js'),
  target: path.resolve('../.hooks/run_post.js')
}

if (!fs.existsSync(hookPath.target)) { 
  setupHook();
}

function setupHook() {
  exec('ls', (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
  });

  if (!fs.existsSync(hookDir)) { 
    fs.mkdir(hookDir);
  }

  let content = 'node ' + hookScriptPath.target;

  // TODO: hacer esto sync

  copyRecursiveSync(hookScriptPath.origin, hookScriptPath.target);
  copyRecursiveSync(hookPath.origin, hookPath.target);
  fs.chmodSync(hookPath.target, '777');
  console.log('New Spinal module installed.');
/*
  fs.writeFile(hookPath.target, content, { flag : 'w' }, function (err) {
    if (err) return console.log(err);

    //fs.createReadStream(hookPath.origin).pipe(fs.createWriteStream(hookPath.target));
    fs.createReadStream(hookScriptPath.origin).pipe(fs.createWriteStream(hookScriptPath.target));
    // TODO: change permissions
    fs.chmodSync(hookPath.target, '777');

  });
*/
}

function copyRecursiveSync(src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  if (fs.existsSync(dest))
      fs.unlinkSync(dest);
  var isDirectory = exists && stats.isDirectory();
  if (exists && isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else {
    fs.linkSync(src, dest);
  }
};
