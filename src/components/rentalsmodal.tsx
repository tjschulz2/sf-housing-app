import React, { useState, useRef, useEffect } from "react";
import styles from "./rentalsmodalstyles.module.css";
import Portal from "./portal";
import ImageGalleryOverlay from "./imagegalleryoverlay";
import Carousel from "./mobilecarousel";
import "react-quill/dist/quill.snow.css"; // Import styles
import { useAuthContext } from "@/contexts/auth-context";

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

interface ModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ listing, isOpen, onClose }) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const { userData } = useAuthContext();

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1041);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call handler right away to set initial state

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !isGalleryOpen
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, isGalleryOpen]);

  if (!isOpen || !listing) return null;

  const handleImageClick = (index: number) => {
    setGalleryStartIndex(index);
    setIsGalleryOpen(true);
  };

  const handleGalleryClose = () => {
    setIsGalleryOpen(false);
  };

  function handleButtonClick() {
    const name = userData?.name ?? "";
    const address = listing?.address ?? "";
    const airtableFormUrl =
      "https://airtable.com/appBMzjGje3fn7Ijs/pagM8PwLNM3kfEVcz/form";
    const filledFormUrl = `${airtableFormUrl}?prefill_Property%20address=${encodeURIComponent(
      address
    )}&prefill_Name=${encodeURIComponent(name)}`;
    window.location.href = filledFormUrl;
  }

  const formatText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line: string, index: number) => {
      if (line.startsWith("**")) {
        return (
          <div key={index} style={{ fontWeight: "bold", marginTop: "1rem" }}>
            {line.replace(/\*\*/g, "")}
          </div>
        );
      } else if (line.startsWith("- ")) {
        return (
          <div key={index} style={{ marginLeft: "1rem" }}>
            {line}
          </div>
        );
      } else {
        return (
          <div key={index} style={{ marginTop: "1rem" }}>
            {line}
          </div>
        );
      }
    });
  };

  return (
    <Portal zIndex={10}>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer} ref={modalRef}>
          <button onClick={onClose} className={styles.modalCloseButton}>
            &times;
          </button>
          {isSmallScreen && (
            <Carousel
              images={listing.imageUrls}
              onImageClick={handleImageClick}
            />
          )}
          <div className={`flex h-full ${isSmallScreen ? "w-full" : ""}`}>
            {!isSmallScreen && (
              <div className="w-1/2 h-full overflow-y-scroll">
                <img
                  src={listing.imageUrls[0]}
                  className="w-full h-[60vh] object-cover mb-2 cursor-pointer"
                  onClick={() => handleImageClick(0)}
                />
                <div className="grid grid-cols-2 gap-2">
                  {listing.imageUrls.slice(1).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${index + 1}`}
                      className="w-full h-[calc((100vw/4)-1rem)] object-cover cursor-pointer"
                      onClick={() => handleImageClick(index + 1)}
                    />
                  ))}
                </div>
              </div>
            )}
            <div
              className={`${
                isSmallScreen ? "w-full" : "w-1/2 overflow-y-auto"
              } h-full `}
            >
              {!isSmallScreen && (
                <header
                  className={`
                  bg-[#FEFBEB]
                  flex items-center
                  px-4 sm:px-10 py-5
                  border-b border-black border-opacity-10
                  relative
                  ${styles.responsiveHeaderPadding}
                `}
                >
                  <div
                    className={`
                    flex flex-row items-center space-x-3 
                    px-3 py-4 transition-all duration-300
                    -my-5 ${styles.hiddenOnVerySmallScreens} // Negative margin to extend to top and bottom
                  `}
                  >
                    <img
                      className="w-7 h-9"
                      src="/solaris_ai_logo.png"
                      alt="Solaris logo"
                    />
                    <span className={styles.branding}>SOLARIS</span>
                  </div>
                </header>
              )}
              <div className="p-6">
                <div className="flex items-baseline mb-2">
                  <div
                    className="font-bold"
                    style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
                  >
                    {listing.price
                      .toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })
                      .replace(/\.00$/, "")}
                  </div>
                  <div
                    className="font-bold mr-2"
                    style={{ fontSize: "clamp(0.875rem, 1.8vw, 1.125rem)" }}
                  >
                    /mo
                  </div>
                  <div
                    className="text-sm text-gray-600 ml-4"
                    style={{ fontSize: "clamp(0.875rem, 1.8vw, 1.125rem)" }}
                  >
                    <span className="text-[#474747]">{listing.beds}</span>
                    <span className="text-[#808080]"> bd</span>
                    <span className="text-[#D9D9D9]"> | </span>
                    <span className="text-[#474747]">{listing.baths}</span>
                    <span className="text-[#808080]"> ba</span>
                    <span className="text-[#D9D9D9]"> | </span>
                    <span className="text-[#474747]">{listing.sqft}</span>
                    <span className="text-[#808080]"> sqft</span>
                  </div>
                </div>
                <div
                  className="text-sm text-[#474747] mt-4"
                  style={{ fontSize: "clamp(0.875rem, 1.8vw, 1.125rem)" }}
                >
                  {listing.address}
                </div>
                <button
                  onClick={handleButtonClick}
                  className="w-full bg-[#1D462F] hover:bg-[#55735E] text-white py-3 px-4 rounded-lg mb-6 mt-8"
                  style={{ fontSize: "clamp(0.875rem, 1.8vw, 1.125rem)" }}
                >
                  Book tour
                </button>
                <div
                  className="text-sm mb-2 mt-8"
                  style={{
                    color: "#1D462F",
                    fontSize: "clamp(0.875rem, 1.8vw, 1.125rem)",
                  }}
                >
                  <strong>Overview</strong>
                  <div className="flex items-center mt-5">
                    <img
                      src="/images/availablenow.png"
                      alt="Available Now"
                      className="w-[21px] h-[21px] mr-2"
                    />
                    <p
                      style={{
                        fontSize: "clamp(0.8rem, 1.6vw, 1rem)",
                        color: "#474747",
                      }}
                    >
                      Available now
                    </p>
                  </div>
                  <div className="flex items-center mt-5">
                    <img
                      src="/images/apartment.png"
                      alt="Apartment"
                      className="w-[21px] h-[21px] mr-2"
                    />
                    <p
                      style={{
                        fontSize: "clamp(0.8rem, 1.6vw, 1rem)",
                        color: "#474747",
                      }}
                    >
                      Apartment
                    </p>
                  </div>
                  <div className="flex items-center mt-5">
                    <img
                      src="/images/location.png"
                      alt="Lower Haight"
                      className="w-[18px] h-[21px] mr-2.5"
                    />
                    <p
                      style={{
                        fontSize: "clamp(0.8rem, 1.6vw, 1rem)",
                        color: "#474747",
                      }}
                    >
                      Lower Haight
                    </p>
                  </div>
                  <div className="flex items-center mt-5">
                    <img
                      src="/images/deposit.png"
                      alt="Deposit"
                      className="w-[21px] h-[21px] mr-2"
                    />
                    <p
                      style={{
                        fontSize: "clamp(0.8rem, 1.6vw, 1rem)",
                        color: "#474747",
                      }}
                    >
                      $3,500 deposit
                    </p>
                  </div>
                </div>
                <div
                  className="text-sm mb-2 mt-8"
                  style={{
                    color: "#1D462F",
                    fontSize: "clamp(0.875rem, 1.8vw, 1.125rem)",
                  }}
                >
                  <strong>Description</strong>
                  <div
                    className="mt-5 mb-10"
                    style={{
                      fontSize: "clamp(0.8rem, 1.6vw, 1rem)",
                      color: "#474747",
                    }}
                  >
                    {formatText(listing.description)}
                  </div>
                </div>
                <div className="mb-4">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${listing.coordinates.lat},${listing.coordinates.lng}&zoom=16`}
                    className="w-full"
                    style={{ border: 0, aspectRatio: "1 / .5" }}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isGalleryOpen && (
          <ImageGalleryOverlay
            images={listing.imageUrls}
            startIndex={galleryStartIndex}
            onClose={handleGalleryClose}
          />
        )}
      </div>
    </Portal>
  );
};

export default Modal;
