#!/bin/bash

url='https://canvasjs.com/fdm/chart/'
filename='example.zip'
examplePath='examples'
extractTarget="*/${examplePath}/*"

rm -Rf $examplePath
curl -o $filename $url
unzip $filename $extractTarget
rm -f $filename
