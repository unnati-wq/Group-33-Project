// src/components/common/StarRating.jsx
import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating, size = 16 }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i}
          size={size}
          className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"} 
        />
      ))}
      <span className="ml-1 text-gray-600">{rating}</span>
    </div>
  );
}