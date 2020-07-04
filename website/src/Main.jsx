import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import '../styles/main.css'
import ReactLogo from '../img/1200px-React-icon.png'

class Test extends Component {

    render(){
        return(
            <div>
                <h1>Hello From React and Vortex!</h1>
                <img src={ReactLogo}></img>
            </div>
        );
    }
}

ReactDOM.render(<Test/>,document.getElementById('root'));