#!/bin/bash

echo "Create frontend production build"
cd frontend/
npm run build

echo "Copy build to backend"
rm -rf ../backend/build
cp -r build/ -r ../backend

echo "Run now"
cd ../backend
now -e db_url=@db_url
