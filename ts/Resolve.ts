import path = require('path')
import resolve = require('resolve')

export function LocalizedResolve(rootFileDirToEntry:string,dependencyLocalDir:string){

    if(rootFileDirToEntry == dependencyLocalDir){
        return rootFileDirToEntry
    }
    else if(path.dirname(dependencyLocalDir) == './'){
        return dependencyLocalDir
    }

    let dirname = path.dirname(rootFileDirToEntry)
    let localFilePath = dependencyLocalDir

    return './' + path.join(dirname,localFilePath)

}

export function ResolveLibrary(packageName:string){
    let packageIndexDirname = resolve.sync(packageName)

    if(packageIndexDirname.search('node_modules') == -1){
        throw new Error('Package Does not Exist!')
    }
    else{
        let i = packageIndexDirname.search('node_modules')
        return './' + packageIndexDirname.slice(i)
    }

}