import A4Layout from "../../src/components/A4Layout";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#e8e8e8]">
      <A4Layout>
        <Header />
        <div className="mt-24 pl-8">
          <p className="text-1xl font-bold mb-4 font-['Inconsolata'] border-b border-red-500 w-40 relative">
            <span className="relative z-10 text-gray-800">Contact Information</span>
            <span className="absolute inset-0 bg-red-200 opacity-60 transform -skew-x-12 rounded-lg"
              style={{
                background: 'linear-gradient(45deg, rgba(239, 68, 68, 0.2), rgba(248, 113, 113, 0.3))',
                filter: 'blur(1px)',
                transform: 'skew(-12deg) scaleY(1.2)',
                borderRadius: '15px 5px 15px 5px'
              }}>
            </span>
          </p>
          <p className="text-1xl mb-28 font-['Inconsolata']">If you have any questions or would like to work with me, please feel free to contact me.</p>
          <div className="grid grid-cols-3 gap-x-8">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-['Inconsolata'] font-semibold">Phone:</p>
              <p className="text-lg font-['Inconsolata']">On request</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-['Inconsolata'] font-semibold">Email:</p>
              <p className="text-lg font-['Inconsolata']">rimante@gmail.com</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-['Inconsolata'] font-semibold">Linkedin:</p>
              <p className="text-lg font-['Inconsolata']">
                <a
                  href="https://www.linkedin.com/in/rimante-awdisson-96b15540/"
                  className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  /rimante-awdisson
                </a>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </A4Layout>
    </div>
  );
}