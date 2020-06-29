import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class Test extends Component {

    render(){
        return(
            <div>
                <h1>Hello From React and Vortex!</h1>
            </div>
        );
    }
}

ReactDOM.render(<Test/>,document.getElementById('root'));