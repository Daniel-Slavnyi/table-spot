import React from "react";
import { Cuisine, Location, PRICE } from "@prisma/client";
import Link from "next/link";

export default function SearchSideBar({
  location,
  cuisineList,
  searchParams,
}: {
  location: Location[];
  cuisineList: Cuisine[];
  searchParams: {
    city?: string | undefined;
    cuisine?: string | undefined;
    price?: PRICE | undefined;
  };
}) {
  const price = [
    {
      price: PRICE.CHEAP,
      label: "$",
      className: "border text-center w-full text-reg font-light rounded-l p-2",
    },
    {
      price: PRICE.REGULAR,
      label: "$$",
      className: "border text-center w-full text-reg font-light p-2",
    },
    {
      price: PRICE.EXPENSIVE,
      label: "$$$",
      className: "border text-center w-full text-reg font-light p-2 rounded-r",
    },
  ];

  return (
    <div className="w-1/5">
      <div className="border-b pb-4 flex flex-col">
        <h1 className="mb-2">Region</h1>
        {location.map((item) => (
          <Link
            key={item.id}
            className="font-light text-reg capitalize"
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                city: item.name,
              },
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="border-b pb-4 mt-3 flex flex-col">
        <h1 className="mb-2">Cuisine</h1>
        {cuisineList.map((item) => (
          <Link
            key={item.id}
            className="font-light text-reg capitalize"
            href={{
              pathname: "/search",
              query: {
                ...searchParams,
                cuisine: item.name,
              },
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          {price.map(({ price, label, className }) => (
            <Link
              key={label}
              className={className}
              href={{
                pathname: "/search",
                query: {
                  ...searchParams,
                  price: price,
                },
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
