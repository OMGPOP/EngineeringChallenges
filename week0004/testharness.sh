#!/bin/bash
if [ -x $0 ]
then
  exit 
fi

for file in *
do
  if [ -x $file ]
  then
    echo $file
    time ./$file input.txt &> /dev/null 
    echo -e "============\n\n\n"
  fi
done
