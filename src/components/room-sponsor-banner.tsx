export const RoomSponsorBanner = () => {
  return (
    <a
      href="https://forms.gle/7m5F1MRicU5dVM3z9"
      target="_blank"
      className="my-6 rounded-xl p-4 transition-filter border-[#1D462F] border-[1px] duration-200 bg-gradient-to-r from-[#F7FCEF] to-green-600/10 hover:brightness-90 shadow-lg shadow-green-800/25 flex justify-between filter"
    >
      <div className="grow flex flex-col justify-center items-center">
        <img
          src="/images/sponsorship/accelr8.png"
          className="w-3/4 max-w-xs"
        ></img>
        <p className="text-gray-700 text-center text-sm sm:text-base">
          AI \ Deeptech \ DeSci Founders
        </p>
      </div>
      <div className="flex flex-col">
        <div className="grow flex flex-col justify-center">
          <p className="text-sm border-[#1D462F] border-[1px] border-dashed rounded-full p-1 px-2 text-center whitespace-nowrap">
            {" "}
            Apply now
          </p>
        </div>
        <span className="text-gray-400 text-[.5rem] sm:text-xs text-center pb-1">
          Sponsored by ACCELR8
        </span>
      </div>
    </a>
  );
};
