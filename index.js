const execSync = require('child_process').execSync;

function run(command) {
  console.log(command);
  execSync(command, {stdio: 'inherit'});
}

const PREINSTALLED_VERSION = '5.0';

const mongoVersion = parseFloat(process.env['INPUT_MONGODB-VERSION'] || PREINSTALLED_VERSION).toFixed(1);

// TODO make OS-specific
if (!['6.0', '5.0', '4.4', '4.2'].includes(mongoVersion)) {
  throw `MongoDB version not supported: ${mongoVersion}`;
}

if (process.platform == 'darwin') {
  if (mongoVersion != PREINSTALLED_VERSION) {
    // remove previous version
    run(`brew unlink mongodb-community@${PREINSTALLED_VERSION}`);

    // install new version
    run(`brew install mongodb-community@${mongoVersion}`);
  }

  // start
  const bin = `/usr/local/opt/mongodb-community@${mongoVersion}/bin`;
  run(`${bin}/mongod --config /usr/local/etc/mongod.conf --fork`);

  // set path
  run(`echo "${bin}" >> $GITHUB_PATH`);
} else if (process.platform == 'win32') {
  if (mongoVersion != PREINSTALLED_VERSION) {
    throw `MongoDB version not supported on Windows: ${mongoVersion}`;
  }

  run(`sc config MongoDB start= auto`);
  run(`sc start MongoDB`);
} else {
  if (mongoVersion != PREINSTALLED_VERSION) {
    // remove previous version
    run(`sudo apt-get purge mongodb-org*`);
    run(`sudo rm -r /var/log/mongodb /var/lib/mongodb`);

    // install new version
    run(`wget -qO - https://www.mongodb.org/static/pgp/server-${mongoVersion}.asc | sudo apt-key add -`);
    run(`echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME)/mongodb-org/${mongoVersion} multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-${mongoVersion}.list`);
    run(`sudo apt-get update -o Dir::Etc::sourcelist="sources.list.d/mongodb-org-${mongoVersion}.list" -o Dir::Etc::sourceparts="-" -o APT::Get::List-Cleanup="0"`);
    run(`sudo apt-get install mongodb-org`);
  }

  // start
  run(`sudo systemctl start mongod`);
  const shell = parseInt(mongoVersion) >= 5 ? 'mongosh' : 'mongo';
  run(`for i in \`seq 1 20\`; do ${shell} --eval "db.version()" > /dev/null && break; sleep 1; done`);
}
