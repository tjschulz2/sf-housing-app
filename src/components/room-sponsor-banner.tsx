export const RoomSponsorBanner = () => {
  return (
    <a
      href="https://joinaccelr8.com/"
      target="_blank"
      className="my-6 rounded-xl p-4 transition-filter border-[#1D462F] border-[1px] duration-200 bg-gradient-to-r from-[#F7FCEF] to-green-600/10 hover:brightness-90 shadow-lg shadow-green-800/25 flex justify-between filter"
    >
      <div className="text-center grow flex flex-col justify-center">
        <h3 className="text-xl font-bold italic ">ACCELR8 House</h3>
        <p className="text-gray-700">AI \ Deeptech \ DeSci Founders</p>
      </div>
      <div className="flex flex-col justify-end">
        <p className=" border-[#1D462F] border-[1px] border-dashed rounded-full p-1 px-2 text-center mb-2">
          Applications open
        </p>
        <span className="text-gray-400 text-xs text-center">
          Sponsored by ACCELR8
        </span>
      </div>
    </a>
  );
};
