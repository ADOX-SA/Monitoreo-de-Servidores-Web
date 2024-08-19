"use client";
import React from 'react';
import styles from './Initiation.module.css';
import { Dashboard } from '../Dashboard';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Title } from '../Title';
import { Spacer } from '@adoxdesarrollos/designsystem-2';


function Initiation() {
  return (
    <div>
        <Header/>
        <Spacer/>
        <Title/>
        <Dashboard/>
        <Footer/>
    </div>
  )
}

export default Initiation