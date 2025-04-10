import { StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import WeatherInfo from "./components/WeatherInfo";
import CitySearch from "./components/CitySearch";

const API_KEY ='b89e1c25a017e0b7f26b12d8487455b8'

export default function Home() {
  const [weather, setWeather]= useState(null)
  const [loading, setLoading]= useState(false)

  const handleCitySelect = async(city)=>{
    setLoading(true)
    try{
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)

      if(!response.ok) {
        Alert.alert('City not found', `Could not find weather for ${city}`)
        setLoading(false)
        return
      }
      const data = await response.json()
      setWeather(data)
    }
    catch(error){
      Alert.alert('Error', 'could not load weather data. Please try again')

    }
    finally {
      setLoading(false)
    }
  }
  return (
    <View style={styles.container}>
      <CitySearch onCitySelect={handleCitySelect}/>
      {
        loading &&(
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='black'/>
            <Text style={styles.loadingText}>Loading Weather Data...</Text>
          </View>
        )
      }
      {
        weather && !loading &&(
          <WeatherInfo weatherData ={weather}/>
        )
      } 
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
})























































