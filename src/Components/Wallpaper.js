// import React from "react";
// import "../Styles/header.css";
// import "../Styles/wallpaper.css";
// import axios from "axios";

// class Wallpaper extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       restaurants: [],
//       suggestions: [],
//       searchText: undefined,
//     };
//   }

//   handlelocationChange = (event) => {
//     const locationId = event.target.value;
//     sessionStorage.setItem("locationId", locationId);

//     axios({
//       method: "GET",
//       url: `http://localhost:3030/api/resturantbylocation/${locationId}`,
//       headers: { "Content-Type": "application/json" },
//     })
//       .then((response) =>
//         this.setState({ restaurants: response.data.resturant })
//       )
//       .catch();
//   };

//   handleSearch = (event) => {
//     const { restaurants } = this.state;
//     const searchText = event.target.value;

//     let filteredRestaurants;

//     if (searchText == "") {
//       filteredRestaurants = [];
//     } else {
//       filteredRestaurants = restaurants.filter((item) =>
//         item.name.toLowerCase().includes(searchText.toLowerCase())
//       );
//     }
//     this.setState({ suggestions: filteredRestaurants, searchText: searchText });
//   };

//   handleItemClick = (item) => {
//     this.props.history.push(`/details?restaurant=${item._id}`);
//   };

//   renderSuggestions = () => {
//     let { suggestions, searchText } = this.state;

//     if (suggestions.length === 0 && searchText) {
//       return (
//         <ul>
//           <li>No Match Found</li>
//         </ul>
//       );
//     }
//     return (
//       <ul style={{ color: "white", fontWeight: "bold" }}>
//         {suggestions.map((item, index) => (
//           <li
//             key={index}
//             onClick={() => this.handleItemClick(item)}
//           >{`${item.name}, ${item.city}`}</li>
//         ))}
//       </ul>
//     );
//   };
//   locationChange = (event) => {
//     const locationId = event.target.value;
//     sessionStorage.setItem("locationId", locationId);
//   };
//   render() {
//     const { locationValues } = this.props;
//     return (
//       <div>
//         <img src="./assets/home first.jpg" alt="" className="MainPic" />
//         <div>
//           <b className="logo">e!</b>
//         </div>
//         <div className="heading">
//           Find the best restaurants, cafés, and bars
//         </div>
//         <div className="dd_search">
//           <select className="dd" onChange={this.handlelocationChange}>
//             <option value="0">Please select a location</option>
//             {locationValues.map((item) => {
//               return (
//                 <option
//                   value={item.location_id}
//                 >{`${item.name}, ${item.city}`}</option>
//               );
//             })}
//           </select>
//           <div
//             style={{ display: "inline-block", marginLeft: "40px" }}
//             id="block"
//           >
//             <span className="glyphicon glyphicon-search search"></span>
//             <input
//               className="search-box"
//               type="text"
//               onChange={this.handleSearch}
//               placeholder="Search for restaurants"
//             />
//             {this.renderSuggestions()}
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default Wallpaper;

import React from "react";
import "../Styles/header.css";
import "../Styles/wallpaper.css";
import axios from "axios";
import { withRouter } from "react-router-dom";

class Wallpaper extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurants: [],
      suggestions: [],
      searchText: undefined,
    };
  }

  handlelocationChange = (event) => {
    const locationId = event.target.value;
    sessionStorage.setItem("locationId", locationId);

    axios({
      method: "GET",
      url: `http://shrouded-spire-35349.herokuapp.com/api/resturantbylocation/${locationId}`,
      headers: { "Content-Type": "application/json" },
    })
      .then((response) =>
        this.setState({ restaurants: response.data.resturant })
      )
      .catch();
  };

  handleSearch = (event) => {
    const { restaurants } = this.state;
    const searchText = event.target.value;

    let filteredRestaurants;

    if (searchText == "") {
      filteredRestaurants = [];
    } else {
      filteredRestaurants = restaurants.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    this.setState({ suggestions: filteredRestaurants, searchText: searchText });
  };

  handleItemClick = (item) => {
    this.props.history.push(`/details?resturant=${item._id}`);
  };

  renderSuggestions = () => {
    let { suggestions, searchText } = this.state;

    if (suggestions.length === 0 && searchText) {
      return (
        <ul>
          <li>No Match Found</li>
        </ul>
      );
    }
    return (
      <ul style={{ color: "white", fontWeight: "bold" }}>
        {suggestions.map((item, index) => (
          <li key={index} onClick={() => this.handleItemClick(item)}>
            <img src={`${item.image}`} height="45px" width="45px" />
            {`${item.name}, ${item.city}`}
          </li>
        ))}
      </ul>
    );
  };
  locationChange = (event) => {
    const locationId = event.target.value;
    sessionStorage.setItem("locationId", locationId);
  };
  render() {
    const { locationValues } = this.props;
    return (
      <div>
        <img src="./assets/home first.jpg" alt="" class="MainPic" />
        <div>
          <b class="logo">e!</b>
        </div>
        <div class="heading">Find the best restaurants, cafés, and bars</div>
        {/* <div class="dd_search">
                            <select class="dd" onChange={this.handlelocationChange}>
                                <option value="0" >Please select a location</option>
                                { locationValues.map((item) => {
                                        return <option value={item.location_id} >{ `${item.name}, ${item.city}`  }</option>
                                }) } 
                            </select>
                            <div style={{display: 'inline-block' ,marginLeft: '40px'}} id="block">
                                <span class="glyphicon glyphicon-search search"></span>
                                <input class="search-box" type="text" onChange={this.handleSearch} placeholder="Search for restaurants" />
                                {this.renderSuggestions()}
                            </div>
                    </div> */}
        <div className="locationSelector">
          <select
            className="locationDropdown"
            onChange={this.handlelocationChange}
          >
            <option value="0">Select</option>
            {locationValues.map((item) => {
              return (
                <option
                  value={item.location_id}
                >{`${item.name}, ${item.city}`}</option>
              );
            })}
          </select>
          <div id="notebooks">
            <input
              id="query"
              type="text"
              onChange={this.handleSearch}
              placeholder="Enter Restaurant Name"
            />
            {this.renderSuggestions()}
          </div>
          <span className="glyphicon glyphicon-search search"></span>
        </div>
      </div>
    );
  }
}

export default withRouter(Wallpaper);
