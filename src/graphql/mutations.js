import gql from 'graphql-tag';

export const ADD_PIN_MUTATION = gql`
    mutation AddPin($latitude: Float!, $longitude: Float!) {
        addPin(latitude: $latitude, longitude: $longitude) {
            id
            latitude
            longitude
        }
        }
`;