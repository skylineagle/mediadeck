#!/bin/bash

# Stream test video pattern to RTSP server
gst-launch-1.0 -vv videotestsrc ! videoconvert ! x264enc ! h264parse ! queue ! rtspclientsink latency=0 protocols=tcp location=rtsp://127.0.0.1:8554/$1
