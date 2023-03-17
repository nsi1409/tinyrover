#!/bin/bash

ffmpeg -i hockey.mp4 -v 0 -vcodec mpeg4 -f mpegts udp://127.0.0.1:23000
