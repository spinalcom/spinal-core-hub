const fs = require('fs'),
  util = require('util'),
  path = require('path'),
  browserify = require('browserify');

const appsPath = path.resolve("./.apps.json"),
  configPath = path.resolve("./.config.json");

let appsStr = fs.readFileSync(appsPath, {
  flag: 'r',
  ecoding: 'utf8'
});
let configStr = fs.readFileSync(configPath, {
  flag: 'r',
  ecoding: 'utf8'
});

let apps = JSON.parse(appsStr.toString());
let config = JSON.parse(configStr.toString());

let envs = getEnv(config);

let local = getLocalOrgans();
setLocalLibs();
setBrowserOrgans();

for (let i = 0; i < local.length; i++)
  apps.apps.push(local[i]);

setEnv(apps, envs);

function setEnv(apps, envs) {

  let a = Object.keys(apps.apps);

  for (let i = 0; i < a.length; i++) {

    apps.apps[a[i]] = Object.assign(apps.apps[a[i]], envs);

  }

}

function isHub(name) {
  return name == "spinal-core-hub";
}

// environemnt variables form config file

function getEnv(config) {
  let res = {};

  let apps = Object.keys(config);

  for (let i = 0; i < apps.length; i++) {

    let a = apps[i];

    let envs = Object.keys(config[a]);

    console.log(a);

    for (let j = 0; j < envs.length; j++) {

      let e = envs[j];

      if (typeof res[e] == 'undefined')
        res[e] = {};

      res[e] = Object.assign(res[e], config[a][e]);

    }

  }

  return res;
}

// dev locals organs

function getLocalOrgans() {
  let list = fs.readdirSync(path.resolve('.'));

  let localOrgans = list.filter((f) => {
    return f.indexOf('spinal-organ') > -1;
  });

  let localOrgansInfo = localOrgans.map((o) => {
    return {
      name: o,
      script: "index.js",
      cwd: path.resolve(o),
      restart_delay: 1000
    };
  });

  return localOrgansInfo;
}

// dev local libs on browser organs folder

function setLocalLibs() {
  let list = fs.readdirSync(path.resolve('.'));

  let localLibs = list.filter((f) => {
    return f.indexOf('spinal-lib') > -1;
  });

  localLibs.forEach((l) => {
    let name = l.substr(11);
    let libPath = {
      origin: path.resolve('./' + l + '/model.js'),
      target: path.resolve('./.browser_organs/lib/' + name + '.js')
    };

    // copy model.js in browser organ
    if (fs.existsSync(libPath.target)) {
      fs.unlinkSync(libPath.target);
    }

    let bundler = browserify();
    bundler.add(libPath.origin);

    let bundleFs = fs.createWriteStream(libPath.target);

    //bundler.external('spinal-core-connectorjs');
    let b = bundler.bundle();

    let done = false;

    b.on('end', function () {
      done = true;
    });

    b.pipe(bundleFs);

    require('deasync').loopWhile(function () {
      return !done;
    });

    //    while(!continueScript);

    //copyRecursiveSync(libPath.origin, libPath.target);
  });
}

function setBrowserOrgans() {
  let list = fs.readdirSync(path.resolve('.'));

  let localBrowser = list.filter((f) => {
    return f.indexOf('spinal-browser') > -1;
  });

  localBrowser.forEach((b) => {
    let name = b.substr(15);
    let browserPath = {
      origin: path.resolve('./' + b + '/www'),
      target: path.resolve('./.browser_organs/' + name)
    };

    // copy www in browser organ
    if (fs.existsSync(browserPath.target)) {
      deleteFolderRecursive(browserPath.target);
    }
    copyRecursiveSync(browserPath.origin, browserPath.target);
  });
}


function copyRecursiveSync(src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (exists && isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
        path.join(dest, childItemName));
    });
  } else {
    fs.linkSync(src, dest);
  }
}

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

module.exports = apps;