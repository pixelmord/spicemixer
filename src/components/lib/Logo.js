import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from '../svg/peperoncino.svg';

const Img = styled.img`
  width: 100px;
`;

const Logo = () => (
  <Link to="/">
    <Img src={logo} alt="Spicemixer" />
  </Link>
);


export default Logo;
