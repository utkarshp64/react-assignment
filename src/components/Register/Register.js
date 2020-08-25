import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import axios from "axios";

const Register = () => {

    const history = useHistory();

    const [loader, setLoader] = useState(false);

    const [state, setState] = useState({
        firstname: null,
        lastname: null,
        email: null,
        password: null,
        address: null,
        dob: null,
        company: null
    })

    const handleChange = (e) => {
        const {id, value} = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleSignup = () => {
        setLoader(true)
        axios.post("api/users", state)
            .then(response => {
                setLoader(false)
                console.log("Signup Response", response.data)
                history.push('/login');
            })
            .catch(error => {
                const _error = error.response;
                setLoader(false)
                console.log("Signup Error Response", {
                    status: _error.status,
                    data: _error.data
                })
            })
    }

    return (
        <>
            <div>
                <div className={"container mt-5"}>
                    <div className={"container mt-3"} style={{width: '600px'}}>
                        <div className={"card"}>
                            <div className={"card-body"}>
                                <div className={"card-title text-center"}>
                                    <h3>Create Account</h3>
                                </div>
                                <div>
                                    <form>
                                        <div className="form-group mt-2">
                                            <label htmlFor="firstname">Password</label>
                                            <input onChange={handleChange} type="text"
                                                   className="form-control" id="firstname"
                                                   placeholder="First Name"/>
                                        </div>
                                        <div className="form-group mt-2">
                                            <label htmlFor="lastname">Password</label>
                                            <input onChange={handleChange} type="text"
                                                   className="form-control" id="lastname"
                                                   placeholder="Last Name"/>
                                        </div>
                                        <div className="form-group mt-2">
                                            <label htmlFor="exampleInputEmail1">Email address</label>
                                            <input onChange={handleChange} type="email" className="form-control"
                                                   id="email"
                                                   aria-describedby="emailHelp" placeholder="Enter email"/>
                                            <small id="emailHelp" className="form-text text-muted">We'll never share
                                                your email with anyone else.</small>
                                        </div>
                                        <div className="form-group mt-2">
                                            <label htmlFor="exampleInputPassword1">Password</label>
                                            <input onChange={handleChange} type="password"
                                                   className="form-control" id="password"
                                                   placeholder="Password"/>
                                        </div>
                                        <div className="form-group mt-2">
                                            <label htmlFor="address">Address</label>
                                            <textarea className="form-control" id="address" rows="2"/>
                                        </div>
                                        <div className="form-group mt-2">
                                            <label htmlFor="dob">Password</label>
                                            <input onChange={handleChange} type="text"
                                                   className="form-control" id="dob"
                                                   placeholder="YYYY-MM-DD"/>
                                        </div>
                                        <div className="form-group mt-2">
                                            <label htmlFor="company">Password</label>
                                            <input onChange={handleChange} type="text"
                                                   className="form-control" id="company"
                                                   placeholder="Company Name"/>
                                        </div>
                                        <button type="submit" className="btn btn-primary mt-3"
                                                onClick={handleSignup}>Signup
                                        </button>
                                        <Link to="/login" className={"btn btn-link"}
                                              style={{textDecoration: "none", paddingTop: "20px"}}>Already have
                                            account?</Link>
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
    // console.log("Loader", isLoad)
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

export default Register;
