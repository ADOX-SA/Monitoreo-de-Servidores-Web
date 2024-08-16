"use client";
import { Container } from '@adoxdesarrollos/designsystem-2';
import styles  from './Footer.module.css';

function Footer() {
  return (
    <Container customClassNames={styles.footerLine} fullWidth/>
  )
}

export default Footer