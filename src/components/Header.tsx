import React from "react";
import Image from "next/image";

interface HeaderProps {
  isLoggedIn: boolean;
  onLoginToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  onLoginToggle,
}) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image src="/logo.svg" alt="AudioTrans Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold text-coral">AudioTrans</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a
                href="#"
                className="text-dark-gray hover:text-coral transition-colors duration-200"
              >
                How it works
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-dark-gray hover:text-coral transition-colors duration-200"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-dark-gray hover:text-coral transition-colors duration-200"
              >
                Case studies
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-dark-gray hover:text-coral transition-colors duration-200"
              >
                About
              </a>
            </li>
          </ul>
        </nav>
        <button
          onClick={onLoginToggle}
          className="px-4 py-2 bg-coral text-white rounded-full hover:bg-coral-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-coral"
        >
          {isLoggedIn ? "Profile" : "Log in"}
        </button>
      </div>
    </header>
  );
};
