import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer_container}>
      <div className={styles.footer_content}>
        <div className={styles.footer_left}>
          <h3>Computer Science Department, AMU</h3>
          <p>Project Repository Platform</p>
        </div>

        <div className={styles.footer_right}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a href="mailto:contact@example.com">Contact</a>
        </div>
      </div>

      <div className={styles.footer_bottom}>
        <p>
          © {new Date().getFullYear()} AMU CSE Projects. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
