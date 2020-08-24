import React, {useEffect, useState} from "react";
import './Home.css';
import {Link, useHistory} from "react-router-dom";
import axios from "axios";

const Home = ({isLogin, logoutHandler}) => {

    const history = useHistory();

    const [subscription, setSubscription] = useState([]);

    const [products, setProducts] = useState([]);

    const [loader, setLoader] = useState(false);

    const [cardDetails, setCardDetails] = useState({
        card_number: null,
        exp_month: null,
        exp_year: null,
        cvv_number: null
    });

    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        setLoader(true);
        if (isLogin) {
            async function fetchData() {
                const resp1 = await fetchSubscription();
                const resp2 = await fetchProducts();
                for (let each of resp1) {
                    for (let item of resp2) {
                        if (each.price_id === item.id && each.status === 'active') {
                            item.subs = true;
                            break;
                        }
                    }
                }
                console.log("fetchData", {resp1, resp2});
                setSubscription(resp1);
                setProducts(resp2);
                setLoader(false);
            }

            fetchData();
        } else {
            setLoader(false);
            history.push('/login');
        }
    }, [history, isLogin]);

    async function fetchSubscription() {
        return axios.get("/api/subscriptions")
            .then(response => response.data.data)
            .catch(error => {
                console.error("fetchSubscription Error", error.response)
                return [];
            })
    }

    async function fetchProducts() {
        return axios.get("/api/products")
            .then(response => response.data.data)
            .catch(error => {
                console.error("fetchSubscription Error", error.response)
                return [];
            })
    }

    const handleChange = (e) => {
        const {id, value} = e.target
        setCardDetails(prevState => ({
            ...prevState,
            [id]: value
        }))
        console.log("handleChange", cardDetails);
    }

    const handleUnsubscribe = () => {
        console.log("handleUnsubscribe")
        setLoader(true);
        axios.put("/api/subscriptions", {})
            .then(response => response.data.data)
            .then(value => {
                fetchSubscription().then(value1 => setSubscription(value1))
                setLoader(false);
            })
            .catch(error => {
                setLoader(false);
                console.error("handlePayments Error", error.response)
            })
    }

    const handlePayments = () => {
        setLoader(true);
        console.log("handlePayments", cardDetails)
        const data = cardDetails;
        data["product_id"] = selectedProduct.id;
        axios.post("/api/subscriptions", data)
            .then(response => response.data.data)
            .then(value => {
                fetchSubscription().then(value1 => setSubscription(value1))
                setLoader(false);
            })
            .catch(error => {
                setLoader(false);
                console.error("handlePayments Error", error.response)
            })
    }

    const handleLogout = () => {
        axios.get("/api/login")
            .then(response => response.data)
            .then(value => {
                console.log("logout", value)
                history.push('/login');
                logoutHandler(false);
            })
            .catch(error => {
                console.error("logout Error", error.response)
            })
    }


    const handleSubscription = (value) => {
        const modelOpen = document.getElementById('modelOpen')
        console.log("handleSubscription", value);
        setSelectedProduct(value);
        modelOpen.click();
    }

    return (
        <div>
            <nav className="navbar navbar-light bg-light justify-content-between">
                <div className="navbar-brand mr-2">Subscription App - Home</div>
                <div className="btn-toolbar">
                    <div className="btn-group" role="group" aria-label="Third group">
                        <Link type="button" className="btn btn-info btn-sm mr-1 ml-1" to={'/profile'}>Profile</Link>
                    </div>
                    <div className="btn-group" role="group" aria-label="Third group" onClick={handleLogout}>
                        <Link type="button" className="btn btn-danger btn-sm mr-1 ml-1" to={'/login'}>Logout</Link>
                    </div>
                </div>
            </nav>
            <div className="card m-2">
                <div className="card-body">
                    <div className={"card-title"}>
                        <span className={"font-weight-bolder"}>User Subscription</span>
                    </div>
                    {
                        subscription.length === 0 ?
                            <div className={"form-text text-muted"}>Looks like currently you don't have any active
                                subscription
                            </div> :
                            subscription.map((value, index) => {
                                return <SubscriptionList key={index} status={value.status} nickname={value.name}
                                                         product={value.product_id} price={value.price_id}
                                                         onUnsubscribe={handleUnsubscribe}/>
                            })
                    }

                </div>
            </div>
            <div className={"m-3"}/>
            <div className="card m-2">
                <div className="card-body">
                    <div className={"card-title"}>
                        <span className={"font-weight-bolder"}>List of Subscription</span>
                        <span className={"form-text text-muted"}> Please click to Subscribe</span>
                    </div>
                    <div className="card" style={{width: "100%"}}>
                        <ul className="list-group list-group-flush">
                            {products.map((value, index) => {
                                return <li className={"list-group-item" + (value.subs ? " disabled" : "")}
                                           style={{cursor: "pointer"}}
                                           onClick={() => handleSubscription(value)}
                                           key={index}>{value.metadata.nickname + " - " + (value.unit_amount / 100) + " INR"}</li>
                            })}
                        </ul>
                    </div>
                    <div className={'mr-2 mt-2'}>
                        <button hidden id={"modelOpen"} type="button" className={"btn btn-primary btn-sm"}
                                data-toggle="modal"
                                data-target="#exampleModal" data-backdrop="static">Subscribe
                        </button>

                        <div className="modal fade" id="exampleModal" role="dialog"
                             aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Payment
                                            for {selectedProduct && selectedProduct.metadata && selectedProduct.metadata.nickname}</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form className="credit-card">
                                            <div className="form-header">
                                                <h4 className="title">Credit card detail</h4>
                                            </div>

                                            <div className="form-body">
                                                <input onChange={handleChange} id="card_number" type="text"
                                                       pattern="[0-9]{16}" className="card-number"
                                                       placeholder="Card Number" required maxLength="16"
                                                       minLength="16"/>
                                                <div className="date-field">
                                                    <div className="month">
                                                        <select name="Month" onChange={handleChange} id="exp_month">
                                                            <option value="Month" defaultValue>MMM</option>
                                                            <option value="01">January</option>
                                                            <option value="02">February</option>
                                                            <option value="03">March</option>
                                                            <option value="04">April</option>
                                                            <option value="05">May</option>
                                                            <option value="06">June</option>
                                                            <option value="07">July</option>
                                                            <option value="08">August</option>
                                                            <option value="09">September</option>
                                                            <option value="10">October</option>
                                                            <option value="11">November</option>
                                                            <option value="12">December</option>
                                                        </select>
                                                    </div>
                                                    <div className="year">
                                                        <select name="Year" onChange={handleChange} id="exp_year">
                                                            <option value="Year" defaultValue>YYYY</option>
                                                            <option value="2020">2020</option>
                                                            <option value="2021">2021</option>
                                                            <option value="2022">2022</option>
                                                            <option value="2023">2023</option>
                                                            <option value="2024">2024</option>
                                                            <option value="2016">2025</option>
                                                            <option value="2017">2026</option>
                                                            <option value="2018">2027</option>
                                                            <option value="2019">2028</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="card-verification">
                                                    <div className="cvv-input">
                                                        <input onChange={handleChange} id="cvv_number" type="text"
                                                               placeholder="CVV" maxLength="4"
                                                               pattern="[0-9]{3}" required/>
                                                    </div>
                                                    <div className="cvv-details">
                                                        <p>3 or 4 digits usually <br/> found on the signature strip</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-primary" onClick={handlePayments}>Pay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Loader isLoad={loader}/>
        </div>
    )
}

const SubscriptionList = ({nickname, product, price, status, onUnsubscribe}) => {
    return (
        <div className="card" style={{width: "450px", marginTop: "5px"}}>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">
                    <div className={"row"}>
                        <div className={"col-sm-3"}>Name</div>
                        <div className={"col-sm-9"}>{nickname}</div>
                    </div>
                </li>
                <li className="list-group-item">
                    <div className={"row"}>
                        <div className={"col-sm-3"}>Product ID</div>
                        <div className={"col-sm-9"}>{product}</div>
                    </div>
                </li>
                <li className="list-group-item">
                    <div className={"row"}>
                        <div className={"col-sm-3"}>Price ID</div>
                        <div className={"col-sm-9"}>{price}</div>
                    </div>
                </li>
                <li className="list-group-item">
                    <div className={"row"}>
                        <div className={"col-sm-3"}>Status</div>
                        <div className={"col-sm-9"}>{status}</div>
                    </div>
                </li>
            </ul>
            {status === "active" &&
            <button style={{width: "150px", margin: "5px auto"}} className={"btn btn-primary btn-sm"}
                    onClick={() => onUnsubscribe()}>Cancel</button>}
        </div>
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

export default Home;
