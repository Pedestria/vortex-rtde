import React, { Component } from 'react'

export default class OtherThing extends Component{

    render(){
        return(<h2>Hello From Vortex Planet Using Dynamic Import!!</h2>);
    }
}

define(['lodash','object-assign'], function(lodash,_assign) {
    var _ = lodash.default
    console.log(_.chunk(['a', 'b', 'c', 'd'], 2))
    console.log(_assign.default({foo:3}, {mama:4}, {peolo:23}))
})