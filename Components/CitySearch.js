import { StyleSheet, View, ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";

export default function CitySearch({onCitySelect}) {
    const[ searchText, setSearchText ] = useState('')
    const [ cities, setCities ] = useState([])
    const[ loading, setLoading ] = useState(false)
    const handleSearchText =(text)=>{
      setSearchText(text)
    }
    const searchCities = async(text)=>{
        if(text.length < 3){
          setCities([])
          return
        }
        setLoading(true)
        try {
          const response = await  fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${text}&limit=10`,{
            headers:{
              'X-RapidAPI-Key': '55cdab37e8msh5ec0cbf3a901877p13889djsn1a96586e38a7',
              'X-RapidAPI-Host':'wft-geo-db.p.rapidapi.com'
            }
          })
  
          const data = await response.json()
          if(data && data.data && Array.isArray(data.data)){
            const cityList = data.data.map(city => city.name)
            setCities(cityList)
          }else{
            setCities([
              'New York','London', 'Tokyo','Paris', 'Sydney', 'Berlin', 'Moscow','Dubai', 'Singapore','Barcelona'
            ].filter(city=>city.toLowerCase().includes(text.toLowerCase())))
          }
        } 
        catch(error){
          console.error('Error searching cities:', error)
          setCities([
            'New York','London', 'Tokyo','Paris', 'Sydney', 'Berlin', 'Moscow','Dubai', 'Singapore','Barcelona'
          ].filter(city=>city.toLowerCase().includes(text.toLowerCase())))
        } finally {
          setLoading(false)
        }
      }
    
      useEffect(()=>{
        const timeOutId =setTimeout(()=>{
          searchCities(searchText)
        }, 500)
  
        return ()=> clearTimeout(timeOutId)
      }, [searchText])
  
      const handleCityPress = (city)=>{
        onCitySelect(city)
        setSearchText('')
        setCities([])
      }
  
    return (
      <View style={styles.container}>
        <Text style ={styles.label}>Enter City Name: </Text>
        <TextInput
        style={styles.input}
        placeholder='Type a city name...'
        value={searchText}
        onChangeText={handleSearchText}
        />
        {
          loading && (
            <ActivityIndicator
              style={styles.loadingIndicator}
              size='small'
              color='black'
            />
          )
        }
        {
        cities.length > 0  && (
          <FlatList
            data={cities}
            keyExtractor={(item,index)=>`city- ${index}`}
            style= {styles.cityList}
            renderItem={({item})=>(
              <TouchableOpacity onPress={()=>
                handleCityPress(item) 
              } style ={styles.cityItem}>
                <Text>{item}</Text>
              </TouchableOpacity>
              )}
          />
        )
        }
      </View>
    )
  }
  
  const styles = StyleSheet.create({
    container: {
      marginBottom: 30,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      fontWeight: 'bold',
      color:'#333',
    },
    input: {
      borderWidth: 3,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      backgroundColor:'#fff',
    },
    loadingIndicator: {
      marginTop: 10
    },
    cityList: {
      marginTop: 8,
      maxHeight: 200,
      borderWidth: 2,
      borderColor: '#ccc',
      borderRadius: 8,
      backgroundColor:'#fff',
    },
    cityItem : {
      padding:12,
      borderBottomWidth: 1,
      borderBottomColor:'#f0f0f0',
    },
  
    cityName: {
      fontSize:16,
    }
  })