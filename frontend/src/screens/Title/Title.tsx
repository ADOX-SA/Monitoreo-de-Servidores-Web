"use client";
import { Container, Heading } from "@adoxdesarrollos/designsystem-2";
import styles from './Title.module.css';

function Title() {
  return (
    <Container fullWidth>
      <Heading align="center" size="large" className={styles.title}>Monitoreo de Desarrollo</Heading>
    </Container>
  )
};

export default Title;