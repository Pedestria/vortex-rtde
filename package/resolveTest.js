const fs = require('fs/promises')

async function minifyCss () {
    let styles = await fs.readFile('./test/web/styles.css','utf-8')

    let o = {origina:styles}

    let finalString = ""

    let lineBreak = '\r\n'

    while(styles.includes(lineBreak)){
        styles = styles.replace(lineBreak,"")
    }

    for(let i = 0; i<styles.length;i++){
        if(styles[i] !== " "){
            finalString += styles[i]
        }
    }

    // console.log(o)


    fs.writeFile('./compress.css',finalString).then(() => {
        console.log('done!')
    })

}

minifyCss().catch(err => console.log(err))



