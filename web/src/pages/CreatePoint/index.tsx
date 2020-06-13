import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import api from "../../services/api";

import "./styles.css";

import logo from "../../assets/logo.svg";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Location {
  initials: string;
  cities: string[];
}

const CreatePoint: React.FC = () => {

  const [items, setItems] = useState<Item[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("0");
  const [selectedLocation, setSelectedLocation] = useState("0");
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([0, 0]);
  const [markerVisibility, setMarkerVisibility] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  })

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setCurrentPosition([latitude, longitude]);
    })
  }, []);

  useEffect(() => {
    api.get("items").then((response: any) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    api.get("locations").then((response: any) => {
      const regionsInitials = response.data.map(
        (region: { initials: string }) => region.initials
      );
      setRegions(regionsInitials);
    });
  }, []);

  useEffect(() => {
    if (selectedRegion !== "0") {
      api.get(`locations/${selectedRegion}`).then((response: any) => {
        setLocations(response.data.locations);
      });
    }
  }, [selectedRegion]);

  function handleSelectRegion(event: ChangeEvent<HTMLSelectElement>) {
    const region = event.target.value;
    setSelectedRegion(region);
  }

  function handleSelectLocation(event: ChangeEvent<HTMLSelectElement>) {
    const location = event.target.value;
    setSelectedLocation(location);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng])
    setMarkerVisibility(true);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({...formData, [name]: value })
  }

  function handleSelectItem(id: number) {

    const alreadySelected = selectedItems.findIndex(item => item === id);

    if (alreadySelected >= 0) {

      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems);

    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, phone } = formData;
    const region = selectedRegion;
    const location = selectedLocation;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = {
      name,
      email,
      phone,
      region,
      location,
      latitude,
      longitude,
      items
    };

    await api.post('points', data);

    alert('New service successfully created!');
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="eDispose" />

        <Link to="/">
          <FiArrowLeft />
          Back to Home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Service
          <br />
          Registration
        </h1>
        <fieldset>
          <legend>
            <h2>Business Information</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Service Name</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                name="phone"
                id="phone"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Address</h2>
            <span>Select an address in the map</span>
          </legend>

          <Map center={currentPosition} zoom={13} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy Map tiles by Carto, under CC BY 3.0. Data by <a href="http://osm.org/copyright">OpenStreetMap</a>, under ODbL.'
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            />

            {markerVisibility ? <Marker position={selectedPosition} /> : null}
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="province">Province</label>
              <select
                name="province"
                id="province"
                value={selectedRegion}
                onChange={handleSelectRegion}
              >
                <option value="0">Select a Province</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="location">Location</label>
              <select
                name="location"
                id="location"
                value={selectedLocation}
                onChange={handleSelectLocation}
              >
                <option value="0">Select a Location</option>

                {selectedRegion === "0"
                  ? null
                  : locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Acceptable Items</h2>
            <span>Select one or more items</span>
          </legend>

          <ul className="items-grid">
            {items.map((item) => (
              <li key={item.id} onClick={() => handleSelectItem(item.id)} className={selectedItems.includes(item.id) ? 'selected' : ''} >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">Add service</button>
      </form>
    </div>
  );
};

export default CreatePoint;
