import React from 'react';
import { GoogleMap, LoadScript, Polygon, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 37.771923,
  lng: -122.432120,
};

// Define the custom map styles
const mapStyles = [
    {
      "featureType": "all",
      "elementType": "labels",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        { "visibility": "simplified" },
        { "color": "#ffffff" }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels",
      "stylers": [
        { "visibility": "on" }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        { "color": "#aadd55" }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        { "color": "#c9c9c9" }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [
        { "color": "#f2f2f2" }
      ]
    }
  ];

const boundaries = [
  { lat: 37.7768056, lng: -122.4384756 },
  { lat: 37.7776162, lng: -122.4386415 },
  { lat: 37.7787220, lng: -122.4296528 },
  { lat: 37.7781337, lng: -122.4295247 },
  { lat: 37.7785381, lng: -122.4263272 },
  { lat: 37.7780691, lng: -122.4262306 },
  { lat: 37.7788349, lng: -122.4199164 },
  { lat: 37.7773589, lng: -122.4195707 },
  { lat: 37.7776599, lng: -122.4164084 },
  { lat: 37.7761513, lng: -122.4146418 },
  { lat: 37.7733501, lng: -122.4185172 },
  { lat: 37.7703874, lng: -122.4175322 },
  { lat: 37.7683676, lng: -122.4177696 },
  { lat: 37.7679370, lng: -122.4291267 },
  { lat: 37.7630604, lng: -122.4354246 },
  { lat: 37.7633026, lng: -122.4387616 },
  { lat: 37.7644575, lng: -122.4432660 },
  { lat: 37.7647019, lng: -122.4454838 },
  { lat: 37.7699462, lng: -122.4465976 },
  { lat: 37.7706808, lng: -122.4487421 },
  { lat: 37.7754400, lng: -122.4497975 },
  { lat: 37.7768119, lng: -122.4384571 },
];

const listings = [
  { id: 1, position: { lat: 37.775, lng: -122.437 }, price: "$3,500/mo" },
  // Add more listings here
];

const Map: React.FC = () => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14.75}
        center={center}
        options={{ styles: mapStyles }}
      >
        <Polygon
          paths={boundaries}
          options={{
            fillColor: 'lightgreen',
            fillOpacity: 0.05,
            strokeColor: 'green',
            strokeOpacity: 1,
            strokeWeight: 2,
          }}
        />
        {listings.map(listing => (
          <Marker
            key={listing.id}
            position={listing.position}
            label={listing.price}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
