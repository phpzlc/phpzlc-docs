var authors = {
    1: {
        "no": 1,
        "name": "JayHe"
    },
    2: {
        "no": 2,
        "name" : "ExodusHT"
    },
    3: {
        "no": 3,
        "name" : "Noir"
    }
};

function getAuthor(no, key) {
    if(key == undefined){
        key = 'name';
    }

    return authors[no][key];
}