import React from 'react';
import { useNavigate } from 'react-router-dom';
import sineImg from './sine.png';
import profileImg from './default.webp';
import './nav.scss';

const Nav = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/');
    };

    return (
        <div className="nav-bar">
            <div className="logo-container" onClick={handleRedirect}>
                <img src={sineImg} alt="My Image" className="main-logo" />
                <span className="logo-name">Sine Language</span>
            </div>
            <div className="central-nav">
            </div>
            <div className="logo-container">
            	{/*<span className="logo-name">Username</span>*/}
            	<button className="nav-button"><i className="fas fa-plus"></i></button>
              <img src={profileImg} alt="My Image" className="main-logo" />
            </div>
        </div>
    );
}

export default Nav;
