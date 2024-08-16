"use client";
import React from 'react';
import styles from './Initiation.module.css';
import { Dashboard } from '../Dashboard';
import { Header } from '../Header';
import { Footer } from '../Footer';


function Initiation() {
  return (
    <div>
        <Header/>
        <Dashboard/>
        <Footer/>
    </div>
  )
}

export default Initiation