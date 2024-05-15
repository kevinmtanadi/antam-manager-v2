import { Spinner } from "@nextui-org/react";

const OverlaySpinner = () => {
  return (
    <div className="items-center flex justify-center bg-[rgba(0,0,0,0.6)]  z-50 absolute top-0 bottom-0 w-full h-full">
      <Spinner size="lg" />
    </div>
  );
};

export default OverlaySpinner;
