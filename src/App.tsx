import * as React from 'react';
import { Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import AppHeader from './components/app/AppHeader';
import HomePage from './components/home/HomePage';
import SpicesPage from './components/spices/SpicesPage';

const App = () => (
  <div className="App">
    <AppHeader />
    <Container text={true} style={{ marginTop: '7em' }}>
      <Route path="/" exact={true} component={HomePage} />
      <Route path="/spices" component={SpicesPage} />
    </Container>
  </div>
);

export default App;
