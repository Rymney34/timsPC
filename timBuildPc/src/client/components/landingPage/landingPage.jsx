import Button from "../Tools/button/button.jsx";
import { Cpu, Zap, Shield } from "lucide-react";

function LandingPage() {
  return (
    <div>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-black"></div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Build Your Dream PC
          </h1>

          <p className="text-xl text-zinc-400 mb-8">
            Expert custom PC builds tailored to your needs. Gaming, professional
            workstations, or everyday computing - we deliver performance and quality.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-700 text-white hover:bg-zinc-900"
            >
              View Builds
            </Button>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl mb-2">Premium Components</h3>
              <p className="text-zinc-400">
                Only the best parts from trusted manufacturers
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl mb-2">Expert Assembly</h3>
              <p className="text-zinc-400">
                Professional cable management and testing
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl mb-2">Warranty & Support</h3>
              <p className="text-zinc-400">
                1-year warranty and lifetime technical support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
