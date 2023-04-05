import React from "react";
import { Item, PrismaClient } from "@prisma/client";
import RestaurantNavBar from "../components/RestaurantNavBar";
import Menu from "../components/Menu";

const prisma = new PrismaClient();

const fetchRestaurantMenu = async (slug: string) => {
  const restaurantMenu = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      items: true,
    },
  });

  if (!restaurantMenu) {
    throw new Error();
  }

  return restaurantMenu.items;
};

export default async function RestaurantMenu({
  params,
}: {
  params: { slug: string };
}) {
  const menu = await fetchRestaurantMenu(params.slug);
  return (
    <>
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <RestaurantNavBar slug={params.slug} />
        <Menu menu={menu} />
      </div>
    </>
  );
}
