var authors = {
    1: {
        "no": 1,
        "name": "JayHe"
    },
    2: {
        "no": 2,
        "name" : "ExodusHT"
    }
};

function getAuthor(no, key) {
    if(key == undefined){
        key = 'name';
    }

    return authors[no][key];
}