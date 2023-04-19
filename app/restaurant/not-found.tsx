"use client";

import Image from "next/image";
import errorImage from "../../public/error.png";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="h-screen bg-gray-200 flex flex-col justify-center items-center">
      <Image src={errorImage} alt="errorImage" className="w-56 mb-8" />
      <div className="bg-white px-9 py-14 shadow rounded">
        <h3 className="text-3xl font-bold">Well, this is embarrassing</h3>
        <p className="text-reg font-bold">We couldn*t find that restaurant</p>
        <p className="mt-6 text-sm font-light">Error code: 404</p>
      </div>
    </div>
  );
}