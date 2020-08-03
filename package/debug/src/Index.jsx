import React from 'react'
import ReactDOM from 'react-dom'
import '../css/main.css'

import Logo from '../../public/vortex-embedded.png';

class DebugApp extends React.Component {
    render(){
        return(
            <div>
                <header className="bar">
                    <img src={Logo}></img>
                </header>
                <h1>Welcome to Vortex Debug Menu!!</h1>
            </div>
        );
    }
}

ReactDOM.render(<DebugApp/>,document.getElementById("root"));