import A4Layout from "../src/components/A4Layout";
import ContactForm from "../src/components/ContactForm";
import TypeWriter from "../src/components/TypeWriter";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#e8e8e8]">
      <A4Layout>
        <Header />
        <div className="mt-24">
          <div className="text-xl text-black">
            <TypeWriter text="Welcome to Frontend World by Rimante" />
          </div>
          <ContactForm />
        </div>
        <Footer />
      </A4Layout>
    </div>
  );
}
