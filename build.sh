#!/bin/bash

echo "Create frontend production build"
cd frontend/
sudo npm run build

echo "Copy build to backend"
sudo rm -rf ../backend/build
sudo cp -r build/ -r ../backend

echo "Run now"
cd ../backend
now
