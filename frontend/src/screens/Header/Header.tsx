"use client";
import { Container } from '@adoxdesarrollos/designsystem-2';
import styles  from './Header.module.css';

const Header = () => (
    <Container customClassNames={styles.headerLine} fullWidth/>
);

export default Header;
