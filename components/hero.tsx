export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-orange-50 via-white to-white py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="inline-block px-4 py-2 bg-orange-100 rounded-full mb-2">
            <p className="text-xs sm:text-sm font-semibold text-orange-700 uppercase tracking-wide">
              Welcome to Elegance
            </p>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight">
            Celebrate Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Cultural Grace
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Discover our exquisite collection of premium sarees and chudithars, handpicked for the modern woman who
            appreciates timeless elegance
          </p>

          <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <button className="w-full sm:w-auto px-8 py-3 sm:py-4 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl active:scale-95">
              Shop Now
            </button>
            <button className="w-full sm:w-auto px-8 py-3 sm:py-4 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold rounded-lg transition-all">
              View Collection
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
