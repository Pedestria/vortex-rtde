import React, {Component,Fragment} from 'react'
import ReactDOM from 'react-dom'
// const OtherThing = React.lazy(() => import('./Com.jsx'))
import './styles.css'
import Logo from '../img/1200px-React-icon.png'

class MainComponent extends Component{

    state = {bird:"bo bo bo bo bo bo bo"};

    render(){
        return(
            <div>
                <Fragment>
                    <h1>Fragment Here!</h1>
                </Fragment>
                <h1>Test WebApp</h1>
                <p>I am a Paragraph Describing Stuff!</p>
                <h2>Stop Being</h2>
                <h4>Give me some love now!!</h4>
                <h3 onClick={(e)=> {this.setState({bird:'YARN CAT!!'})}}>Not So Profane!</h3>
                {this.state.bird}
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
