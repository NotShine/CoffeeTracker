import React from 'react'
import Layout from './components/Layout';
import CoffeeForm from './components/CoffeeForm';
import Stats from './components/Stats';
import History from './components/History';
import Hero from './components/Hero'
import { useAuth } from './context/AuthContext';

const App = () => {

  const {globalUser, globalData, isLoading} = useAuth()
  const isAuthenticated = globalUser;
  const isData = globalData && !!Object.keys(globalData || {}).length


  const authenticatedContent = (
    <>
      <Stats/>
      <History/>
    </>
  )

  return (
   <Layout>
    <Hero/> 
  
    { <CoffeeForm isAuthenticated={isAuthenticated}/> }
    { (isAuthenticated && isLoading) && (<p>Loading data...</p>) }
    {(isAuthenticated && isData) && (authenticatedContent)} {/* if isAuthenticated is true then render the relevant content*/}
   
   </Layout>

   
  )
}

export default App