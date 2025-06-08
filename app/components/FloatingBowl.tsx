import React from 'react';
import Image from 'next/image';

const FloatingBowl: React.FC = () => {
  return (
    <div className="animate-float flex justify-center w-full">
      <Image
        src="/images/bolana.png"
        alt="Bolana bowl"
        width={256}
        height={256}
        priority
        className="hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
};

export default FloatingBowl; 