export default function About() {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold">About Our Platform</h1>
              </div>
              <div className="mt-4">
                <p className="text-gray-600">
                  Our information publishing platform is designed to connect communities and share important information. 
                  We believe in the power of local knowledge and the importance of staying informed about what's happening in your area.
                </p>
                <p className="mt-4 text-gray-600">
                  Whether it's a local event, an emergency alert, or just something interesting happening in your neighborhood, 
                  our platform makes it easy to share and discover information that matters to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }