import React from "react";
import { FiLogIn } from "react-icons/fi";
import { Link } from 'react-router-dom';

import "./styles.css";
import logo from "../../assets/logo.svg";

const Home: React.FC = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="eDispose" />
        </header>

        <main>
          <h1>Your Waste Disposal Marketplace.</h1>
          <p>
            We help people to find waste disposal and recycling services, in an
            efficient way.
          </p>
          <Link to="/create-point">
            <span>
              <FiLogIn />
            </span>
            <strong>Register a new service</strong>
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Home;
