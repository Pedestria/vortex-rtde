import React, {Component} from 'react'
import ReactDOM from 'react-dom'
// const OtherThing = React.lazy(() => import('./Com.jsx'))
import './styles.css'
import Logo from '../img/1200px-React-icon.png'

class MainComponent extends Component{

    render(){
        return(
            <div>
                <h1>Test WebApp</h1>
                <p>I am a Paragraph Describing Stuff!</p>
                <OtherComponent/>
                {/* //<Suspense fallback={<h1>Loading...</h1>}> */}
                    {/* <OtherThing/> */}
                {/* </Suspense> */}
                {/* <img src={Logo}></img> */}
            </div>
        );
    } 
}

class OtherComponent extends Component {

    render(){
        return(
            <div>
                <h1>Other Component Here!</h1>
            </div>
        );
    }
}

ReactDOM.render(<MainComponent/>, document.getElementById('root'));
