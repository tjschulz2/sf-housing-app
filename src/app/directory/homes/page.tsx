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
import { getRentalsWithImages } from "../../../lib/utils/data";
import EmailSignup from "@/app/email-signup/page";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { number } from "zod";

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

interface RentalImage {
  image_url: string;
}

interface Rental {
  id: number;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  address: string;
  rental_images: RentalImage[];
  description: string;
}

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
console.log("GOOGLE MAPS API KEY:", googleMapsApiKey);

const geocodeAddress = async (
  address: string
): Promise<{ lat: number; lng: number }> => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${googleMapsApiKey}`
  );
  const data = await response.json();
  if (data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  }
  return { lat: 0, lng: 0 }; // Default coordinates if geocoding fails
};

const Directory: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredListingId, setHoveredListingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const homeID = Number(searchParams.get("id"));
  console.log("Home ID:", homeID);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const rentals: Rental[] = await getRentalsWithImages();
      console.log("Fetched rentals:", rentals);
      const listingsWithCoordinates = await Promise.all(
        rentals.map(async (rental) => {
          const coordinates = await geocodeAddress(rental.address);
          return {
            id: rental.id,
            price: rental.monthly_rent,
            beds: rental.bedrooms,
            baths: rental.bathrooms,
            sqft: rental.sqft,
            address: rental.address,
            imageUrls: rental.rental_images.map(
              (img: RentalImage) => img.image_url
            ),
            coordinates,
            description: rental.description,
          };
        })
      );
      setListings(listingsWithCoordinates);
      console.log(listings);
      setLoading(false);
    };
    fetchListings();
  }, []);

  useEffect(() => {
    if (homeID) {
      const targetListing = listings.find((listing) => listing.id === homeID);
      console.log("Target listing:", targetListing);
      if (targetListing) {
        openModal(targetListing);
      }
    }
  }, [listings]);

  function handleListingClick(listing: Listing) {
    router.push(
      pathname + "?" + createQueryString("id", listing.id.toString())
    );
    openModal(listing);
  }

  const openModal = (listing: Listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    router.push(pathname);
    setSelectedListing(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  function handleConfirm() {
    window.location.href =
      "https://airtable.com/appurOWXAegMj76UY/pagI9io5qFhw7F264/form";
  }

  return (
    <div className="flex">
      <div
        className={`absolute top-[3.46rem] left-0 bottom-0 w-1/2 h-[calc(100vh-9.75rem)] ${styles.mapContainer}`}
      >
        <Map
          hoveredListingId={hoveredListingId}
          openModal={handleListingClick}
          listings={listings}
        />
      </div>
      <div
        className={`ml-auto w-1/2 overflow-y-auto lg:max-h-[70vh] ${styles.contentContainer}`}
      >
        <div className="p-4">
          <div className="bg-[#ECEDDC] p-6 rounded-lg mb-6 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center mb-2 sm:mb-4">
              <span className="text-2xl sm:text-4xl mr-2">🏡🌳</span>
            </div>
            <h1
              className="text-xl sm:text-3xl font-bold text-center mb-2 sm:mb-4"
              style={{ color: "#1D462F" }}
            >
              We are coordinating 10K+ builders to live in Hayes Valley
            </h1>
            <p className="text-center text-sm sm:text-lg text-gray-700">
              All homes listed below are within a square mile and will
              drastically increase your chances of luck, living near the best
              people, and making lifelong friends.
            </p>
            <Button
              className="rounded-3xl mt-4 sm:mt-6 bg-[#1D462F] text-xs sm:text-base"
              onClick={handleConfirm}
            >
              List a property
            </Button>
          </div>
          <h2 className="text-2xl font-bold mb-4">Listings</h2>
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
              {listings.map((listing) => (
                <button
                  key={listing.id}
                  className="bg-white rounded-lg overflow-hidden border border-[#C7C6C6] text-left hover:border-[#1D462F] hover:rounded-lg p-0"
                  onClick={() => handleListingClick(listing)}
                  onMouseEnter={() => setHoveredListingId(listing.id)}
                  onMouseLeave={() => setHoveredListingId(null)}
                >
                  <div className="relative w-full h-48">
                    <img
                      src={listing.imageUrls[0]}
                      alt={listing.address}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-lg font-bold mb-2">
                      {listing.price
                        .toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                        .replace(/\.00$/, "") + "/mo"}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="text-[#474747]">{listing.beds}</span>
                      <span className="text-[#808080]"> bd</span>
                      <span className="text-[#D9D9D9]"> | </span>
                      <span className="text-[#474747]">{listing.baths}</span>
                      <span className="text-[#808080]"> ba</span>
                      <span className="text-[#D9D9D9]"> | </span>
                      <span className="text-[#474747]">{listing.sqft}</span>
                      <span className="text-[#808080]"> sqft</span>
                    </div>
                    <div className="text-sm text-[#808080] mt-2">
                      {listing.address}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="w-full bg-[#F6F3E4] rounded-2xl p-6 text-center">
              <p className="text-[#727272] text-xl">Rentals coming soon...</p>
            </div>
          )}
        </div>
      </div>
      <RentalsModal
        listing={selectedListing}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Directory;
