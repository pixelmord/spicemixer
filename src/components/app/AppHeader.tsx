import * as React from 'react';
import { Menu, Container, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import logo from './logo.png';

const AppHeader = () => (
  <Menu fixed="top" inverted={true}>
    <Container>
      <Menu.Item as={Link} to="/" header={true}>
        <Image size="mini" src={logo} style={{ marginRight: '1.5em' }} />
        Spicemixer
      </Menu.Item>
      <Menu.Item as={Link} to="/spices">
        Spices
      </Menu.Item>
    </Container>
  </Menu>
);

export default AppHeader;
