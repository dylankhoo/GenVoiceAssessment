import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function WriteUp() {
  return (
    <div
      className={
        "mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-gray-200"
      }
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6">
        <Avatar className="h-40 w-40 border-4 border-white shadow-md">
          <AvatarImage src="/Dylan Profile.jpg" alt="Dylan Khoo" />
          <AvatarFallback className="bg-blue-100 text-blue-800 text-2xl font-bold">
            DK
          </AvatarFallback>
        </Avatar>

        <div className="text-center sm:text-left w-400">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Dylan Khoo</h2>
          <p className="text-gray-600 mb-4">
            Computer Engineering Student @ NUS
          </p>
          <p className="text-gray-700 py-3">
            First Class Honours student with a strong foundation in software
            development and embedded systems. With interest in both software and
            hardware, Dylan has worked on a diverse range of projects.
          </p>
          <p className="text-gray-700 py-3">
            Recent work includes research on autonomous drone navigation for the
            Singapore Amazing Flying Machine Competition, as well as building
            frontend features for Treeckle @ CAPT, the Residential College's
            Booking Management website.
          </p>
          <p className="text-gray-700 py-3">
            In his freetime, Dylan also enjoys frisbee and gaming.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Languages</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/80 text-gray-700 rounded-full text-sm border border-gray-200">
                Java
              </span>
              <span className="px-3 py-1 bg-white/80 text-gray-700 rounded-full text-sm border border-gray-200">
                Python
              </span>
              <span className="px-3 py-1 bg-white/80 text-gray-700 rounded-full text-sm border border-gray-200">
                C/C++
              </span>
              <span className="px-3 py-1 bg-white/80 text-gray-700 rounded-full text-sm border border-gray-200">
                JavaScript
              </span>
              <span className="px-3 py-1 bg-white/80 text-gray-700 rounded-full text-sm border border-gray-200">
                HTML/CSS
              </span>
              <span className="px-3 py-1 bg-white/80 text-gray-700 rounded-full text-sm border border-gray-200">
                SQL
              </span>
            </div>
          </div>

          <div className="w-full space-y-2">
            <h3 className="font-semibold text-gray-700">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/80 text-gray-700 rounded-full text-sm border border-gray-200">
                React
              </span>
              <span className="px-3 py-1 bg-white/80 text-gray-700 rounded-full text-sm border border-gray-200">
                Node.js
              </span>
              <span className="px-3 py-1 bg-white/80 text-gray-700 rounded-full text-sm border border-gray-200">
                Next.js
              </span>
              <span className="px-3 py-1 bg-white/80 text-gray-700 rounded-full text-sm border border-gray-200">
                Django
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
