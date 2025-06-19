import A4Layout from "../../src/components/A4Layout";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";

export default function Contact() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#e8e8e8'
    }}>
      <A4Layout>
        <Header />
        <div style={{
          marginTop: '6rem',
          paddingLeft: '2rem',
          paddingRight: '2rem'
        }}>
          <div style={{
            position: 'relative',
            display: 'inline-block',
            marginBottom: '1rem'
          }}>
            <span style={{
              position: 'absolute',
              inset: '0',
              background: 'linear-gradient(45deg, rgba(239, 68, 68, 0.2), rgba(248, 113, 113, 0.3))',
              filter: 'blur(1px)',
              transform: 'skew(-12deg) scaleY(1.2)',
              borderRadius: '15px 5px 15px 5px',
              opacity: '0.6'
            }}></span>
            <p style={{
              fontSize: '1.0rem',
              fontWeight: 'bold',
              fontFamily: 'Inconsolata, monospace',
              borderBottom: '2px solid #ef4444',
              width: '280px',
              paddingBottom: '0.5rem',
              position: 'relative',
              zIndex: '10',
              color: '#374151'
            }}>
              Contact Information
            </p>
          </div>

          <p style={{
            fontSize: '1.125rem',
            marginBottom: '3rem',
            fontFamily: 'Inconsolata, monospace',
            color: '#374151',
            lineHeight: '1.6'
          }}>
            If you have any questions or would like to work with me, please feel free to contact me.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <p style={{
                fontSize: '1.125rem',
                fontFamily: 'Inconsolata, monospace',
                fontWeight: '600',
                color: '#374151'
              }}>
                Phone:
              </p>
              <p style={{
                fontSize: '1.125rem',
                fontFamily: 'Inconsolata, monospace',
                color: '#374151'
              }}>
                On request
              </p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <p style={{
                fontSize: '1.125rem',
                fontFamily: 'Inconsolata, monospace',
                fontWeight: '600',
                color: '#374151'
              }}>
                Email:
              </p>
              <p style={{
                fontSize: '1.125rem',
                fontFamily: 'Inconsolata, monospace',
                color: '#374151'
              }}>
                rimante@gmail.com
              </p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <p style={{
                fontSize: '1.125rem',
                fontFamily: 'Inconsolata, monospace',
                fontWeight: '600',
                color: '#374151'
              }}>
                LinkedIn:
              </p>
              <p style={{
                fontSize: '1.125rem',
                fontFamily: 'Inconsolata, monospace'
              }}>
                <a
                  href="https://www.linkedin.com/in/rimante-awdisson-96b15540/"
                  style={{
                    color: '#3b82f6',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-link"
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