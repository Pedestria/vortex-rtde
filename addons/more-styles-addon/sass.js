const {readFile} = require('fs/promises');
const path = require('path');
const {render} = require("node-sass")
const {promisify} = require('util')
var renderAsync = promisify(render);

function ResolveRelative(from,to){
    return path.join(path.dirname(from),to);
}

async function func(filename){

    let importCapturerRegex = /^@import +(?:(?=["|'])(["|']([\w.\/]+)["|']))/gm
    let sass = (await readFile(filename)).toString();
    let includeDirs = []
    while(importCapturerRegex.exec(sass) !== null) {
        let result = path.dirname(ResolveRelative(filename,RegExp.$2));
        if(!includeDirs.includes(result)){
            includeDirs.push(result);
        }
    }

    console.log(includeDirs);

    return (await renderAsync({data:sass,includePaths:includeDirs})).css.toString();

}

func("./test/hello.scss").catch(err=>console.log(err)).then(value =>
    console.log("Success! Here it is: \n \n"+value))


