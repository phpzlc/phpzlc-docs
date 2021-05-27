// 核心开发者
var kernelAuthors = [
  1, 2, 3
];

// 历史维护者
var authors = {
  1: {
    "no": 1,
    "name": "CJayHe",
    "role": "作者",
    "gitHub": "https://github.com/CJayHe",
    "starUrl": "https://img.shields.io/github/stars/CJayHe?style=social",
    "qq": "1044295598",
    "mailbox": "1044295598@qq.com",
    "avatar": "/assets/images/member/CJayHe.jpeg",
    "description": "贡献：框架作者、发起者、推动者",
    "date": "2019-11-12",
    "show": "1",
  },
  2: {
    "no": 2,
    "name": "ExodusHT",
    "role": "PHP工程师",
    "gitHub": "https://github.com/ExodusHT",
    "starUrl": "https://img.shields.io/github/stars/ExodusHT?style=social",
    "qq": "",
    "mailbox": "",
    "avatar": "/assets/images/member/ExodusHT.jpeg",
    "description": "贡献：Demo开发,核心库和组件库开发工作",
    "date": "2019-11-12",
    "show": "1",
  },
  3: {
    "no": 3,
    "name": "Noir",
    "role": "前端工程师",
    "gitHub": "https://github.com/qiesunl",
    "starUrl": "https://img.shields.io/github/stars/qiesunl?style=social",
    "qq": "",
    "mailbox": "",
    "avatar": "/assets/images/member/qiesunl.jpeg",
    "description": "贡献：网站的设计开发工作",
    "date": "2020-12-15",
    "show": "1",
  },
  4: {
    "no": 4,
    "name": "匿名",
    "role": "前端工程师",
    "starUrl": "",
    "gitHub": "",
    "qq": "",
    "mailbox": "",
    "avatar": "/assets/images/member/niming.jpeg",
    "description": "尚未公开匿名的贡献者",
    "date": "2020-12-15",
    "show": "0",
  },
  5: {
    "no": 5,
    "name": "Pan_lx",
    "role": "后端工程师",
    "gitHub": "https://github.com/ShiveringPan",
    "starUrl": "https://img.shields.io/github/stars/ShiveringPan?style=social",
    "qq": "",
    "mailbox": "",
    "avatar": "/assets/images/member/ShiveringPan.jpeg",
    "description": "贡献：内核UUID算法改进",
    "date": "2021-05-14",
    "show": "1",
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