"use client";
import { Container, Heading } from "@adoxdesarrollos/designsystem-2";
import styles from './Title.module.css';

function Title() {
  return (
      <Heading align="center" className={styles.title}>Monitoreo de Desarrollo</Heading>
  )
};

export default Title;