// TODO: fill with other spinalhub params
var containerized = require("containerized");

const { exec } = require("child_process");
const path = require("path");

if (!containerized()) {
  let browserOrgans = path.resolve("../.browser_organs");

  if (!process.env.SPINALHUB_PORT) {
    process.env.SPINALHUB_PORT = 7777;
  }
  const port = parseInt(process.env.SPINALHUB_PORT);
  const cmd = `./spinalhub -b ${browserOrgans} -p ${port} -P ${port +
    1} -q ${port + 2}`;

  exec(cmd, (err, stdout) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
    console.log(stdout);
  });
} else {
  // TODO: allow configuration of ports
  exec("/spinalhub -b /usr/src/app/.browser_organs", (err, stdout) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
    console.log(stdout);
  });
}
