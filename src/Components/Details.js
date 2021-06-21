import React from "react";
import "../Styles/details.css";
import queryString from "query-string";
import axios from "axios";
import Modal from "react-modal";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import "../Styles/header.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    height: "auto",
    width: "500px",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "rgb(255 255 255 / 30%)",
  },
};

const customStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "rgb(255 255 255 / 29%)",
  },
};

class Details extends React.Component {
  constructor() {
    super();
    this.state = {
      resturantData: {},
      resturantId: undefined,
      galleryModalIsOpen: false,
      menuItemsModalIsOpen: false,
      formModalIsOpen: false,
      menuItems: [],
      subTotal: 0,
      order: [],
      name: undefined,
      email: undefined,
      mobileNumber: undefined,
      address: undefined,
    };
  }
  componentDidMount() {
    const qs = queryString.parse(this.props.location.search);
    const resturantId = qs.resturant;

    axios({
      method: "GET",
      url: `http://localhost:3030/api/resturantbyid/${resturantId}`,
      headers: { "Content-Type": "application/json" },
    })
      .then((response) =>
        this.setState({ resturantData: response.data.resturant, resturantId })
      )
      .catch();
  }

  handleGallery = () => {
    this.setState({ galleryModalIsOpen: true });
  };

  handleClose = () => {
    this.setState({ galleryModalIsOpen: false });
  };

  handleModal = (state, value) => {
    const { resturantId, menuItems } = this.state;
    this.setState({ [state]: value });
    if (state == "menuItemsModalIsOpen" && value == true) {
      axios({
        method: "GET",
        url: `http://localhost:3030/api/getMenu/${resturantId}`,
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          console.log(response);
          this.setState({ menuItems: response.data.item });
          console.log(menuItems);
        })
        .catch((err) => console.log(err));
    }
    if (state == "formModalIsOpen" && value == true) {
      const order = menuItems.filter((item) => item.qty != 0);
      this.setState({ order: order });
    }
  };

  handleChange = (event, state) => {
    this.setState({ [state]: event.target.value });
  };

  addItems = (index, operationType) => {
    let total = 0;
    const items = [...this.state.menuItems];
    const item = items[index];

    if (operationType == "add") {
      item.qty = item.qty + 1;
    } else {
      item.qty = item.qty - 1;
    }
    items[index] = item;
    items.map((item) => {
      total += item.qty * item.price;
    });
    this.setState({ menuItems: items, subTotal: total });
  };

  isDate(val) {
    return Object.prototype.toString.call(val) === "[object Date]";
  }

  isObj = (val) => {
    return typeof val === "object";
  };

  stringifyValue = (val) => {
    if (this.isObj(val) && !this.isDate(val)) {
      return JSON.stringify(val);
    } else {
      return val;
    }
  };

