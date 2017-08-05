#!/bin/bash

#####
# Helper script for pretty formatting of json files
#####

for file in `ls -a app/finalorders | grep -v \\\.\$`; do
  cat app/finalorders/$file | python -mjson.tool > tmp.json
  rm app/finalorders/$file
  mv tmp.json app/finalorders/$file
done
