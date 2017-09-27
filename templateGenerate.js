// Filesystems
const path = require('path');
const { readFileSync, writeFileSync } = require('fs');
const getFileString = filename => readFileSync(filename).toString();

// Regular Expressions
const regex = {
  scriptTags: /<script src=".*\/(.*?canvasjs.*?\.js)"><\/script>/g,
  dataPoints: /(?:dataPoints:\s*?)(\[(.|\s)*?\}(,|\s)*?\])/g,
};


function dataPointReplacer(match, p1) {
  const dataPoints = eval(p1);
  const columnNames = (dataPoints.length < 1)? []: Object.keys(dataPoints[0]);
  const labels = columnNames.reduce((prev, curr) => prev.concat(`[${curr}]`), "");
  const mark = `dataPoints: {{ data${labels} }}`;
  return mark;
}

String.prototype.replaceScript = function() {
  return this.replace(regex.scriptTags, "{{ script[$1] }}");
}

String.prototype.replaceDataPoint = function() {
  return this.replace(regex.dataPoints, dataPointReplacer);
}

function templateGenerate(raw) {
  return raw.replaceScript().replaceDataPoint();
}

function main(argv) {
  if (argv._.length < 1) {
    console.log(`Usage: node ${path.basename(__filename)} <example path>`);
    process.exit(1);
  }

  const filePath = {
    example: (argv._)[0],
    template: (argv._)[0].replace(/\..*$/, ".template"),
  };

  const targetStr = templateGenerate(getFileString(filePath.example));
  writeFileSync(filePath.template, targetStr);
}

if (require.main === module) {
  main(require('minimist')(process.argv.slice(2)));
}

module.exports = templateGenerate;
