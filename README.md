# CanvasJS Example Parser

For reusability of data visualization examples provided by [CanvasJS](https://canvasjs.com/).

`canvasjs-example-parser` is consist of three main purposes.
- Generate reusable templates from examples.
- Extract embedded data from examples.
- Apply other data to templates.


## Prerequisite

- node v8.5.0
- npm v5.4.0


## Install npm modules

```
$ npm install
```


## Fetch CanvasJS examples

```
$ npm run fetch
```

## Quick example

#### Generate reusable templates from examples

Generate a template of `basic-line-chart`.

```
$ node templateGenerate.js examples/01-line-chart/basic-line-chart.html
```

The output template file will be in the same path as the source.

#### Extract embedded data from examples

Extract embedded data in `basic-line-chart` to a json file.

```
$ node dataExtract.js examples/01-line-chart/basic-line-chart.html
```

The output json file will be in the same path as the source.

#### Apply other data to templates

Embed other json file to `basic-line-chart` and specify the mapping of column names.

```
$ node applyData.js examples/01-line-chart/basic-line-chart.template example.json --x=a --y=b
```

The column `"a"` and `"b"` will be apply to the axis `"x"` and `"y"` of `basic-line-chart`, respectively.

The output data visulization file will be `output.html`.

- example.json

```
[
    {
        "a": 10,
        "b": 13
    },
    {
        "a": 20,
        "b": 53
    },
    {
        "a": 30,
        "b": 32
    },
    {
        "a": 40,
        "b": 28
    }
]
```

- Sepecify relationships of columns between templates and files

```
--<template-column-name>=<file-column-name>
```
