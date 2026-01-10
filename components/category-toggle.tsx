"use client"

interface CategoryToggleProps {
  category: string
  setCategory: (category: string) => void
}

export default function CategoryToggle({ category, setCategory }: CategoryToggleProps) {
  return (
    <section className="w-full bg-white px-4 py-6 sm:py-8 border-b border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-4">
          <h3 className="text-center text-sm uppercase tracking-widest text-gray-500 font-semibold">
            Shop By Category
          </h3>

          <div className="flex gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => setCategory("saree")}
              className={`px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base transition-all duration-300 transform ${
                category === "saree"
                  ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>👗</span> Sarees
              </span>
            </button>
            <button
              onClick={() => setCategory("chudithar")}
              className={`px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base transition-all duration-300 transform ${
                category === "chudithar"
                  ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>✨</span> Chudithars
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
