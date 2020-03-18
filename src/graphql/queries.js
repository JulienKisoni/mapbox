import gql from 'graphql-tag';

export const GET_PINS_QUERY = gql`
    query {
        getPins {
            id
            latitude
            longitude
        }
    }
`;