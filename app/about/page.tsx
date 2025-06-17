import A4Layout from "../../src/components/A4Layout";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import Image from 'next/image';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#e8e8e8]">
      <A4Layout>
        <Header />
        <div className="flex flex-col gap-6 p-8 pt-26">
          <h1 className="text-4xl font-bold text-left text-gray-800">About Me</h1>
          <div className="flex items-start gap-8">
            <Image
              src="/me_img.jpeg"
              alt="Profile Picture"
              width={200}
              height={200}
              className="shadow-lg pt-[8px]"
            />
            <p className="font-['Inconsolata'] text-4xl text-lg text-justify">
              Welcome to my portfolio! I am Rimante a frontend/fullstack developer passionate about creating beautiful and functional web experiences.
              <br></br>
              <br></br>
              I like clean, aesthetic interfaces that are not only visually distinct but also intuitive and safe for users to navigate. I focus on creating well-structured layouts that balance creativity with usability, guided by solid UX/UI principles. Skill development is a key part of my journey — I am always learning, improving, and pushing myself to build better, smarter web solutions.
            </p>

          </div>

        </div>
        <Footer />
      </A4Layout>
    </div>
  );
}