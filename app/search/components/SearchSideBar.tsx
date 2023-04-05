import { Cuisine, Location } from "@prisma/client";
import React from "react";

export default function SearchSideBar({
  location,
  cuisine,
}: {
  location: Location[];
  cuisine: Cuisine[];
}) {
  return (
    <div className="w-1/5">
      <div className="border-b pb-4">
        <h1 className="mb-2">Region</h1>
        {location.map((item) => (
          <p key={item.id} className="font-light text-reg capitalize">
            {item.name}
          </p>
        ))}
      </div>
      <div className="border-b pb-4 mt-3">
        <h1 className="mb-2">Cuisine</h1>
        {cuisine.map((item) => (
          <p key={item.id} className="font-light text-reg capitalize">
            {item.name}
          </p>
        ))}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          <button className="border w-full text-reg font-light rounded-l p-2">
            $
          </button>
          <button className="border-r border-t border-b w-full text-reg font-light p-2">
            $$
          </button>
          <button className="border-r border-t border-b w-full text-reg font-light p-2 rounded-r">
            $$$
          </button>
        </div>
      </div>
    </div>
  );
}
