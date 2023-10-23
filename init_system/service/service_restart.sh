#!/bin/bash

sudo systemctl --system daemon-reload
sudo systemctl start megainit.service
sudo systemctl enable megainit.service
sudo systemctl status megainit.service
