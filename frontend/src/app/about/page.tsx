"use client";
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-orange-500 flex flex-col pt-8 md:justify-center md:items-center">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">About Vidhyarthi Seva</h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Vidhyarthi Seva is your all-in-one digital platform for student services. We help students find accommodations, courses, mentors, and more—all in one trusted place. Our mission is to empower students with the resources and support they need to succeed in their academic and personal journeys.
        </p>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-orange-500 mb-2">Our Mission</h2>
          <p className="text-gray-700">
            To simplify and enrich the student experience by providing verified, affordable, and accessible services for every stage of the educational journey.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">Meet the Team</h2>
          <p className="text-gray-600">(Team section coming soon!)</p>
        </div>
      </div>
    </div>
  );
} 