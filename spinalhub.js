// TODO: fill with other spinalhub params
var containerized = require("containerized");
const path = require("path");

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
  params.push("-P", port + 1); // jsport admin
  params.push("-q", port + 2); // c++ port
  if (process.env.SPINAL_PASSWORD) { // -x - adminpass
    params.push("-x", process.env.SPINAL_PASSWORD);
  }
  if (process.env.SPINAL_PASSWORD_ROOT) { // -w - superpass
    params.push("-w", process.env.SPINAL_PASSWORD_ROOT);
  }
  if (process.env.SPINAL_PASSWORD_USER) { // -r - pass
    params.push("-r", process.env.SPINAL_PASSWORD_USER);
  }

  let spinalhub = spawn("./spinalhub", params);
  spinalhub.stdout.on("data", function (data) {
    console.log("stdout: " + data.toString());
  });

  spinalhub.stderr.on("data", function (data) {
    console.log("stderr: " + data.toString());
  });

  spinalhub.on("exit", function (code) {
    console.log("child process exited with code " + code.toString());
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

// Usage: ./spinalhub [options]

// SpinalHub, the local IoT nerve center
//   -b or --base-dir arg: base directory of files to be served (/ in http requests) (default='html')
//   --db-file arg: file name of the database (default='memory/dump.db')
//   ---db-file arg: file name of the database (default='memory/_dump.db')
//   --db-dir arg: name of the database file directory (for bulk data) (default='memory/data.db')
//   -v or --verbose: will give more information
//   -t or --title-page arg: title of the page used for xdotool (default='')
//   -P or --super-port arg: http port for supervision (default='8889')
//   -p or --port arg: http port for public pages (default='8888')
//   -q or --soda-port arg: port for binary public communication (default='8890')
//   -x or --adminpass arg: password for admin user with write/read permissions (default='JHGgcz45JKilmzknzelf65ddDadggftIO98P')
//   -w or --superpass arg: password for user with write/read permissions (default='4YCSeYUzsDG8XSrjqXgkDPrdmJ3fQqHs')
//   -r or --pass arg: password for user with read permissions (default='LQv2nm9G2rqMerk23Tav2ufeuRM2K5RG')
//   -m or --modify-passwords: modify the passwords
