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
var path = require('path');

var name = JSON.parse(fs.readFileSync('./package.json', 'utf8')).name;
var script = JSON.parse(fs.readFileSync('./package.json', 'utf8')).main;

var appLaunchPath = '../../.apps.json';
var configPath = '../../.config.json'
var browserPath = '../../.browser_organs'
var defaultConfigPath = "./default_config.json";

console.log('Postinstall script inititated.');

if (isOrgan() || isHub()) {

  createConfig()
    .then(() => {
      return createPM2script();
    })
    .then(() => {
      console.log('Postinstall script finished.');
    });

} else if (isBrowserOrgan()) {

  if (!fs.existsSync(browserPath)) {
    fs.mkdirSync(browserPath);
    fs.symlinkSync('../.apps.json', browserPath + '/.apps.json');
    fs.symlinkSync('../.config.json', browserPath + '/.config.json');
  }

  var realName = name.substr('spinal-browser-'.length);
  //fs.symlinkSync('../node_modules/' + name + '/www', browserPath + '/' + realName);
  copyRecursiveSync('./www', browserPath + '/' + realName)
}

function createPM2script(defaults = null) {
  if (fs.existsSync(appLaunchPath)) { 
    return getLaunch(defaults);
  }

  return writeLaunch({apps: []}, defaults);
}

function getLaunch(defaults = null) {

  return new Promise((res, rej) => {

    fs.readFile(appLaunchPath, {flag: 'r', ecoding: 'utf8'}, function (err, data) {
      if (err) return rej(err);

      var content = data.toString();

      appConfig = JSON.parse(content);

      res(writeLaunch(appConfig, defaults));

    });

  })
}

function writeLaunch(appConfig, defaults = null) {

  return new Promise((res, rej) => {
    var i = appConfig.apps.findIndex((e) => {
      return e.name == name;
    });

    if (i < 0) {
      if (isHub())
        appConfig.apps.push(configHub());
      else
        appConfig.apps.push(configOrgan());

      var index = appConfig.apps.length - 1;

      appConfig.apps[index] = Object.assign(appConfig.apps[index], defaults);

      var content = JSON.stringify(appConfig, null, 2);

      fs.writeFile(appLaunchPath, content, { flag : 'w' }, function (err) {
        if (err) return rej(err);

        console.log('New Spinal module installed.');
        res();
      });
    } else {
      res();
    }
  });

}

function createConfig() {
  if (fs.existsSync(defaultConfigPath)) {
    if (fs.existsSync(configPath)) {
      return getConfig().
        then(writeConfig);
    }

    return writeConfig({});
  }

  return new Promise((res) => res());
}

function getConfig() {

  return new Promise((res, rej) => {

    fs.readFile(configPath, {flag: 'r', ecoding: 'utf8'}, function (err, data) {
      if (err) return rej(err);

      var content = data.toString();

      config = JSON.parse(content);

      res(config);

    });

  })

}

function writeConfig(config) {

  return new Promise((res, rej) => {

    fs.readFile(defaultConfigPath, {flag: 'r', ecoding: 'utf8'}, function (err, data) {
      if (err) return rej(err);

      config[name] = JSON.parse(data.toString());

      var content = JSON.stringify(config, null, 2);

      fs.writeFile(configPath, content, { flag : 'w' }, function (err) {
        if (err) return rej(err);
        res();
      });
    });

  });

}

function isBrowserOrgan() {
  return name.indexOf('spinal-browser') == 0;
}

function isOrgan() {
  return name.indexOf('spinal-organ') == 0;
}

function isHub() {
  return name == 'spinal-core-hub';
}

function configHub() {
  return {
    name: name,
    script: "spinalhub.js",
    cwd: "nerve-center"
  }
}

function configOrgan() {
  return {
    name: name,
    script: script,
    cwd: "node_modules/" + name
  }
}

function copyRecursiveSync (src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
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
