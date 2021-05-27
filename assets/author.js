var authors = {
  1: {
    "no": 1,
    "name": "CJayHe",
    "gitHub": "https://github.com/CJayHe",
    "qq": "1044295598",
    "mailbox": "1044295598@qq.com",
    "avatar": ""
  },
  2: {
    "no": 2,
    "name": "ExodusHT",
    "gitHub": "https://github.com/ExodusHT",
    "qq": "",
    "mailbox": ""
  },
  3: {
    "no": 3,
    "name": "Noir",
    "gitHub": "https://github.com/qiesunl",
    "qq": "",
    "mailbox": "",
    "avatar": ""
  },
  4: {
    "no": 4,
    "name": "匿名",
    "gitHub": "",
    "qq": "",
    "mailbox": "",
    "avatar": ""
  }
};

function getAuthor(no, key) {
  if (key == undefined) {
    key = 'name';
  }

  return authors[no][key];
}

function setAuthor() {
  var no;
  var name;
  var github;
  var qq;
  var mailbox;
  var avatar;

  var html = '';

  for (let key in authors) {
    no = authors[key].no;
    name = authors[key].name;
    github = authors[key].github;
    qq = authors[key].qq;
    mailbox = authors[key].mailbox;
    avatar = authors[key].avatar;

    html += `
    <a href="${github}">
      <img class="img-p" src="/assets/images/member/CJayHe.jpeg" alt="">
      <div class="user-detail">
        <span class="span-p">${name}</span>
        <span class="span-p">作者</span>
        <span class="span-p">2019-11-12</span>
        <img class="img-p-2" src="https://img.shields.io/github/stars/CJayHe?style=social" alt="" />
        <span class="span-con">贡献：框架作者、发起者、推动者</span>
      </div>
    </a>
    `
  }
}

setAuthor();