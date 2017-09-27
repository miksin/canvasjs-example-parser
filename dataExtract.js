// File system
const path = require('path');
const { readFileSync, writeFileSync } = require('fs');
const getFileString = filename => readFileSync(filename).toString();

// Regular Expressions
const regex = {
  dataPoints: /(?:dataPoints:\s*?)(\[(.|\s)*?\}(,|\s)*?\])/g,
};

function dataExtract(raw) {
  const matches = [];
  let match = regex.dataPoints.exec(raw);
  while (match) {
      matches.push(eval(match[1]));
      match = regex.dataPoints.exec(raw);
  }
  return matches;
}

function main(argv) {
  if (argv._.length < 1) {
    console.log(`Usage: node ${path.basename(__filename)} <example path>`);
    process.exit(1);
  }

  const filePath = {
    example: (argv._)[0],
    data: [(argv._)[0].replace(/\..*$/, ".json")],
  };

  const raw = getFileString(filePath.example);
  const dataPoints = dataExtract(raw);

  if (dataPoints.length > filePath.data.length) {
    filePath.data = dataPoints.map((value, index) => filePath.example.replace(/\..*$/, `.${index}.json`));
  }

  for (let i = 0; i < filePath.data.length; i++) {
    writeFileSync(filePath.data[i], JSON.stringify(dataPoints[i], null, 2));
    console.log(`Extract data: ${filePath.data[i]}`);
  }
}

if (require.main === module) {
  main(require('minimist')(process.argv.slice(2)));
}

module.exports = dataExtract;
