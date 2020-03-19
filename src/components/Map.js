import React, { useState, useRef } from 'react';
import ReactMapGL, { 
    GeolocateControl, NavigationControl, Marker
} from 'react-map-gl';
import { graphql, Subscription } from 'react-apollo';
import FontAwesome from 'react-fontawesome';
import DeckGL, { GeoJsonLayer } from "deck.gl";
import Geocoder from "react-map-gl-geocoder";

import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css"
import "mapbox-gl/dist/mapbox-gl.css"

import { GET_PINS_QUERY } from '../graphql/queries';
import { ADD_PIN_MUTATION } from '../graphql/mutations';
import { PIN_ADDED_SUBSCRIPTION } from '../graphql/subscriptions';

const token = "pk.eyJ1IjoiemFja3R1dG8iLCJhIjoiY2s3bjl1NG81MGFjYzNrbTduYXdpdXpkdyJ9.5ZsWgaEemn4iI2LZ2pZAYw";

const initialViewport = {
    longitude: -122.4376,
    latitude: 37.7555,
    zoom: 13
  }

  const geolocateStyle = {
    float: 'left',
    margin: '50px',
    padding: '10px'
  };

const Map = (props) => {
    console.log('props',props);
    const [viewport, setViewport] = useState(initialViewport);
    const [layer, setLayer] = useState(null);
    const mapRef = React.useRef();
    const handleGeocoderViewportChange = viewport => {
        const geocoderDefaultOverrides = { transitionDuration: 1000 };
    
        // return this.handleViewportChange({
        //   ...viewport,
        //   ...geocoderDefaultOverrides
        // });
        return handleMapChange({
            ...viewport,
            ...geocoderDefaultOverrides
        });
      };
    const handleOnResult = event => {
          const searchResultLayer = new GeoJsonLayer({
            id: "search-result",
            data: event.result.geometry,
            getFillColor: [255, 0, 0, 128],
            getRadius: 1000,
            pointRadiusMinPixels: 10,
            pointRadiusMaxPixels: 10
        });
        setLayer(searchResultLayer);
      }
    const handleMapClick = async event => {
        try {
            const [longitude, latitude] = event.lngLat;
            console.log(longitude, latitude);
            const res = await props.mutate({
                variables: { latitude, longitude }
            });
            props.data.refetch()
            console.log('res', res);
        } catch(e) {
            console.error('error', e);
        }

    }
    const handleMapChange = newViewport => {
        setViewport(prevState => (
            {
                ...prevState,
                ...newViewport,
                latitude: newViewport.latitude,
                longitude: newViewport.longitude
            }
        ));
    }
    return (
        <div style={{ widht: '100vw', height: '100vh'}}>
            <ReactMapGL 
                ref={mapRef}
                width='100%'
                height='100%'
                mapboxApiAccessToken={token}
                mapStyle='mapbox://styles/mapbox/streets-v9'
                onViewportChange={handleMapChange}
                onClick={handleMapClick}
                {...viewport}
            >
                <GeolocateControl
                    style={geolocateStyle}
                    positionOptions={{enableHighAccuracy: true}}
                    trackUserLocation={true}
                />
                {/* <Geocoder 
                    mapRef={mapRef}
                    onResult={handleOnResult}
                    onViewportChange={handleGeocoderViewportChange}
                    mapboxApiAccessToken={token}
                    position='top-left'
                /> */}
                <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        margin: "1em"
                    }}>
                    <NavigationControl 
                        onViewportChange={viewport=> setViewport(viewport)}
                    />
                </div>
                {/* Marked Pins */}
                {!props.data.loading && props.data.getPins.map(pin => (
                    <Marker 
                        key={pin.id}
                        latitude={pin.latitude}
                        longitude={pin.longitude}
                        offsetLeft={-19}
                        offsetRight={-37}
                    >
                        <FontAwesome 
                            name="map-marker-alt"
                            size='2x'
                            style={{
                                color: 'red'
                            }}
                        />
                    </Marker>
                ))}
            </ReactMapGL>
            {/* <DeckGL {...viewport} layers={[layer]} /> */}
            {/* Subscription */}
            <Subscription 
                subscription={PIN_ADDED_SUBSCRIPTION}
                onSubscriptionData={({subscriptionData}) => console.log('sub', { subscriptionData})}
            />
        </div>
    )
}

export default graphql(ADD_PIN_MUTATION)(
    graphql(GET_PINS_QUERY)(Map)
);