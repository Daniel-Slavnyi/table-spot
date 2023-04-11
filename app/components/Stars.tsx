import React from "react";
import emptyStar from "../../public/empty-star.png";
import halfStar from "../../public/half-star.png";
import fullStar from "../../public/full-star.png";
import Image from "next/image";
import { calculateReviewsRatingAverage } from "../../utils/calculateReviews";
import { Review } from "@prisma/client";

export default function Stars({
  reviews,
  rating,
}: {
  reviews: Review[];
  rating?: number;
}) {
  const ratingStar = rating || calculateReviewsRatingAverage(reviews);

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      const difference = parseFloat((ratingStar - i).toFixed(1));

      if (difference >= 1) {
        stars.push(fullStar);
      } else if (difference < 1 && difference > 0) {
        if (difference <= 0.2) {
          stars.push(emptyStar);
        } else if (difference > 0.2 && difference <= 0.6) {
          stars.push(halfStar);
        } else {
          stars.push(fullStar);
        }
      } else stars.push(emptyStar);
    }
    return stars.map((star, idx) => (
      <Image key={idx} src={star} alt="star" className="w-4 h-4 mr-1" />
    ));
  };
  return <div className="flex items-center">{renderStars()}</div>;
}
