import { Review } from "@prisma/client";
import React from "react";
import ReviewCard from "./ReviewCard";

export default function Reviews({ review }: { review: Review[] }) {
  return (
    <div>
      <h1 className="font-bold text-3xl mt-10 mb-7 borber-b pb-5">
        What {review.length} {review.length === 1 ? "person" : "people"} are
        saying
      </h1>
      <div>
        {review.map((item) => (
          <ReviewCard key={item.id} review={item} />
        ))}
      </div>
    </div>
  );
}
