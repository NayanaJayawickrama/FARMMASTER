import React from 'react'
import Navbar from '../components/Navbar'
import AboutHero from '../components/about/AboutHero'
import AboutDetails from '../components/about/AboutDetails'
import AboutFooter from '../components/about/AboutFooter'

function About() {
  return (
    <div className="pt-24">
      <Navbar />
      <AboutHero />
      <AboutDetails />
      <AboutFooter />
    </div>
  )
}

export default About
