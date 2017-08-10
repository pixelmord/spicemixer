import React from 'react';
import styled from 'styled-components';

const Bar = styled.div`
  background: rgba(123,123,123,0.8);
  display: flex;
  padding: 0.5rem;
`;

const AppBar = ({ children }) => {
  return (
    <Bar>
      {children}
    </Bar>
  );
};

export default AppBar;
