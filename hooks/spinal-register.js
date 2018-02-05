#!/usr/bin/env node

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

var appLaunchPath = path.resolve('../../.apps.json');
var configPath = path.resolve('../../.config.json');
var browserPath = path.resolve('../../.browser_organs');
var defaultConfigPath = path.resolve('./default_config.json');

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
  create_browser_folder();

  var realName = name.substr('spinal-browser-'.length);
  // fs.symlinkSync(path.resolve('./www'), path.resolve(browserPath + '/' + realName));
  copyRecursiveSync(path.resolve('./www'), path.resolve(browserPath + '/' + realName));
}
//  else if (isDriveEnv()) {
//   create_browser_folder();

//   var templatePath = path.resolve('./templates');
//   if (fs.existsSync(templatePath)) {
//     var templatePath = path.resolve('./templates' + name);
//     copyRecursiveSync(templatePath, path.resolve(browserPath + '/templates/' + name));
//   }

//   var addons = [];
//   var output_name = path.resolve(browserPath + '/lib/' + "spinal-lib-drive-env.js");
//   var output = fs.createWriteStream(output_name);
//   var browserify = require('browserify');
//   var b = browserify({
//     debug: true
//   });

//   fs.readdir(path.resolve('..'), function (err, items) {
//     var regex = /spinal-env-drive[-_\w]*/;
//     for (var i = 0; i < items.length; i++) {
//       if (regex.test(items[i])) {
//         addons.push(items[i]);
//       }
//     }
//     if (addons.length) {
//       addons = addons.sort(compare_lib_dependencies);
//       console.log(addons);
//       getsrc_addon(addons, output, b, 0);
//     }
//   });
// }

// function compare_lib_dependencies(a, b) {
//   var dependencies = require(path.resolve('../' + b + '/package.json')).dependencies;
//   for (var i = 0; i < dependencies.length; i++) {
//     if (dependencies[i] === a)
//       return -1;
//   }
//   return 0;
// }


function create_browser_folder() {
  if (!fs.existsSync(browserPath)) {
    fs.mkdirSync(browserPath);
    fs.mkdirSync(browserPath + "/lib");
    // fs.mkdirSync(browserPath + "/templates");
    fs.symlinkSync(path.resolve('../.apps.json'), path.resolve(browserPath + '/.apps.json'));
    fs.symlinkSync(path.resolve('../.config.json'), path.resolve(browserPath + '/.config.json'));
  }
}

// function getsrc_addon(addons, output, b, idx) {
//   if (idx >= addons.length) {
//     b.transform("babelify", {
//       presets: ["es2015"]
//     });
//     b.transform("windowify");
//     b.transform("uglifyify");
//     b.bundle().pipe(output);
//     return;
//   }
//   var pack = require(path.resolve('../' + addons[idx] + '/package.json'));
//   for (var i = 0; i < pack.src.length; i++) {
//     b.add(path.resolve('../' + addons[idx] + '/' + pack.src[i]));
//   }
//   getsrc_addon(addons, output, b, ++idx);
// }


function createPM2script(defaults = null) {
  if (fs.existsSync(appLaunchPath)) {
    return getLaunch(defaults);
  }

  return writeLaunch({
    apps: []
  }, defaults);
}

function getLaunch(defaults = null) {

  return new Promise((res, rej) => {

    fs.readFile(appLaunchPath, {
      flag: 'r',
      ecoding: 'utf8'
    }, function (err, data) {
      if (err) return rej(err);

      var content = data.toString();

      appConfig = JSON.parse(content);

      res(writeLaunch(appConfig, defaults));

    });

  });
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

      fs.writeFile(appLaunchPath, content, {
        flag: 'w'
      }, function (err) {
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

    fs.readFile(configPath, {
      flag: 'r',
      ecoding: 'utf8'
    }, function (err, data) {
      if (err) return rej(err);

      var content = data.toString();

      config = JSON.parse(content);

      res(config);

    });

  });

}

function writeConfig(config) {

  return new Promise((res, rej) => {

    fs.readFile(defaultConfigPath, {
      flag: 'r',
      ecoding: 'utf8'
    }, function (err, data) {
      if (err) return rej(err);

      config[name] = JSON.parse(data.toString());

      var content = JSON.stringify(config, null, 2);

      fs.writeFile(configPath, content, {
        flag: 'w'
      }, function (err) {
        if (err) return rej(err);
        res();
      });
    });

  });

}

function isDriveEnv() {
  return name.indexOf('spinal-env-drive') == 0;
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
  };
}

function configOrgan() {
  return {
    name: name,
    script: script,
    cwd: path.resolve(".")
  };
}

function copyRecursiveSync(src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);

  var destExists = fs.existsSync(dest);
  var destStats = destExists && fs.statSync(dest);
  var destIsDirectory = destExists && destStats.isDirectory();

  var isDirectory = exists && stats.isDirectory();
  if (exists && isDirectory) {
    if (!destIsDirectory) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
        path.join(dest, childItemName));
    });
  } else {
    if (destExists)
      fs.unlinkSync(dest);
    fs.linkSync(src, dest);
  }
}