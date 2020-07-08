import React, { Component } from 'react'

export default class OtherThing extends Component{

    render(){
        return(<h2>Hello From Vortex Planet Using Dynamic Import!!</h2>);
    }
}

define(['lodash'], function(lodash) {
    var _ = lodash.default
    console.log(_.difference([1,2,3],[1,2,4]));
})