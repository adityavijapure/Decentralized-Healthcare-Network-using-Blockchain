import React from "react";

const doctors = [
  {
    name: "Dr. Aditi Sharma",
    role: "Cardiologist",
    experience: "12+ Years Experience",
    hospital: "Apollo Hospitals",
    img: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  },
  {
    name: "Dr. Rohan Mehta",
    role: "Neurologist",
    experience: "10+ Years Experience",
    hospital: "Fortis Healthcare",
    img: "https://cdn-icons-png.flaticon.com/512/4140/4140037.png",
  },
  {
    name: "Dr. Kavya Patel",
    role: "Pediatrician",
    experience: "8+ Years Experience",
    hospital: "AIIMS Delhi",
    img: "https://cdn-icons-png.flaticon.com/512/4140/4140056.png",
  },
  {
    name: "Dr. Sameer Khan",
    role: "Orthopedic Surgeon",
    experience: "15+ Years Experience",
    hospital: "Manipal Hospitals",
    img: "https://cdn-icons-png.flaticon.com/512/4140/4140061.png",
  },
];

export default function Doctors() {
  return (
    <div className="min-h-screen bg-white px-6 py-16">

      {/* Heading */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#0b1f44]">
          Meet Our <span className="text-blue-600">Expert Doctors</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Highly qualified specialists providing trusted medical care
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-14">

        {doctors.map((doc, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl hover:border-blue-400 transition duration-300"
          >
            <div className="flex flex-col items-center">

              <img
                src={doc.img}
                alt={doc.name}
                className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md"
              />

              <h2 className="text-lg font-bold mt-4 text-[#0b1f44]">
                {doc.name}
              </h2>

              <p className="text-blue-600 text-sm font-semibold">
                {doc.role}
              </p>

              <p className="text-gray-600 text-sm mt-2">
                {doc.experience}
              </p>

              <p className="text-gray-500 text-sm">
                {doc.hospital}
              </p>

              <button className="mt-5 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition font-semibold shadow">
                View Profile
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
