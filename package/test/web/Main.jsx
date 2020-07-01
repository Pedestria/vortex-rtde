import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { OtherThing } from './Com.jsx'
import './styles.css'
import Logo from '../img/1200px-React-icon.png'

class MainComponent extends Component{

    render(){
        return(
            <div>
                <h1>Test WebApp</h1>
                <p>I am a Paragraph Describing Stuff!</p>
                <OtherThing/>
                <img src={Logo}></img>
            </div>
        );
    }
}

ReactDOM.render(<MainComponent/>, document.getElementById('root'));