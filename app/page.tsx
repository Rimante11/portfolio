import A4Layout from "../src/components/A4Layout";
import ContactForm from "../src/components/ContactForm";
import TypeWriter from "../src/components/TypeWriter";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";

export default function Home() {
  return (
    <div style={{
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#e8e8e8'
    }}>
      <A4Layout>
        <Header />
        <div style={{ marginTop: '3rem' }}>
          <div style={{ fontSize: '1.25rem', color: 'black', marginTop: '3rem', paddingTop: '1rem' }}>
            <TypeWriter text="Welcome to Frontend World by Rimante" />
          </div>
          <ContactForm />
        </div>
        <Footer />
      </A4Layout>
    </div>
  );
}
