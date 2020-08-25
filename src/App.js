import React, {useState} from 'react';
import {BrowserRouter as Router, Redirect, Route} from 'react-router-dom'
import './App.css';
import Login from './components/Login/Login';
import Register from "./components/Register/Register";
import Home from './components/Home/Home';
import Profile from "./components/Profile/Profile";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    const onLogin = (event) => {
        console.log("onLogin", event);
        setLoggedIn(event);
    }

    return (
        <Router>
            <div>
                <Route path="/login" render={(pops) => <Login {...pops} loginHandler={onLogin}/>}/>
                <Route path="/register" render={(pops) => <Register {...pops} isLogin={loggedIn} logoutHandler={onLogin}/>}/>
                <Route path="/profile" render={(pops) => <Profile {...pops} isLogin={loggedIn}/>}/>
                <Route path="/home" render={(pops) => <Home {...pops} isLogin={loggedIn} logoutHandler={onLogin}/>}/>
                <Route exact path="/">
                    {loggedIn ? <Redirect to="/home"/> : <Redirect to="/login"/>}
                </Route>
            </div>
        </Router>
    );
}

export default App;
