import React from "react";
import { PRICE } from "@prisma/client";

export default function Price({ price }: { price: PRICE }) {
  const renderPrice = () => {
    switch (price) {
      case "CHEAP":
        return (
          <>
            <span>$$</span>
            <span className="text-gray-400">$$</span>
          </>
        );
      case "REGULAR":
        return (
          <>
            <span>$$$</span>
            <span className="text-gray-400">$</span>
          </>
        );
      case "EXPENSIVE":
        return (
          <>
            <span>$$$$</span>
          </>
        );
      default:
        break;
    }
  };
  return <p className="mr-3">{renderPrice()}</p>;
}
