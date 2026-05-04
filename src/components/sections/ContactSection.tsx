interface ContactSectionProps {
  styles: Record<string, string>;
}

const ContactSection = ({ styles }: ContactSectionProps) => {
  return (
    <section id="contact" className={styles.contentSection}>
      <h3 className={styles.sectionTitle}>Contact Information</h3>
      <p className={styles.sectionText}>
        If you have any questions or would like to work with me, please feel free to contact me.
      </p>

      <div className={styles.contactColumns}>
        <div className={styles.contactColumn}>
          <p className={styles.contactLabel}>Phone</p>
          <p className={styles.contactValue}>On request</p>
        </div>

        <div className={styles.contactColumn}>
          <p className={styles.contactLabel}>Email</p>
          <p className={styles.contactValue}>
            <a
              href="mailto:storulike@gmail.com"
              className={styles.contactActionLink}
              aria-label="Email me at storulike@gmail.com"
            >
              <svg
                className={styles.contactActionIcon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4 7.5C4 6.67157 4.67157 6 5.5 6H18.5C19.3284 6 20 6.67157 20 7.5V16.5C20 17.3284 19.3284 18 18.5 18H5.5C4.67157 18 4 17.3284 4 16.5V7.5Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M4.5 7L11.1 12.06C11.6321 12.4681 12.3679 12.4681 12.9 12.06L19.5 7"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
              Email me
            </a>
          </p>
        </div>

        <div className={styles.contactColumn}>
          <p className={styles.contactLabel}>LinkedIn</p>
          <p className={styles.contactValue}>
            <a
              href="https://www.linkedin.com/in/rimante-awdisson"
              target="_blank"
              rel="noreferrer"
            >
              /rimante-awdisson
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;