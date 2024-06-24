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

const listings = [
  { id: 1, title: 'Charming Victorian', price: '$3,500/mo', address: '818 Divisadero Street, San Francisco, CA 94117' },
  // Add more listings here
];

const Directory: React.FC = () => {
  return (
    <div className="flex h-screen">
      <div className="fixed top-[9.75rem] left-0 bottom-0 w-1/2">
        <Map />
      </div>
      <div className="ml-auto w-1/2 overflow-y-auto" style={{ marginTop: '4.5rem' }}>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Today</h2>
          {listings.map(listing => (
            <div key={listing.id} className="mb-4">
              <h3 className="text-xl font-semibold">{listing.title}</h3>
              <p>{listing.price}</p>
              <p>{listing.address}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Directory;
