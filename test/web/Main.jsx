import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { OtherThing } from './Com.jsx'

class MainComponent extends Component{

    render(){
        return(
            <div>
                <h1>Test WebApp</h1>
                <p>I am a Paragraph Describing Stuff!</p>
                <OtherThing/>
            </div>
        );
    }
}

ReactDOM.render(<MainComponent/>, document.getElementById('root'));