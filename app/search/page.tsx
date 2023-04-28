import React from 'react';
import { PRICE, PrismaClient } from '@prisma/client';
import Header from './components/Header';
import SearchSideBar from './components/SearchSideBar';
import RestaurantCard from './components/RestaurantCard';

interface SearchParams {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}

const prisma = new PrismaClient();

const fetchRestaurantByLocation = (searchParams: SearchParams) => {
  const where: any = {};

  if (searchParams.city) {
    const location = {
      name: { equals: searchParams.city },
    };
    where.location = location;
  }

  if (searchParams.cuisine) {
    const cuisine = {
      name: { equals: searchParams.cuisine },
    };
    where.cuisine = cuisine;
  }

  if (searchParams.price) {
    const price = { equals: searchParams.price };
    where.price = price;
  }

  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    cuisine: true,
    location: true,
    slug: true,
    review: true,
  };

  return prisma.restaurant.findMany({
    where,
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
  searchParams: SearchParams;
}) {
  const restaurants = await fetchRestaurantByLocation(searchParams);

  const location = await fetchLocation();
  const cuisine = await fetchCuisine();
  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar
          location={location}
          cuisineList={cuisine}
          searchParams={searchParams}
        />
        <div className="w-5/6">
          {restaurants.length ? (
            <>
              {restaurants.map(restaurant => (
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
