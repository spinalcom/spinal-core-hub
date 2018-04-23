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
  let spinalhub = spawn("./spinalhub", [
    "-b",
    browserOrgans,
    "-p",
    port,
    "-P",
    port + 1,
    "-q",
    port + 2
  ]);
  spinalhub.stdout.on("data", function(data) {
    console.log("stdout: " + data.toString());
  });

  spinalhub.stderr.on("data", function(data) {
    console.log("stderr: " + data.toString());
  });

  spinalhub.on("exit", function(code) {
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
