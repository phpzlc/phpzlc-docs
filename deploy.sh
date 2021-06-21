!/bin/bash

cd ../
echo -e "git pull"
/usr/bin/git pull 2>&1
echo -e "\njekyll build"
jekyll build