"use client";
import styles from "./page.module.css";
import ProfileCard from "../../../components/profile-card";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { differenceInDays } from "date-fns";
import ActiveSpaceBanner from "@/components/spaces/active-space-banner";
import { useSpacesContext } from "@/contexts/spaces-context";
import EditSpaceListingDialog from "@/components/spaces/edit-space-listing-dialog";
import SpaceProfileCard from "@/components/cards/space-profile-card";
import CardGrid from "@/components/cards/card-grid";
import LoadingSpinner from "@/components/loading-spinner/loading-spinner";
import { Button } from "@/components/ui/button";
import Map from "@/components/map";
import RentalsModal from "@/components/rentalsmodal";

interface Listing {
  id: number;
  title: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  address: string;
  imageUrl: string;
  coordinates: { lat: number; lng: number };
}

const listings: Listing[] = [
  {
    id: 1,
    title: 'Charming Victorian',
    price: '$8,000/mo',
    beds: 4,
    baths: 2,
    sqft: 1500,
    address: '818 Divisadero Street, San Francisco, CA 94117',
    imageUrl: 'https://s.hdnux.com/photos/01/17/44/55/20859722/4/rawImage.jpg',
    coordinates: { lat: 37.775, lng: -122.437 }
  },
  {
    id: 2,
    title: 'Cozy Apartment',
    price: '$3,500/mo',
    beds: 2,
    baths: 1,
    sqft: 950,
    address: '612 Haight Street, San Francisco, CA 94117',
    imageUrl: 'https://www.innsf.com/wp-content/uploads/sites/20/Postcard_Row.jpg',
    coordinates: { lat: 37.772, lng: -122.438 }
  },
  {
    id: 3,
    title: 'Charming Victorian',
    price: '$8,000/mo',
    beds: 4,
    baths: 2,
    sqft: 1500,
    address: '818 Divisadero Street, San Francisco, CA 94117',
    imageUrl: 'https://s.hdnux.com/photos/01/17/44/55/20859722/4/rawImage.jpg',
    coordinates: { lat: 37.775, lng: -122.437 },
  },
  {
    id: 4,
    title: 'Cozy Apartment',
    price: '$3,500/mo',
    beds: 2,
    baths: 1,
    sqft: 950,
    address: '612 Haight Street, San Francisco, CA 94117',
    imageUrl: 'https://www.innsf.com/wp-content/uploads/sites/20/Postcard_Row.jpg',
    coordinates: { lat: 37.772, lng: -122.438 }
  },
  // Add more listings here
];

const Directory: React.FC = () => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (listing: Listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedListing(null);
    setIsModalOpen(false);
  };

  return (
    <div className={`flex h-screen ${styles.directoryContent}`}>
      <div className="absolute top-[2.75rem] left-0 bottom-0 w-1/2 h-[calc(100vh-9.75rem)]">
        <Map />
      </div>
      <div className="ml-auto w-1/2 overflow-y-auto" style={{ marginTop: '0rem' }}>
        <div className="p-4">
          <div className="bg-[#ECEDDC] p-6 rounded-lg mb-6">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-2">🏡🌳</span>
            </div>
            <h1 className="text-3xl font-bold text-center mb-4" style={{ color: '#1D462F' }}>
              We’re coordinating 10K+ technologists to live in Hayes Valley
            </h1>
            <p className="text-center text-lg text-gray-700">
              All homes listed below are within a square mile and will drastically increase your chances of luck, living near the best people, and making lifelong friends.
            </p>
          </div>
          <h2 className="text-2xl font-bold mb-4">Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map(listing => (
              <button key={listing.id} className="bg-white rounded-lg overflow-hidden shadow-md text-left" onClick={() => openModal(listing)}>
                <img src={listing.imageUrl} alt={listing.title} className="w-full h-48 object-cover"/>
                <div className="p-4">
                  <div className="text-lg font-bold mb-2">{listing.price}</div>
                  <div className="text-sm text-gray-600">
                    {listing.beds}bd {listing.baths}ba • {listing.sqft} sqft
                  </div>
                  <div className="text-sm text-gray-600">{listing.address}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <RentalsModal listing={selectedListing} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Directory;
