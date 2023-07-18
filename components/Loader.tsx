import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="absolute flex justify-content w-screen h-screen overflow-hidden my-auto bg-cyan-950 border-black z-50">
        <img src='/loading.gif' className="m-auto mt-auto mb-auto flex align-middle w-200 h-150" />
    </div>
  );
};

export default Loading;