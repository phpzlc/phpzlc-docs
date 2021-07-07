import requests
import json
import time
import sys
import hashlib
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup


if len(sys.argv) != 6 :
    print("Usage:")
    print(sys.argv[0], "site_url sitemap_url token username repo_name")

site_url = sys.argv[1]
sitemap_url = sys.argv[2]
token = sys.argv[3]
username = sys.argv[4]
repo_name = sys.argv[5]

def get_comments(session, md5_label=''):
    issues = []
    url = 'https://api.github.com/repos/' + username + '/' + repo_name + '/issues?q=is&labels=Gitalk,' + md5_label
    r = session.get(url=url)
    data = json.loads(r.text)
    for issue in data:
        issues.append(issue['body'].split('?')[0])
    
    return issues
    

def get_posts():
    post_urls = []
    r = requests.get(sitemap_url)
    root = ET.fromstring(r.text)

    for child in root:
        # 只对文章页初始化评论，需要注意确认文章目录名是不是为 post
        post_urls.append(child[0].text)

    return post_urls
    

def get_post_title(url):
    r = requests.get(url=url)
    soup = BeautifulSoup(r.text, 'html.parser')
    # 我的博客会自动给文章标题加上  - Linux Shell 后缀，需要去掉，当然不去掉也行
    return soup.title.string.split(' - Linux Shell')[0]

def init_gitalk(session, not_initialized):
    github_url = "https://api.github.com/repos/" + username + "/" + repo_name + "/issues"

    for url in not_initialized:
        title = get_post_title(url=url)
        post_path = url.split(site_url)[-1]
        # issuse lable 限制最大长度为50，使用md5防止超长导致报错
        m = hashlib.md5()
        m.update(post_path.encode('utf-8'))
        gtalk_id = post_path
        issue = {
            'title': title,
            'body': url,
            'labels': ['Gitalk', gtalk_id]
        }
        print('[{}] checking...'.format(title))
        is_existed = get_comments(session=session, md5_label=gtalk_id)
        if is_existed:
            print("issues [", gtalk_id,"] already exist")
            continue
        print('[{}] initializing...'.format(title))
        resp = session.post(url=github_url, data=json.dumps(issue))
        if resp.status_code == 201:
            print('Created')
        else:
            print('issuse: ', issue)
            print('failed: ', resp.text)
            break

def main():
    # 暂停5分钟，主要是为了等待 vercel 编译新的文章
    # print('sleep 300s for waiting hugo build...')
    # time.sleep(300)
    session = requests.Session()
    session.auth = (username, token)
    session.headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.59 Safari/537.36 Edg/85.0.564.30'
    }

    existing_comments = get_comments(session=session)
    post_urls = get_posts()
    not_initialized = list(set(post_urls) ^ set(existing_comments))

    init_gitalk(session=session, not_initialized=not_initialized)


main()
