import React, { useState } from 'react';
import ReactMapGL, { 
    GeolocateControl, NavigationControl
} from 'react-map-gl';

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
    const [viewport, setViewport] = useState(initialViewport);
    const [pins, setPins] = useState([]);
    const handleMapClick = (event) => {
        const [longitude, latitude] = event.lngLat;
        console.log('event', event);
    }
    const handleMapChange = newViewport => {
        setViewport(prevState => (
            {
                ...prevState,
                latitude: newViewport.latitude,
                longitude: newViewport.longitude
            }
        ));
    }
    return (
        <div style={{ widht: '100vw', height: '100vh'}}>
            <ReactMapGL 
                width='100%'
                height='100%'
                mapboxApiAccessToken="pk.eyJ1IjoiemFja3R1dG8iLCJhIjoiY2s3bjl1NG81MGFjYzNrbTduYXdpdXpkdyJ9.5ZsWgaEemn4iI2LZ2pZAYw"
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
            </ReactMapGL>
        </div>
    )
}

export default Map;