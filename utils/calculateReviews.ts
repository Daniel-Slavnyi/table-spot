import { Review } from "@prisma/client";

export const calculateReviewsRatingAverage = (reviews: Review[]) => {
    if (!reviews.length) return 
    
    return (reviews.reduce((sum, rev) => { return sum + rev.rating}, 0)/ reviews.length)
}