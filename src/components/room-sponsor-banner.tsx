export const RoomSponsorBanner = () => {
  return (
    <a
      href="https://joinaccelr8.com/"
      target="_blank"
      className="my-6 rounded-xl p-4 transition-filter duration-200 bg-gradient-to-r from-cyan-200 to-pink-200 hover:brightness-90 shadow-lg shadow-cyan-400/30 flex justify-between filter"
    >
      <div className="text-center grow flex flex-col justify-center">
        <h3 className="text-xl font-bold italic ">ACCELR8</h3>
        <p className="text-gray-700">DeSci + Deeptech cohort</p>
      </div>
      <div className="flex flex-col justify-end">
        <p className="border-solid border-2 border-cyan-400/30 rounded-full p-1 px-2 text-center mb-2">
          House applications open
        </p>
        <span className="text-gray-400 text-xs text-center">
          Sponsored by ACCELR8
        </span>
      </div>
    </a>
  );
};
