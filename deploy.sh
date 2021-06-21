!/bin/bash
cd ../
echo -e "git pull"
/usr/bin/git pull 2>&1
echo -e "\n\代码生成"
jekyll build
echo -e "\n\build ok"