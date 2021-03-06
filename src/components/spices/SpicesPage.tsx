import * as React from 'react';
import { Header } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const ALL_SPICES = gql`
  query {
    allSpices {
      name
    }
  }
`;

const SpicesPage = () => (
  <div>
    <Header>Spices</Header>
    <Query query={ALL_SPICES}>
      {(result: any) => {
        if (result.loading) {
          return <div>loading</div>;
        }
        if (result.error) {
          return <div>error</div>;
        }
        const { data } = result;

        return (
          <ul>
            {data.allSpices.map((spice: any, i: number) => (
              <li key={i}>{spice.name}</li>
            ))}
          </ul>
        );
      }}
    </Query>
  </div>
);

export default SpicesPage;
