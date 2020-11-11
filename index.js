const execSync = require("child_process").execSync;

function run(command) {
  console.log(command);
  execSync(command, {stdio: 'inherit'});
}

let mongoVersion = parseFloat(process.env['INPUT_MONGODB-VERSION'] || 4.4);

// TODO make OS-specific
if (![4.4, 4.2, 4.0, 3.6, 3.4, 3.2].includes(mongoVersion)) {
  throw 'Invalid MongoDB version: ' + mongoVersion;
}

mongoVersion = mongoVersion.toFixed(1);

if (process.platform == 'darwin') {
  if (mongoVersion != 4.4) {
    // remove previous version
    run(`brew unlink mongodb-community`);

    // install new version
    run(`brew install mongodb-community@${mongoVersion}`);
  }

  // start
  const bin = `/usr/local/opt/mongodb-community@${mongoVersion}/bin`;
  run(`${bin}/mongod --config /usr/local/etc/mongod.conf --fork`);

  // set path
  run(`echo "${bin}" >> $GITHUB_PATH`);
} else {
  if (mongoVersion != 4.4) {
    // remove previous version
    run(`sudo rm /etc/apt/sources.list.d/mongodb-org-*.list`);
    run(`sudo apt-get purge mongodb-org*`);
    run(`sudo rm -r /var/log/mongodb /var/lib/mongodb`);

    // install new version
    run(`wget -qO - https://www.mongodb.org/static/pgp/server-${mongoVersion}.asc | sudo apt-key add -`);
    run(`echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME)/mongodb-org/${mongoVersion} multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-${mongoVersion}.list`);
    run(`sudo apt-get update`);
    run(`sudo apt-get install mongodb-org`);
  }

  // start
  run(`sudo systemctl start mongod`);
  run(`for i in \`seq 1 20\`; do mongo --eval "db.version()" > /dev/null && break; sleep 1; done`);
}
