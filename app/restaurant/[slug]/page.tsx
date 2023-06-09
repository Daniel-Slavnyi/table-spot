import React from 'react';
import RestaurantNavBar from './components/RestaurantNavBar';
import Title from './components/Title';
import Rating from './components/Rating';
import Description from './components/Description';
import Images from './components/Images';
import Reviews from './components/Reviews';
import ReservationCard from './components/ReservationCard';
import { PrismaClient, Review } from '@prisma/client';
import { notFound } from 'next/navigation';

interface Restaurant {
  id: number;
  name: string;
  main_image: string;
  images: string[];
  description: string;
  slug: string;
  review: Review[];
  open_time: string;
  close_time: string;
}

const prisma = new PrismaClient();

const fetchRestaurantBySlug = async (slug: string): Promise<Restaurant> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      main_image: true,
      images: true,
      description: true,
      slug: true,
      review: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    notFound();
  }

  return restaurant;
};

export default async function Restaurant({
  params,
}: {
  params: { slug: string };
}) {
  const restaurant = await fetchRestaurantBySlug(params.slug);
  return (
    <div className="flex justify-between max-lg:flex-col">
      <div className="bg-white w-[70%] max-lg:w-[100%] rounded p-3 shadow">
        <RestaurantNavBar slug={restaurant.slug} />
        <Title name={restaurant.name} />
        <Rating reviews={restaurant.review} />
        <Description description={restaurant.description} />
        <Images images={restaurant.images} />
        <Reviews review={restaurant.review} />
      </div>
      <div className="w-[27%] max-lg:w-[100%] relative max-lg:static text-reg">
        <ReservationCard
          openTime={restaurant.open_time}
          closeTime={restaurant.close_time}
          slug={restaurant.slug}
        />
      </div>
    </div>
  );
}
