!/bin/bash

cd ../
echo -e "\ngit pull\n"
/usr/bin/git pull 2>&1
echo -e "\nJekyll build\n"
/usr/local/bin/jekyll build --trace