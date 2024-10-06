export const RoomSponsorBanner = () => {
  return (
    <a
      href="https://joinaccelr8.com/"
      target="_blank"
      className="my-6 rounded-xl p-4 transition-filter duration-200 bg-gradient-to-r from-cyan-200 to-pink-200 hover:brightness-90 shadow-lg shadow-cyan-400/30 flex justify-between filter"
    >
      <div className="text-center grow">
        <h3 className="text-xl font-bold italic ">ACCELR8</h3>
        <p className="text-gray-700">
          DeSci + Deeptech cohort applications open
        </p>
      </div>
      <div className="flex flex-col justify-end">
        <span className="text-gray-400 text-xs text-center">
          Sponsored by ACCELR8
        </span>
      </div>
    </a>
  );
};
