import {
  FaFacebookF as FB,
  FaTwitter as FT,
  FaLinkedin as FL,
} from 'react-icons/fa'
import styles from "../styles/Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container_footer}>
        <a
          href="https://www.facebook.com/leonardosimone.digiorgio"
          target="_blank"
          aria-label="Facebook"
        >
          <div>
            <FB className={styles.BigText} />
          </div>
        </a>
        <a
          href="https://twitter.com/simdigiorgio"
          target="_blank"
          aria-label="Twitter"
        >
          <div>
            <FT className={styles.BigText} />
          </div>
        </a>
        <a
          href="https://it.linkedin.com/in/leonardo-simone-digiorgio-091630112"
          target="_blank"
          aria-label="Linkedin"
        >
          <div>
            <FL className={styles.BigText} />
          </div>
        </a>
      </div>

      {/* Copyright */}
      <div className={styles.flex}>
        <div>
          DIGIORGIO LEONARDO
        </div>
        <span>
          ©{new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}

export default Footer
