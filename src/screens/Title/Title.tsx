"use client";
import { Container, Heading, Spacer } from "@adoxdesarrollos/designsystem-2";
import styles from './Title.module.css';

function Title() {
  return (
    <Container customClassNames={styles.color}>
      <Spacer/>
      <Heading align="center" className={styles.title}>Monitoreo de Desarrollo</Heading>
    </Container>
    );
};

export default Title;