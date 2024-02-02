const execSync = require('child_process').execSync;
const fs = require('fs');

function run(command) {
  console.log(command);
  const env = Object.assign({}, process.env);
  env.HOMEBREW_NO_INSTALLED_DEPENDENTS_CHECK = '1';
  env.HOMEBREW_NO_INSTALL_CLEANUP = '1';
  env.HOMEBREW_NO_INSTALL_UPGRADE = '1';
  execSync(command, {stdio: 'inherit', env: env});
}

const image = process.env['ImageOS'];
const defaultVersion = image == 'ubuntu22' ? '6.0' : '5.0';
const mongoVersion = parseFloat(process.env['INPUT_MONGODB-VERSION'] || defaultVersion).toFixed(1);

// TODO make OS-specific
if (!['7.0', '6.0', '5.0', '4.4', '4.2'].includes(mongoVersion)) {
  throw `MongoDB version not supported: ${mongoVersion}`;
}

if (process.platform == 'darwin') {
  if (mongoVersion != '5.0' || image == 'macos13' || image == 'macos14') {
    if (image == 'macos13' || image == 'macos14') {
      run(`brew tap mongodb/brew`);
    } else {
      // remove previous version
      run(`brew unlink mongodb-community@5.0`);
    }

    // install new version
    run(`brew install mongodb-community@${mongoVersion}`);
  }

  // start
  const prefix = process.arch == 'arm64' ? '/opt/homebrew' : '/usr/local';
  const bin = `${prefix}/opt/mongodb-community@${mongoVersion}/bin`;
  run(`${bin}/mongod --config ${prefix}/etc/mongod.conf --fork`);

  // set path
  run(`echo "${bin}" >> $GITHUB_PATH`);
} else if (process.platform == 'win32') {
  if (mongoVersion != '5.0') {
    throw `MongoDB version not supported on Windows: ${mongoVersion}`;
  }

  run(`sc config MongoDB start= auto`);
  run(`sc start MongoDB`);
} else {
  if (mongoVersion != '5.0' || image == 'ubuntu22') {
    if (fs.existsSync(`/var/log/mongodb`)) {
      // remove previous version
      run(`sudo apt-get purge mongodb-org*`);
      run(`sudo rm -r /var/log/mongodb /var/lib/mongodb`);
    }

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
