import React from "react";
import Image from "next/image";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-6 mb-6">
          <Image src="/logo1.svg" alt="Partner Logo" width={40} height={40} />
          <Image src="/logo2.svg" alt="Partner Logo" width={40} height={40} />
          <Image src="/logo3.svg" alt="Partner Logo" width={40} height={40} />
          <Image src="/logo4.svg" alt="Partner Logo" width={40} height={40} />
          <Image src="/logo5.svg" alt="Partner Logo" width={40} height={40} />
        </div>
        <p className="text-center text-dark-gray">
          &copy; {currentYear} AudioTrans. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
