// Filesystems
const { readFileSync, writeFileSync } = require('fs');
const getFileString = filename => readFileSync(filename).toString();

// Constants
const regex = {
  dataPoints: /{{ data(\[.*\])* }}/g,
  script: /{{ script\[(.*)\] }}/g,
};


function replaceRecordColumns(mapping, record) {
  const new_record = {};
  Object.keys(mapping).forEach(key => {
    if (mapping.hasOwnProperty(key) && record.hasOwnProperty(mapping[key])){
      new_record[key] = record[mapping[key]];
    }
  });
  return new_record;
}

// Replacements
const replaceDataColumns = (mapping, data) => data.map(record => replaceRecordColumns(mapping, record));


// Replace data marks to data points
String.prototype.applyDataPoints = function(dataPoints) {
  let index = 0;
  return this.replace(regex.dataPoints, function() {
    const data = dataPoints[index];
    index = index + 1;
    return `JSON.parse('${JSON.stringify(data)}')`;
  });
};


// Replace script marks to tags
const scriptTag = scriptName => `<script src="https://canvasjs.com/assets/script/${scriptName}"></script>`

String.prototype.replaceScriptMark = function() {
  return this.replace(regex.script, scriptTag("$1"));
};


// Apply data function for exports
function applyData(templateStr, dataPoints, columnMappings) {
  const replacedDataPoints = [];
  for (let i = 0; i < dataPoints.length; i++) {
    replacedDataPoints.push(replaceDataColumns(columnMappings[i], dataPoints[i]));
  }
  return templateStr.applyDataPoints(replacedDataPoints).replaceScriptMark();
}


// Arguments preprocessing
function extractMapping(argv) {
  const mappings = {};
  const mappingKeys = Object.keys(argv).filter(key => key != '_');
  mappingKeys.forEach(key => {
    mappings[key] = argv[key];
  });
  return mappings;
}


// Main function
function main(argv) {
  if (argv._.length < 2) {
    console.log('Usage: node apply.js <template path> <data path> [--<template-column>=<data-column>]...');
    process.exit(1);
  }
  
  const filePath = {
    template: (argv._)[0],
    data: (argv._)[1],
    output: 'out.html',
  };

  // Extract mapping between template and data from arguments
  const columnMapping = extractMapping(argv);
  
  const templateStr = getFileString(filePath.template);
  const data = JSON.parse(getFileString(filePath.data));

  // Count number of data points needed by template
  const templateDataPointsNum = templateStr.match(regex.dataPoints).length;

  // Fill mapping object reference to all elements in an array
  const columnMappings = Array(templateDataPointsNum).fill(columnMapping);

  // Seperate data to data points
  const dataPoints = [];
  for (let i = 0, n = data.length/templateDataPointsNum; i < templateDataPointsNum; i++) {
    const start = i * n;
    const end = (i + 1) * n;
    dataPoints.push(data.slice(start, end));
  }

  const targetStr = applyData(templateStr, dataPoints, columnMappings);

  writeFileSync(filePath.output, targetStr);
}

if (require.main === module) {
  main(require('minimist')(process.argv.slice(2)));
}

exports.applyData = applyData;
