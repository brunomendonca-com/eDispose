import React, { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import api from "../../services/api";

import "./styles.css";

import logo from "../../assets/logo.svg";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Location {
  slug: string;
  cities: string[];
}


const CreatePoint: React.FC = () => {
  const latPosition = 50.9590441;
  const longPosition = -114.0983095;

  const [items, setItems] = useState<Item[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("0");

  useEffect(() => {
    api.get("items").then((response: any) => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    api.get("locations").then((response: any) => {
      const regionsInitials = response.data.map((region: { slug: string }) => region.slug);
      setRegions(regionsInitials);
    });
  }, []);


  useEffect(() => {
    if (selectedRegion !== "0") {
      api.get(`locations/${selectedRegion}`).then((response: any) => {
        setLocations(response.data.cities);
      });
    }
  }, [selectedRegion]);

  function handleSelectRegion(event: ChangeEvent<HTMLSelectElement>) {
    const region = event.target.value;
    setSelectedRegion(region);
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

      <form>
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
            <input type="text" name="name" id="name" />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input type="text" name="phone" id="phone" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Address</h2>
            <span>Select an address in the map</span>
          </legend>

          <Map center={[latPosition, longPosition]} zoom={13}>
            <TileLayer
              attribution='&amp;copy Map tiles by Carto, under CC BY 3.0. Data by <a href="http://osm.org/copyright">OpenStreetMap</a>, under ODbL.'
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            />

            <Marker position={[latPosition, longPosition]} />
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
              <label htmlFor="city">City</label>
              <select
                name="city"
                id="city"
              >
                <option value="0">Select a City</option>
                {locations.map((location) => (
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
              <li key={item.id}>
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
