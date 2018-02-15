// TODO: fill with other spinalhub params
var containerized = require('containerized');

const {
  exec
} = require('child_process');
const path = require('path');


if (!containerized()) {

  let browserOrgans = path.resolve('../.browser_organs');
  let memoryDir = path.resolve('./memory');

  exec('docker run -v ' + memoryDir + ':/memory -v ' + browserOrgans + ':/html  -p ' + process.env.SPINALHUB_PORT + ':8888 spinalcom/spinalhub:v3.0.0', (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
    console.log(stdout);
  });

} else {
  // TODO: allow configuration of ports
  exec('/spinalhub -b /usr/src/app/.browser_organs', (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
    console.log(stdout);
  });

}
