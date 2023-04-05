import React from "react";
import { PrismaClient } from "@prisma/client";
import Header from "./components/Header";
import SearchSideBar from "./components/SearchSideBar";
import RestaurantCard from "./components/RestaurantCard";

const prisma = new PrismaClient();

const fetchRestaurantByLocation = (city: string | undefined) => {
  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
  };

  if (!city) {
    return prisma.restaurant.findMany({ select });
  }

  return prisma.restaurant.findMany({
    where: {
      location: { name: { equals: city } },
    },
    select,
  });
};

const fetchLocation = async () => {
  const location = await prisma.location.findMany();

  return location;
};

const fetchCuisine = async () => {
  const cuisine = await prisma.cuisine.findMany();

  return cuisine;
};

export default async function Search({
  searchParams,
}: {
  searchParams: { city: string };
}) {
  const restaurants = await fetchRestaurantByLocation(searchParams.city);

  const location = await fetchLocation();
  const cuisine = await fetchCuisine();

  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar location={location} cuisine={cuisine} />
        <div className="w-5/6">
          {restaurants.length ? (
            <>
              {restaurants.map((restaurant) => (
                <RestaurantCard restaurant={restaurant} key={restaurant.id} />
              ))}
            </>
          ) : (
            <p>Sorry, we found no restaurants in this area</p>
          )}
        </div>
      </div>
    </>
  );
}
