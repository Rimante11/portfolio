"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import BookMeetModal from './BookMeetModal';

interface HomeSectionProps {
  month: string;
  weekday: string;
  formattedDate: string;
  time: string;
  styles: Record<string, string>;
}

const HomeSection = ({ month, weekday, formattedDate, time, styles }: HomeSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  console.log("MOnth:", month);

  useEffect(() => {
    if (!showSuccessModal) return;

    const timer = setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showSuccessModal]);

  return (
    <section id="home" className={styles.mainContainer}>
      <div className={styles.presentationWrap}>
        <div className={styles.introTextWrap}>
          <h4 className={styles.introTitle}>Hi there! Welcome to my digital world</h4>
          <h2 className={styles.introHeading}>I<Image
              src="/heart_icon.png"
              alt="Heart"
              width={10}
              height={10}
              className={styles.iconHeart}
            />m Rimante</h2>
          <p className={styles.introDescription}>
            I'm a frontend web developer dedicated to turning ideas into creative solutions. <br />
            I specialize in creating seamless and intuitive user experiences.<br />
            My approach focuses on creating scalable, high-performing solutions tailored to both user needs and business objectives.<br />
            By prioritizing performance, accessibility, and responsiveness, I strive to deliver experiences that not only engage users but also drive tangible results.
          </p>
        </div>
        <div className={styles.dateWrap}>
          <div className={styles.timeWatch}>{time}</div>
          <div className={styles.dateInfo}>
            <h4 className={styles.monthGreeting}>
              <span className={styles.helloWord}>Hello</span> {month}
            </h4>
            {/* <p className={styles.weekday}>{weekday}</p> */}
            <p className={styles.formattedDate}>{formattedDate}</p>
          </div>
        </div>
      </div>
      <div className={styles.sectionButtonWrap}>
        <button
          type="button"
          className={styles.bookMeetButton}
          onClick={() => setIsModalOpen(true)}
        >
          <span className={styles.buttonIconWrap}>
            <Image
              src="/calendar_icon.png"
              alt="Calendar"
              width={20}
              height={20}
              className={styles.iconDefault}
            />
            <Image
              src="/white_calendar_icon.png"
              alt="Calendar"
              width={20}
              height={20}
              className={styles.iconHover}
            />
          </span>
          Book a Meet
        </button>
        <div className={styles.scrollExploreWrap}>
        <p className={styles.scrollExploreText}>Scroll to explore</p>
        <span className={styles.scrollExploreArrow}>↓</span>
      </div>

      </div>


      <BookMeetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setShowSuccessModal(true)}
      />

      {showSuccessModal && (
        <div className={styles.bookingSuccessOverlay}>
          <div className={styles.bookingSuccessModal}>
            <div className={styles.bookingSuccessIcon}>✓</div>
            <p className={styles.bookingSuccessTitle}>Meeting booked!</p>
            <p className={styles.bookingSuccessText}>Check your email for details</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeSection;