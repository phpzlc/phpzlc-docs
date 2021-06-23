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

function getAuthor(no) {
  return authors[no]?.name;
}

// 渲染历史贡献者
function setAuthor() {
  var no;
  var name;
  var role;
  var github;
  var starUrl;
  var qq;
  var mailbox;
  var avatar;
  var description;
  var date;
  var show;
  var html = '';
  for (let key in authors) {
    if (authors[key].show == 0) { } else {
      no = authors[key].no;
      name = authors[key].name;
      role = authors[key].role;
      github = authors[key].gitHub;
      starUrl = authors[key].starUrl;
      qq = authors[key].qq;
      mailbox = authors[key].mailbox;
      avatar = authors[key].avatar;
      description = authors[key].description;
      date = authors[key].date;
      show = authors[key].show;
      html = `
      <a href="${github}">
        <img class="img-p" src="${avatar}" alt="">
        <div class="user-detail">
          <span class="span-p">${name}</span>
          <span class="span-p">${role}</span>
          <span class="span-p">${date}</span>
          <img class="img-p-2" src="${starUrl}" alt="" />
          <span class="span-con">${description}</span>
        </div>
      </a>` + html
    }
  }
  $("#authors").append(html);
}

// 渲染核心维护者成员
function setCore() {
  var html2 = '';
  for (let i = 1; i <= kernelAuthors.length; i++) {
    var github2 = authors[i].gitHub;
    var avatar2 = authors[i].avatar;
    var name2 = authors[i].name;
    var role2 = authors[i].role;
    var starUrl2 = authors[i].starUrl;
    html2 += `
    <a href="${github2}" class="author-2">
          <img class="author-img" src="${avatar2}" alt="">
          <div class="author-right">
            <p>名称：<span>${name2}</span></p>
            <p>角色：<span>${role2}</span></p>
            <img src="${starUrl2}" alt="" />
          </div>
        </a>`
  }
  $("#core").append(html2);
}

$(function () {
  setCore();
  setAuthor();
})