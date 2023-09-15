/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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

// TODO: fill with other spinalhub params
var containerized = require("containerized");
const path = require("path");
const dotenv = require('dotenv');
dotenv.config();

if (!containerized()) {
  var spawn = require("child_process").spawn;
  var browserOrgans = path.resolve("../.browser_organs");

  if (!process.env.SPINALHUB_PORT) {
    process.env.SPINALHUB_PORT = 7777;
  }
  const port = parseInt(process.env.SPINALHUB_PORT);
  const params = [];
  params.push("-b", browserOrgans); // html dir root
  params.push("-p", port); // js port
  params.push("-q", port + 1); // c++ port
  if (process.env.SPINAL_PASSWORD) { // -x - adminpass
    params.push("-x", process.env.SPINAL_PASSWORD);
  }
  if (process.env.SPINAL_PASSWORD_ROOT) { // -w - superpass
    params.push("-w", process.env.SPINAL_PASSWORD_ROOT);
  }
  if (process.env.SPINAL_PASSWORD_USER) { // -r - pass
    params.push("-r", process.env.SPINAL_PASSWORD_USER);
  }
  if (process.env.SPINAL_GARBAGE_COLLECTOR_SCHEDULE) {
    params.push("-g", process.env.SPINAL_GARBAGE_COLLECTOR_SCHEDULE);
  }
  if (process.env.SPINAL_DUMP_SCHEDULE) {
    params.push("-d", process.env.SPINAL_DUMP_SCHEDULE);
  }
  let spinalhub = spawn("./spinalhub", params);
  spinalhub.stdout.on("data", function (data) {
    if (data) {
      console.log("stdout: " + data.toString());
    } else {
      console.log("stdout with no data");
    }
  });

  spinalhub.stderr.on("data", function (data) {
    if (data) {
      console.error("stderr: " + data.toString());
    } else {
      console.error("stderr with no data");
    }
  });

  spinalhub.on("exit", function (code) {
    console.log("child process exited with code " + code);
  });

} else {
  const { exec } = require("child_process");
  // TODO: allow configuration of ports
  exec("/spinalhub -b /usr/src/app/.browser_organs", (err, stdout) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
    console.log(stdout);
  });
}

// Usage: './spinalhub' [options]
// SpinalHub, the local IoT nerve center
//   -v or --verbose: will give more information
//   -b or --base-dir arg: base directory of files to be served (/ in http requests) (default='html')
//   --db-file arg: file name of the database (default='memory/dump.db')
//   --db-dir arg: name of the database file directory (for bulk data) (default='memory/data.db')
//   -d or --cronstring-dump arg: cron string to make dump (default='0 5 * * * *')
//   -g or --cronstring-gc arg: cron string to do a garbage collector (default='0 5 * * * *')
//   -p or --port arg: http port for public pages (default='8888')
//   -q or --soda-port arg: port for binary public communication (default='8889')
//   --timeout-chan: timeout in s to respawn push channels (if no websocket)
//   -x or --adminpass arg: password for admin user with write/read permissions (default='JHGgcz45JKilmzknzelf65ddDadggftIO98P')
//   -w or --superpass arg: password for user with write/read permissions (default='4YCSeYUzsDG8XSrjqXgkDPrdmJ3fQqHs')
//   -r or --pass arg: password for user with read permissions (default='LQv2nm9G2rqMerk23Tav2ufeuRM2K5RG')
//   -m or --modify-passwords: modify the passwords
// Unlike normal cron string the 1st number is for the seconds 
// <seconds> <minutes> <hours> <days of month> <months> <days of week> <years>
//  default is every hours at minute 5