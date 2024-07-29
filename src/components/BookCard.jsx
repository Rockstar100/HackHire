import React, { useState } from "react";
import { BsArrowDown } from "react-icons/bs";
import { MdOutlineCompareArrows } from "react-icons/md";

const citiesData = [
  { id: 1, city: "Lagos", airports: "Lagos Airport" },
  { id: 2, city: "Vegas", airports: "McCarran International Airport" },
  { id: 3, city: "New York", airports: "JFK Airport" },
  { id: 4, city: "Los Angeles", airports: "LAX Airport" },
  // Add more cities and airports as needed
];

const BookCard = () => {
  const [userData, setUserData] = useState({
    tripType: '',
    searchTerm: '',
    showDropdown: false,
    dropdownType: '',
    selectedFrom: null,
    selectedTo: null,
    numberOfTravelers: 1,
    departureDate: '',
    returnDate: '',
  });

  const handleTripChange = (event) => {
    setUserData(prevData => ({ ...prevData, tripType: event.target.value }));
  };

  const handleLocationClick = (location) => {
    if (userData.dropdownType === 'from') {
      setUserData(prevData => ({ ...prevData, selectedFrom: location }));
    } else if (userData.dropdownType === 'to') {
      setUserData(prevData => ({ ...prevData, selectedTo: location }));
    }
    setUserData(prevData => ({ ...prevData, showDropdown: false }));
  };

  const handleSearchChange = (event) => {
    setUserData(prevData => ({ ...prevData, searchTerm: event.target.value }));
  };

  const handleNumberOfTravelersChange = (event) => {
    setUserData(prevData => ({
      ...prevData,
      numberOfTravelers: Math.max(1, parseInt(event.target.value, 10))
    }));
  };

  const handleDateChange = (event, dateType) => {
    setUserData(prevData => ({ ...prevData, [dateType]: event.target.value }));
  };

  const filteredCities = citiesData.filter(city =>
    city.city.toLowerCase().includes(userData.searchTerm.toLowerCase())
  );

  const showFromDropdown = userData.dropdownType === 'from' && userData.showDropdown;
  const showToDropdown = userData.dropdownType === 'to' && userData.showDropdown;

  return (
    <div className="p-6 relative">
      <div className="flex flex-row items-center justify-start gap-x-10 px-6 py-4 border-b">
        <div className="flex items-center p-4">
          <input
            type="radio"
            className="form-radio ms-2"
            name="trip"
            id="roundtrip"
            value="roundtrip"
            onChange={handleTripChange}
          />
          <label htmlFor="roundtrip" className="inline-block px-2 mb-1 text-sm font-medium">Round Trip</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            className="form-radio ms-2"
            name="trip"
            id="oneway"
            value="oneway"
            onChange={handleTripChange}
          />
          <label htmlFor="oneway" className="px-2 mb-1 text-sm font-medium">One Way</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            className="form-radio ms-2"
            name="trip"
            id="multicity"
            value="multicity"
            onChange={handleTripChange}
          />
          <label htmlFor="multicity" className="px-2 mb-1 text-sm font-medium">Multi City</label>
        </div>
      </div>

      <div className="grid px-5 rounded-b-lg py-6 transform grid-cols-10 shadow-xl relative">
        <div
          className="col-span-3 hover:bg-blue-100 duration-100 p-3 cursor-pointer border"
          onClick={() => { setUserData(prevData => ({ ...prevData, dropdownType: 'from', showDropdown: true })); }}
        >
          <div className="ps-7">
            <h3 className="text-sm pb-2">From <BsArrowDown className="inline" size={12} color="blue"/></h3>
            <p className="text-2xl font-semibold">
              {userData.selectedFrom ? userData.selectedFrom.city : "Select City"}
            </p>
            <p className="text-sm font-medium">
              {userData.selectedFrom ? userData.selectedFrom.airports : "Destination_Code, Airport Name"}
            </p>
          </div>
        </div>

        {(userData.tripType === "roundtrip" || userData.tripType === "multicity") && (
          <div className="absolute text-gray-500 z-10 left-[calc(28.5%)] p-2 rounded-full bg-white shadow-lg top-1/3">
            <MdOutlineCompareArrows color="blue" size={25} />
          </div>
        )}

        <div
          className="col-span-3 hover:bg-blue-100 duration-100 p-3 cursor-pointer border"
          onClick={() => { setUserData(prevData => ({ ...prevData, dropdownType: 'to', showDropdown: true })); }}
        >
          <div className="ps-7">
            <h3 className="text-sm pb-2">To <BsArrowDown className="inline" size={12} color="blue"/></h3>
            <p className="text-2xl font-semibold">
              {userData.selectedTo ? userData.selectedTo.city : "Select City"}
            </p>
            <p className="text-sm font-medium">
              {userData.selectedTo ? userData.selectedTo.airports : "Destination_Code, Airport Name"}
            </p>
          </div>
        </div>

        <div className="col-span-1 border hover:bg-blue-100 duration-100 p-3">
          <div>
            <h3 className="text-sm pb-2">Departure <BsArrowDown className="inline" size={12} color="blue"/></h3>
            <input
              type="date"
              className="p-2 w-full placeholder-transparent"
              value={userData.departureDate}
              onChange={(e) => handleDateChange(e, 'departureDate')}
              placeholder="Select Date"
            />
          </div>
        </div>

        {(userData.tripType === "roundtrip" || userData.tripType === "multicity") ? (
          <div className="col-span-1 border hover:bg-blue-100 duration-100 p-3">
            <div>
              <h3 className="text-sm pb-2">Return <BsArrowDown className="inline" size={12} color="blue"/></h3>
              <input
                type="date"
                className="p-2 w-full placeholder-transparent"
                value={userData.returnDate}
                onChange={(e) => handleDateChange(e, 'returnDate')}
                placeholder="Select Date"
              />
            </div>
          </div>
        ) : (
          <div className="col-span-1 border p-3 hover:bg-blue-100 duration-100">
            <h3 className="text-sm pb-2">Return <BsArrowDown className="inline" size={12} color="blue"/></h3>
            <p className="text-sm text-gray-500">Please select your travel type</p>
          </div>
        )}

        <div className="col-span-2 border p-3 hover:bg-blue-100 duration-100">
          <div>
            <h3 className="text-sm pb-2">Travelers</h3>
            <input
              type="number"
              value={userData.numberOfTravelers}
              onChange={handleNumberOfTravelersChange}
              className="p-2 w-full border rounded-lg"
              min="1"
              placeholder="1"
            />
          </div>
        </div>
      </div>
        <div className="flex mt-10 justify-end items-center">
            <div className="mx-3 bg-blue-500 text-white p-2 h-max rounded-md">
                <input type="checkbox" id="flexCheckDefault" className="form-checkbox"/>
                <label htmlFor="flexCheckDefault" className="text-sm ms-3">Economy Class</label>
            </div>
            <div className="mx-3 bg-blue-500 text-white p-2 h-max rounded-md">
                <input type="checkbox" id="flexCheckDefault" className="form-checkbox"/>
                <label htmlFor="flexCheckDefault" className="text-sm ms-3">First Class</label>
            </div>
            <div className="mx-3 bg-blue-500 text-white p-2 h-max rounded-md">
                <input type="checkbox" id="flexCheckDefault" className="form-checkbox"/>
                <label htmlFor="flexCheckDefault" className="text-sm ms-3">Business Class</label>
            </div>
            <button className="bg-blue-500 text-white p-3 rounded-lg">Search Flights</button>
        </div>
      {(showFromDropdown || showToDropdown) && (
        <div className="absolute top-16 left-0 right-0 z-20 bg-white shadow-lg">
          <input
            type="text"
            className="w-full p-2 border-b"
            placeholder="Search City"
            value={userData.searchTerm}
            onChange={handleSearchChange}
          />
          <ul className="max-h-60 overflow-y-auto">
            {filteredCities.length > 0 ? (
              filteredCities
                .filter(city => 
                  city.city !== (userData.selectedFrom ? userData.selectedFrom.city : '') &&
                  city.city !== (userData.selectedTo ? userData.selectedTo.city : '')
                )
                .map(city => (
                  <li
                    key={city.id}
                    className="p-2 cursor-pointer border hover:bg-gray-200"
                    onClick={() => handleLocationClick(city)}
                  >
                    {city.city} - {city.airports}
                  </li>
                ))
            ) : (
              <li className="p-2">No cities found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookCard;
