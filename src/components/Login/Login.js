import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Login = ({loginHandler}) => {

    const history = useHistory();

    const [loader, setLoader] = useState(false);

    const [state, setState] = useState({
        email: null,
        password: null,
    })

    const handleLogin = () => {
        setLoader(true)
        axios.post("api/login", {
            email: state.email,
            password: state.password,
        })
            .then(response => {
                setLoader(false)
                console.log("Login Response", response.data)
                loginHandler(true);
                history.push('/home');
            })
            .catch(error => {
                const _error = error.response;
                setLoader(false)
                console.log("Login Error Response", {
                    status: _error.status,
                    data: _error.data
                })
            })
    }

    const handleChange = (e) => {
        const {id, value} = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    function checkLogin() {
        const cookie = Cookies.get("session");
        if (cookie) {
            loginHandler(true);
            history.push("/home");
        }
    }
    checkLogin();

    return (
        <>
            <div>
                <div className={"container mt-5"}>
                    <div className={"container mt-3"} style={{width: '600px'}}>
                        <div className={"card"}>
                            <div className={"card-body"}>
                                <div className={"card-title text-center"}>
                                    <h3>Login</h3>
                                </div>
                                <div>
                                    <form>
                                        <div className="form-group mt-2">
                                            <label htmlFor="exampleInputEmail1">Email address</label>
                                            <input onChange={handleChange} type="email" className="form-control"
                                                   id="email"
                                                   aria-describedby="emailHelp" placeholder="Enter email"/>
                                        </div>
                                        <div className="form-group mt-2">
                                            <label htmlFor="exampleInputPassword1">Password</label>
                                            <input onChange={handleChange} type="password"
                                                   className="form-control" id="password"
                                                   placeholder="Password"/>
                                        </div>
                                        <button type="button" className="btn btn-primary" style={{margin: "10px 0"}}
                                                onClick={handleLogin}>Sign In
                                        </button>
                                        <Link to="/register" className={"btn btn-link"}
                                              style={{textDecoration: "none"}}>create new
                                            account</Link>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Loader isLoad={loader}/>
            </div>
        </>
    )
}

const Loader = ({isLoad}) => {
    console.log("Loader", isLoad)
    return (
        <div>
            {isLoad && <div id="overlay" style={{display: "block"}}>
                <div className="spinner"/>
                <br/>
                Loading...
            </div>
            }
        </div>
    )
}

export default Login;
