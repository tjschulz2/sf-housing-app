import React from 'react';
import styles from './rentalsmodalstyles.module.css'
import Portal from './portal'

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

interface ModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ listing, isOpen, onClose }) => {
    if (!isOpen || !listing) return null;

    return (
    <Portal>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
        <button onClick={onClose} className={styles.modalCloseButton}>
          &times;
        </button>
          <div className="flex flex-col h-full">
            <div className="w-full h-auto p-6 overflow-y-auto">
              <img src={listing.imageUrl} alt={listing.title} className="w-full h-64 object-cover mb-4 rounded-lg" />
              <div className="text-lg font-bold mb-2">{listing.price}/mo</div>
              <div className="text-sm text-gray-600 mb-4">
                {listing.beds} bd • {listing.baths} ba • {listing.sqft} sqft
              </div>
              <div className="text-sm text-gray-600 mb-4">{listing.address}</div>
              <div className="mb-4">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBu1Eb9VxIF-3RLo0WubSKo1kPwoQ6Ejvs&q=${listing.coordinates.lat},${listing.coordinates.lng}`}
                  className="w-48 h-48"
                  allowFullScreen
                  style={{ border: 0 }}
                ></iframe>
              </div>
              <button className="w-1/2 bg-[#1D462F] text-white py-2 px-4 rounded-lg mb-6">
                Setup tour
              </button>
              <div className="text-sm text-gray-600 mb-2">
                <strong>Overview</strong>
                <p>Available now</p>
                <p>Apartment</p>
                <p>Lower Haight</p>
                <p>$3,500 deposit</p>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                <strong>Description</strong>
                <p>* MOVE-IN OFFER: 6 weeks free!</p>
                <p>* LOOK AND LEASE – limited time! An additional 2 weeks free for leases signed within 48 hours of the tour!</p>
                <p>* SECURITY DEPOSIT SPECIAL: $1000 security deposit with approved credit</p>
                <p>Take a Virtual Tour</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
    );
  };
  
  export default Modal;
