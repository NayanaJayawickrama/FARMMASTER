import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FarmMasterHero from '../components/home/FarmMasterHero'
import CompleteFarmingSolution from '../components/home/CompleteFarmingSolution'
import HowFarmMasterWorks from '../components/home/HowFarmMasterWorks'
import GetStartedSection from '../components/home/GetStartedSection'
import Hero from '../components/home/Hero'


function HomePage() {
  return (
    <div className="pt-24">
     <Navbar />
     <FarmMasterHero />
     <CompleteFarmingSolution />
     <HowFarmMasterWorks />
     <Hero />
     <GetStartedSection />
     <Footer /> 
    </div>
  )
}

export default HomePage
