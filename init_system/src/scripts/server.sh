#!/usr/bin

cd ../../rover

bash run_build.sh
source devel/setup.bash

roslaunch rover_server server.launch