  buildForm = ({ action, params }) => {
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", action);

    Object.keys(params).forEach((key) => {
      var input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", key);
      input.setAttribute("value", this.stringifyValue(params[key]));
      form.appendChild(input);
    });

    return form;
  };
  post = (details) => {
    const form = this.buildForm(details);
    document.body.appendChild(form);
    form.submit();
    form.remove();
  };
  getData = (data) => {
    return fetch(`http://localhost:3030/api/payment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  };
  payment = () => {
    const { subTotal, email } = this.state;
    var re = /\S+@\S+\.\S+/;
    if (re.test(email)) {
      //  Payment API Call
      this.getData({ amount: subTotal, email: email }).then((response) => {
        var information = {
          action: "https://securegw-stage.paytm.in/order/process",
          params: response,
        };
        this.post(information);
      });
    } else {
      alert("Email is not valid, Please check it");
    }
  };

  handleNavDetails = () => {
    this.props.history.push("/Details");
  };
  render() {
    const {
      resturantData,
      galleryModalIsOpen,
      menuItemsModalIsOpen,
      formModalIsOpen,
      subTotal,
      menuItems,
    } = this.state;
    return (
      <div>
        <div>
          <img src={resturantData.image} alt="" class="detailMainPic" />
          <input
            type="submit"
            value="Click to see Image Gallery"
            class="btnClick"
            onClick={this.handleGallery}
          />
        </div>
        <h1 class="DetailHeader">{resturantData.name}</h1>
        <button
          class="btn-order"
          onClick={() => this.handleModal("menuItemsModalIsOpen", true)}
        >
          Place Online Order
        </button>
        <div class="tabs">
          <div class="tab">
            <input type="radio" id="tab-1" name="tab-group-1" checked />
            <label for="tab-1">Overview</label>

            <div class="content">
              <div class="about">About this place</div>
              <div class="Detailhead">Cuisine</div>
              <div class="Detailvalue">
                {resturantData && resturantData.cuisine
                  ? resturantData.cuisine.map((item) => `${item.name}, `)
                  : null}
              </div>
              <div class="Detailhead">Average Cost</div>
              <div class="Detailvalue">
                &#8377; {resturantData.min_price} for two people(approx)
              </div>
            </div>
          </div>

          <div class="tab">
            <input type="radio" id="tab-2" name="tab-group-1" />
            <label for="tab-2">Contact</label>

            <div class="content">
              <div class="Detailhead">Phone Number</div>
              <div class="Detailvalue-1">{resturantData.contact}</div>
              <div class="Detailhead">{resturantData.name}</div>
              <div class="Detailvalue">{`${resturantData.locality}, ${resturantData.city}`}</div>
            </div>
          </div>
        </div>
        <Modal isOpen={galleryModalIsOpen} style={customStyle}>
          <div
            style={{
              height: "550px",
              width: "650px",
              float: "right",
              margin: "5px",
            }}
          >
            <div>
              <span
                class="glyphicon glyphicon-remove"
                onClick={this.handleClose}
                style={{ float: "right", margin: "5px" }}
              ></span>
            </div>
            <div>
              <Carousel showThumbs={false}>
                {resturantData && resturantData.thumb
                  ? resturantData.thumb.map((item) => {
                      return (
                        <div>
                          <img src={item} height="500px" width="600px" />
                        </div>
                      );
                    })
                  : null}
              </Carousel>
            </div>
          </div>
        </Modal>
        <Modal isOpen={menuItemsModalIsOpen} style={customStyles}>
          <div>
            <div
              className="glyphicon glyphicon-remove"
              style={{ float: "right", margin: "5px" }}
              onClick={() => this.handleModal("menuItemsModalIsOpen", false)}
            ></div>
            <div>
              <h3 className="restaurant-name">{resturantData.name}</h3>
              <h3 className="item-total">SubTotal : {subTotal}</h3>
              <button
                style={{ position: "absolute", left: "75%", top: "12%" }}
                className="btn btn-danger pay"
                onClick={() => {
                  this.handleModal("formModalIsOpen", true);
                  this.handleModal("menuItemsModalIsOpen", false);
                }}
              >
                Pay Now
              </button>

              {menuItems && menuItems.length > 0
                ? menuItems.map((item, index) => {
                    return (
                      <div
                        style={{
                          width: "44rem",
                          marginTop: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          className="card"
                          style={{
                            width: "43rem",
                            margin: "auto",
                          }}
                        >
                          <div
                            className="row"
                            style={{
                              paddingLeft: "10px",
                              marginop: "-10px",
                              // paddingBottom: "10px",
                              borderBottom: "1px solid #292c40",
                            }}
                          >
                            <div
                              className="col-xs-9 col-sm-9 col-md-9 col-lg-9 "
                              style={{
                                paddingLeft: "10px",
                                // paddingBottom: "10px",
                              }}
                            >
                              <span className="card-body">
                                <h5 className="item-name">{item.name}</h5>
                                <h5 className="item-price">
                                  &#8377;{item.price}
                                </h5>
                                <p className="item-descp">{item.description}</p>
                              </span>
                            </div>
                            <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                              <img
                                className="card-img-center title-img"
                                src={`../${item.image}`}
                                style={{
                                  margin: "15px 10px 10px 2px",
                                  height: "92px",
                                  width: "92px",
                                  "border-radius": "20px",
                                  "box-shadow": "1px 0px 7px #666666",
                                }}
                              />
                              {item.qty == 0 ? (
                                <div>
                                  <button
                                    style={{
                                      position: "relative",
                                      top: "-20px",
                                      left: "35px",
                                      backgroundColor: "white",
                                      borderRadius: "5px",
                                    }}
                                    className="add-button"
                                    onClick={() => this.addItems(index, "add")}
                                  >
                                    Add
                                  </button>
                                </div>
                              ) : (
                                <div className="add-number">
                                  <button
                                    style={{
                                      position: "relative",
                                      top: "-3px",
                                      left: "-4px",
                                      width: "20px",
                                      backgroundColor: "white",
                                      borderRadius: "5px",
                                    }}
                                    className="minus"
                                    onClick={() =>
                                      this.addItems(index, "subtract")
                                    }
                                  >
                                    -
                                  </button>
                                  <span
                                    style={{
                                      color: "#b71540",
                                      width: "25px",
                                      fontWeight: "bolder",
                                    }}
                                  >
                                    {item.qty}
                                  </span>
                                  <button
                                    style={{
                                      position: "relative",
                                      top: "-3px",
                                      left: "5px",
                                      width: "20px",
                                      backgroundColor: "white",
                                      borderRadius: "5px",
                                    }}
                                    className="plus"
                                    onClick={() => this.addItems(index, "add")}
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : null}
              <div
                className="card"
                style={{
                  width: "44rem",
                  marginTop: "10px",
                  marginBottom: "10px",
                  margin: "auto",
                }}
              ></div>
            </div>
          </div>
        </Modal>
        <Modal isOpen={formModalIsOpen} style={customStyle}>
          <div>
            <div
              className="glyphicon glyphicon-remove"
              style={{ float: "right", margin: "5px" }}
              onClick={() => this.handleModal("formModalIsOpen", false)}
            ></div>
            <div className="resName">{resturantData.name}</div>
            <div className="resNames">
              <span>Amount : </span>
              <span>{subTotal}</span>
            </div>
            <div className="subhead">Name</div>
            <input
              className="form-control form-control-lg"
              style={{ width: "350px", marginLeft: "15px" }}
              type="text"
              placeholder="Enter your name"
              onChange={(event) => this.handleChange(event, "name")}
            />
            <div className="subhead">Email</div>
            <input
              className="form-control form-control-lg"
              style={{ width: "350px", marginLeft: "15px" }}
              type="text"
              placeholder="Enter your email"
              onChange={(event) => this.handleChange(event, "email")}
            />
            <div className="subhead">Mobile Number</div>
            <input
              className="form-control form-control-lg"
              style={{ width: "350px", marginLeft: "15px" }}
              type="text"
              placeholder="Enter mobile number"
              onChange={(event) => this.handleChange(event, "mobileNumber")}
            />
            <div className="subhead">Address</div>
            <textarea
              className="form-control form-control-lg"
              style={{ width: "350px", marginLeft: "15px" }}
              type="text"
              placeholder="Enter your address"
              onChange={(event) => this.handleChange(event, "address")}
            />
            <button
              id="Proceed"
              className="btn btn-danger"
              style={{ float: "right", margin: "15px" }}
              onClick={this.payment}
            >
              PROCEED
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Details;
