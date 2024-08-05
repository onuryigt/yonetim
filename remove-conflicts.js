const fs = require('fs');
const path = require('path');

const conflicts = [];

function traverseDirectory(directory) {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const fullPath = path.join(directory, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      traverseDirectory(fullPath);
    } else if (path.extname(file) === '.js' || path.extname(file) === '.css') {
      conflicts.push(fullPath);
    }
  });
}

function removeConflicts() {
  conflicts.forEach((file) => {
    let data = fs.readFileSync(file, 'utf8');
    const conflictStart = data.indexOf('<<<<<<<');
    if (conflictStart !== -1) {
      const conflictEnd = data.indexOf('>>>>>>>') + 7;
      data = data.slice(0, conflictStart) + data.slice(conflictEnd);
      fs.writeFileSync(file, data, 'utf8');
      console.log(`Conflicts removed from ${file}`);
    }
  });
}

const directories = ['src', 'backend'];

directories.forEach((dir) => {
  traverseDirectory(dir);
});

removeConflicts();