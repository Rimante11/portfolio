import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import styles from "./page.module.css";
import HomeSection from "../src/components/sections/HomeSection";
import AboutSection from "../src/components/sections/AboutSection";
import ProjectsSection from "../src/components/sections/ProjectsSection";
import ContactSection from "../src/components/sections/ContactSection";
import LandingSplashGate from "./LandingSplashGate";

export default function Home() {

  const today = new Date();
  const weekday = today.toLocaleDateString('en-US', {
    weekday: 'long'
  });
  const month = today.toLocaleDateString('en-US', {
    month: 'long'
  });

  const formattedDate = today.toLocaleDateString('sv-SE')
    .replaceAll('-', '/');
  
  const getTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <LandingSplashGate>
      <div className="app-page">
        <div className="app-header-wrap">
          <div className="app-content-shell">
            <Header />
          </div>
        </div>

        <main className="app-main">
          <div className="app-content-shell">
            <HomeSection
              month={month}
              weekday={weekday}
              formattedDate={formattedDate}
              time={getTime()}
              styles={styles}
            />
            <AboutSection styles={styles} />
            <ProjectsSection />
            <ContactSection styles={styles} />

            {/* <ContactForm />  */}
          </div>
        </main>

        {/* <Footer /> */}
      </div>
    </LandingSplashGate>
  );
}
