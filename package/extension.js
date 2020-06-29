function getFileExtension(filename){
    let i = filename.lastIndexOf('.')
    return filename.slice(i)
}


console.log(getFileExtension(`Hello.babel.css`))