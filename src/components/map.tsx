import React, { useRef, useEffect, useState } from "react";
import { GoogleMap, LoadScript, Polygon, Marker } from "@react-google-maps/api";
import styles from "./mapstyles.module.css";

const mapContainerStyle = {
  width: "100%",
  height: "95%",
};

interface Listing {
  id: number;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  address: string;
  imageUrls: string[];
  coordinates: { lat: number; lng: number };
  description: string;
}

interface MapProps {
  listings: Listing[];
  openModal: (listing: Listing) => void;
  hoveredListingId: number | null;
}

const center = {
  lat: 37.771923,
  lng: -122.43212,
};

const mapStyles = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ visibility: "simplified" }, { color: "#ffffff" }],
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#aadd55" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9c9c9" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#f2f2f2" }],
  },
  {
    featureType: "poi.business",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
];

const mapOptions = {
  styles: mapStyles,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

const boundaries = [
  { lat: 37.7768056, lng: -122.4384756 },
  { lat: 37.7776162, lng: -122.4386415 },
  { lat: 37.778722, lng: -122.4296528 },
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
  { lat: 37.767937, lng: -122.4291267 },
  { lat: 37.7630604, lng: -122.4354246 },
  { lat: 37.7633026, lng: -122.4387616 },
  { lat: 37.7644575, lng: -122.443266 },
  { lat: 37.7647019, lng: -122.4454838 },
  { lat: 37.7699462, lng: -122.4465976 },
  { lat: 37.7706808, lng: -122.4487421 },
  { lat: 37.77544, lng: -122.4497975 },
  { lat: 37.7768119, lng: -122.4384571 },
];

const formatPrice = (price: number): string => {
  return `${(price / 1000).toFixed(1)}K`;
};

const groupMarkersByCoordinates = (listings: Listing[]) => {
  const grouped: { [key: string]: Listing[] } = {};
  listings.forEach((listing) => {
    const key = `${listing.coordinates.lat},${listing.coordinates.lng}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(listing);
  });
  return grouped;
};

const applyOffsetToGroupedMarkers = (grouped: { [key: string]: Listing[] }) => {
  const offsetDistance = 0.0002; // Adjust as necessary
  Object.keys(grouped).forEach((key) => {
    const listings = grouped[key];
    if (listings.length > 1) {
      listings.forEach((listing, index) => {
        const angle = (index / listings.length) * 2 * Math.PI;
        listing.coordinates.lat += offsetDistance * Math.cos(angle);
        listing.coordinates.lng += offsetDistance * Math.sin(angle);
      });
    }
  });
  return grouped;
};

const Map: React.FC<MapProps> = ({ listings, openModal, hoveredListingId }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);

  const handleLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setIsMapLoaded(true);
  };

  const markerRefs = useRef<(google.maps.Marker | null)[]>([]);

  const getIcon = (hover: boolean) => ({
    url: hover ? `/images/bubble-hover.svg` : `/images/bubble.svg`,
    scaledSize: new google.maps.Size(40, 20),
    labelOrigin: new google.maps.Point(20, 9),
  });

  const groupedListings = groupMarkersByCoordinates(listings);
  const offsetListings = applyOffsetToGroupedMarkers(groupedListings);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14.75}
      center={center}
      options={mapOptions}
      onLoad={handleLoad}
    >
      <Polygon
        paths={boundaries}
        options={{
          fillColor: "lightgreen",
          fillOpacity: 0.05,
          strokeColor: "green",
          strokeOpacity: 1,
          strokeWeight: 2,
        }}
      />
      {isMapLoaded &&
        Object.values(offsetListings)
          .flat()
          .map((listing, index) => (
            <Marker
              key={listing.id}
              position={listing.coordinates}
              icon={getIcon(listing.id === hoveredListingId)}
              label={{
                text: formatPrice(listing.price),
                color: "white",
                fontSize: "10px",
                fontWeight: "bold",
                className: styles.customMarkerLabel, // Add a custom class if you need more control over the style
              }}
              options={{
                optimized: false, // Ensures the custom class is applied
                zIndex:
                  listing.id === hoveredListingId ||
                  listing.id === hoveredMarkerId
                    ? 1000
                    : index + 1, // Set zIndex based on the current hover state and index
              }}
              onLoad={(marker) => {
                markerRefs.current[index] = marker;
              }}
              onMouseOver={() => {
                const marker = markerRefs.current[index];
                if (marker) {
                  marker.setIcon(getIcon(true));
                  marker.setZIndex(1000); // Increase zIndex on hover
                }
              }}
              onMouseOut={() => {
                const marker = markerRefs.current[index];
                if (marker) {
                  marker.setIcon(getIcon(false));
                  marker.setZIndex(index + 1); // Reset zIndex when not hovered
                }
              }}
              onClick={() => openModal(listing)}
            />
          ))}
    </GoogleMap>
  );
};

export default Map;
