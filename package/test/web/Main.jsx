import React, {Component} from 'react'
import ReactDOM from 'react-dom'
// const OtherThing = React.lazy(() => import('./Com.jsx'))
import './styles.css'
import _ from 'lodash'
import {Com} from './HelloVue.js'
import Logo from '../img/vortex-bright-logo.png'

class MainComponent extends Component{
    state = {bird:"bo bo bo bo bo bo bo"};


    render(){
        return(
            <div>
                <img src={Logo}></img>
                <button className="stupid">Stupid Button</button>
                <h1>LivePush Is AWESOME!</h1>
                <h1>So Explicit</h1>
                <p>I am a Paragraph Describing Stuff!</p>
                <OtherComponent/>
                <Com/>
                <h3 onClick={(e)=> {this.setState({bird:'YARN CAT!!'})}}>Not So Profane!</h3>
                {this.state.bird}
                {/* //<Suspense fallback={<h1>Loading...</h1>}> */}
                    {/* <OtherThing/> */}
                {/* </Suspense> */}
            </div>
        );
    } 
}

class OtherComponent extends Component {

    render(){
        return(
            <div>
                <h1>Nothing Special</h1>
                <h1>Other Component Here!</h1>
            </div>
        );
    }
}

console.log(_.intersection([3,4,2],[4,1,2]))

ReactDOM.render(<MainComponent/>, document.getElementById('root'));
