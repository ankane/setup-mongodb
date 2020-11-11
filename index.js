const execSync = require("child_process").execSync;

function run(command) {
  console.log(command);
  execSync(command, {stdio: 'inherit'});
}

const mongoVersion = parseFloat(process.env['INPUT_MONGODB-VERSION'] || 4.4);

if (![4.4, 4.2, 4.0, 3.6, 3.4, 3.2].includes(mongoVersion)) {
  throw 'Invalid MongoDB version: ' + mongoVersion;
}

if (process.platform == 'darwin') {
  run(`brew install mongodb-community@${mongoVersion}`);
  run(`mongod --config /usr/local/etc/mongod.conf --fork`);
} else {
  if (mongoVersion != 4.4) {
    run(`wget -qO - https://www.mongodb.org/static/pgp/server-${mongoVersion}.asc | sudo apt-key add -`);
    run(`echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/${mongoVersion} multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-${mongoVersion}.list`);
    run(`sudo apt-get update`);
    run(`sudo apt-get install mongodb-org`);
  }
  run(`sudo systemctl start mongod`);
}
