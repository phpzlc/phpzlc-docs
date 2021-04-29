#!/bin/bash

function sitemap()
{
    rm -f $1

    echo $2 >> $1

    find _site/blog -name '*.html' -type f -print0 | while IFS= read -r -d $'\0' file;
        do echo ${file/_site/$2} >> $1
    done

    find _site/doc -name '*.html' -type f -print0 | while IFS= read -r -d $'\0' file;
        do echo ${file/_site/$2} >> $1
    done
}

sitemap sitemap.txt https://phpzlc.github.io

sitemap gitee-sitemap.txt https://phpzlc.gitee.io

