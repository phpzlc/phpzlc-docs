var authors = {
    1: {
        "no": 1,
        "name": "JayHe",
        "gitHub": "",
        "qq": "",
        "mailbox": ""
    },
    2: {
        "no": 2,
        "name" : "ExodusHT",
        "gitHub": "",
        "qq": "",
        "mailbox": ""
    },
    3: {
        "no": 3,
        "name" : "Noir",
        "gitHub": "",
        "qq": "",
        "mailbox": ""
    },
    4: {
        "no": 4,
        "name" : "匿名",
        "gitHub": "",
        "qq": "",
        "mailbox": ""
    }
};

function getAuthor(no, key) {
    if(key == undefined){
        key = 'name';
    }

    return authors[no][key];
}