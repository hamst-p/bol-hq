import React from 'react';

const WaveBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0">
          {/* Wave 1 */}
          <div className="absolute w-[200%] h-[60%] top-[15%] left-[-50%] transform rotate-[-3deg] animate-wave1 bg-gradient-to-r from-blue-100/30 to-purple-100/30" />
          
          {/* Wave 2 */}
          <div className="absolute w-[200%] h-[70%] top-[25%] left-[-50%] transform rotate-[2deg] animate-wave2 bg-gradient-to-r from-pink-100/20 to-blue-100/20" />
          
          {/* Wave 3 */}
          <div className="absolute w-[200%] h-[65%] top-[35%] left-[-50%] transform rotate-[-1deg] animate-wave3 bg-gradient-to-r from-purple-100/25 to-pink-100/25" />
        </div>
      </div>
    </div>
  );
};

export default WaveBackground; 