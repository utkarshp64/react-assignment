import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

const Profile = () => {

    const [user, setUser] = useState({
        firstname: null,
        lastname: null,
        email: null,
        address: null,
        dob: null,
        company: null
    });

    useEffect(() => {
        async function fetchData() {
            const resp = await fetchProfile();
            setUser(resp);
        }

        fetchData();
    }, []);

    async function fetchProfile() {
        return axios.get("/api/users")
            .then(response => response.data.data)
            .catch(error => {
                console.error("fetchProfile Error", error.response)
            })
    }

    return (
        <div>
            <nav className="navbar navbar-light bg-light justify-content-between">
                <div className="navbar-brand mr-2">Subscription App - Profile</div>
                <div className="btn-toolbar">
                    <div className="btn-group" role="group" aria-label="Third group">
                        <Link type="button" className="btn btn-info btn-sm mr-1 ml-1" to={'/'}>Home</Link>
                    </div>
                    <div className="btn-group" role="group" aria-label="Third group">
                        <button type="button" className="btn btn-danger btn-sm mr-1 ml-1">Logout</button>
                    </div>
                </div>
            </nav>
            <div className="card" style={{width: "600px", margin: "30px auto"}}>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-sm-3">Firstname</div>
                            <div className="col-sm-1">:</div>
                            <div className="col-sm-8">{user.firstname}</div>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-sm-3">Lastname</div>
                            <div className="col-sm-1">:</div>
                            <div className="col-sm-8">{user.lastname}</div>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-sm-3">Email</div>
                            <div className="col-sm-1">:</div>
                            <div className="col-sm-8">{user.email}</div>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-sm-3">DOB</div>
                            <div className="col-sm-1">:</div>
                            <div className="col-sm-8">{user.dob}</div>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-sm-3">Address</div>
                            <div className="col-sm-1">:</div>
                            <div className="col-sm-8">{user.address}</div>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-sm-3">Company</div>
                            <div className="col-sm-1">:</div>
                            <div className="col-sm-8">{user.company}</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Profile;
