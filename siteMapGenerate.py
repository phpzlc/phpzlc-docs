---
layout: null
---
#!/usr/bin/python

hosts = ["github-site-map.txt", "https://phpzlc.github.io"], ['gitee-site-map.txt', "https://phpzlc.gitee.io"]

urls = [
           "",
           {% for post in site.posts %}
           "{{ post.url }}"{% unless forloop.last %},{% endunless %}
           {% endfor %}
       ]

for host in hosts:
   content = ""
   for url in urls:
      content += host[1] + url + '\n'
   f = open(host[0],'w')
   f.write(content)
