"use client";
import { useState } from "react";
import Modal from "../modal/modal";
import styles from "./see-more-button.module.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ChildComponentProps = {
  seeMoreText: string;
  color: string;
};

export default function SeeMoreButton({
  seeMoreText,
  color,
}: ChildComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  let colorClass: any;
  if (color === "purple") {
    colorClass = styles.colorPurple;
  } else if (color === "green") {
    colorClass = styles.colorGreen; // Make sure to define colorGreen in your styles
  } else {
    colorClass = styles.colorBlue;
  }

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    openModal();
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  // return (
  //   <>
  //     <a className={`${styles.seeMore} ${colorClass}`} onClick={handleClick}>
  //       {"See more"}
  //     </a>
  //     <Modal closeModal={closeModal} isOpen={isOpen}>
  //       <div className={styles.modalContents}>
  //         <button
  //           className="absolute top-0 right-1 font-bold"
  //           onClick={closeModal}
  //         >
  //           x
  //         </button>
  //         <h2 className="text-2xl font-bold my-4">About</h2>
  //         <p style={{ color: "grey" }}>{seeMoreText}</p>
  //       </div>
  //     </Modal>
  //   </>
  // );

  return (
    <Dialog>
      <DialogTrigger className="ml-1 text-sky-600 hover:text-sky-700">
        See More
      </DialogTrigger>
      <DialogContent className="max-h-[600px] md:max-h-[750px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>About</DialogTitle>
          <DialogDescription className="whitespace-pre-line">
            {seeMoreText}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
