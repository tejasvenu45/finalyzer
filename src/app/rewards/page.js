"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
// const res = await fetch("/api/user/points");
//
const giftCards = [
  {
    name: "Google Play Gift Card",
    image: "/images/googleplay.jpeg",
    points: 1200,
  },
  {
    name: "Amazon Gift Card",
    image: "/images/amazon.jpeg",
    points: 1500,
  },
  {
    name: "Steam Gift Card",
    image: "/images/steam.jpeg",
    points: 1750,
  },
];

export default function RewardsPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserPoints() {
      try {
        const res = await fetch("/api/user/points", {
          method: "GET",
          credentials: "include", // ✅ this sends cookies!
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          console.error("Failed to fetch points");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    fetchUserPoints();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-purple-700">Rewards</h1>
        <div className="text-lg font-semibold text-green-600">
          Points: 100
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {giftCards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <Image
              src={card.image}
              alt={card.name}
              width={300}
              height={200}
              className="rounded-md object-cover"
            />
            <div className="mt-4">
              <h2 className="text-xl font-semibold">{card.name}</h2>
              <p className="text-gray-600 mt-2">
                Redeem for {card.points} points
              </p>
              <button
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                disabled={!user || user.points < card.points}
              >
                {user && user.points >= card.points
                  ? "Redeem"
                  : "Not Enough Points"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}