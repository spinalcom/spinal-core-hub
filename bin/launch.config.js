const fs = require('fs');
const util = require('util');

const appsPath = "./.apps.json";
const configPath = "./.config.json";

let appsStr = fs.readFileSync(appsPath, {flag: 'r', ecoding: 'utf8'});
let configStr = fs.readFileSync(configPath, {flag: 'r', ecoding: 'utf8'});

let apps = JSON.parse(appsStr.toString());
let config = JSON.parse(configStr.toString());

let envs = getEnv(config);

let local = getLocalOrgans();

for (let i=0; i < local.length; i++)
  apps.apps.push(local[i]);

setEnv(apps, envs);

function setEnv(apps, envs) {

  let a = Object.keys(apps.apps);

  for (let i=0; i < a.length; i++) {

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

  for (let i=0; i < apps.length; i++) {

    let a = apps[i];

    let envs = Object.keys(config[a]);

    console.log(a);

    for (let j=0; j < envs.length; j++) {

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
  let list = fs.readdirSync('.');

  let localOrgans = list.filter((f) => {
    return f.indexOf('spinal-organ') > -1;
  });

  let localOrgansInfo = localOrgans.map((o) => {
    return {
      name: o,
      script: "index.js",
      cwd: o,
      restart_delay: 1000
    }
  });

  return localOrgansInfo;
}

module.exports = apps;
