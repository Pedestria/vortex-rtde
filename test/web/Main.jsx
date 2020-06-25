import React, {Component} from 'react'
import ReactDOM from 'react-dom'

class MainComponent extends Component{

    render(){
        return(
            <h1>Welcome to Vortex and React!!!!!!!!!!!!!!!
                And CONGRADULATIONS!!! YOU BUILT A WORKING JS BUNDLER FOR WEB!!!!!!!
            </h1>
        );
    }
}

ReactDOM.render(<MainComponent/>, document.getElementById('root'));