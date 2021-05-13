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
        "name" : "ExodusHT",
        "gitHub": "https://github.com/ExodusHT",
        "qq": "",
        "mailbox": ""
    },
    3: {
        "no": 3,
        "name" : "Noir",
        "gitHub": "https://github.com/qiesunl",
        "qq": "",
        "mailbox": "",
        "avatar": ""
    },
    4: {
        "no": 4,
        "name" : "匿名",
        "gitHub": "",
        "qq": "",
        "mailbox": "",
        "avatar": ""
    }
};

function getAuthor(no, key) {
    if(key == undefined){
        key = 'name';
    }

    return authors[no][key];
}