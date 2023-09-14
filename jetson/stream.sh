#!/bin/bash

ffmpeg -i /dev/video0 -v 0 -vcodec mpeg4 -f mpegts udp://127.0.0.1:23000
