#!/bin/bash

cd ../src
make
path=`pwd`
#cd ../service
#path=`pwd`/../src
echo $path
"${path}/megainit"
#awk "{print $10"${path}/megainit"}" test.service
#paste -d -s "${path}/megainit"
#sed -i s/$/ tes / bin.txt > bin.txt

