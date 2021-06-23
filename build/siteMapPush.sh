#!/bin/bash

urls=();

function setUrls()
{
  urls=();

  urls+=("$1" "$1/module" "$1/about"  "$1/member" "$1/faqs")

  for file in `find _site/blog -name '*.html'`
  do
    url=${file/_site/$1}

    if !([[ $url =~ 'page' ]])
    then
       urls+=($url)
    fi
  done

  for file in `find _site/doc -name '*.html'`
  do
    urls+=(${file/_site/$1})
  done
}

function siteMapBaiduApi()
{
    rm -f $1

    setUrls $2

    for url in ${urls[@]}
    do
      echo $url >> $1
    done
}

function siteMap()
{
  cur_date="`date +%Y-%m-%d`"

  rm -f $1

  setUrls $2

  echo '<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' >> $1

  for url in ${urls[@]}
  do
    echo '<url>
<loc>'$url'</loc>
<lastmod>'$cur_date'</lastmod>
<changefreq>always</changefreq>
<priority>1.0</priority>
</url>' >> $1
  done

  echo '</urlset>' >> $1
}

# siteMap

siteMap sitemap.xml https://phpzlc.com

## github

siteMapBaiduApi sitemap.txt https://phpzlc.com

curl -H 'Content-Type:text/plain' --data-binary @sitemap.txt "http://data.zz.baidu.com/urls?site=https://phpzlc.github.io&token=HvZcn9CwVs2MMMVe"