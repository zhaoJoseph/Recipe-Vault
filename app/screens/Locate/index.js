import React, {useState, useEffect} from 'react';

import {View, Modal, Button, Dimensions, Text, ScrollView, ActivityIndicator} from 'react-native';

import {Octicons } from '@expo/vector-icons';

import {Colors, Links} from '../../Constants';

import {Formik} from 'formik';

import axios from 'axios';

import SelectBox from 'react-native-multi-selectbox';

import { xorBy } from 'lodash';

import * as Location from 'expo-location';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useToast } from "react-native-toast-notifications";

import {getToken} from '../../helpers';

import { 
    StyledContainer, 
    StyledFlatList,
    InnerContainer, 
    IngredientContainer,
    PageLogo, 
    PageTitle,
    PageSubTitle,
    StyledFormArea,
    StyledSearchBar,
    LeftIcon,
    StyledInputArea,
    StyledTextInput, 
    StyledButton,
    ButtonText,
    StyledTextLabel,
    RightIcon,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent,
  } from '../../components/styles.js';

  const Locate = ({navigation} : Props) => {

    const [ingredients, setIngredients] = useState([{item: 'all', id: 'all'}]);

    const [results, setResults] = useState([]);

    const [filteredResults, setFilteredResults] = useState([]);

    const [loading, setLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const listToast = useToast();

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [loadingResults, setLoadingResults] = useState(false);

    const [values, setValues] = useState([]);
    
    let text = 'Waiting..';

    const url = Links.locations;

    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
          let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 10000});
          setLocation(location);
      })();
    }, []);

    if (errorMsg) {
      text = errorMsg;
      listToast.show(text);
    } else if (location) {
      text = JSON.stringify(location);
    }

    useEffect(() => {    
      setLoading(false);
    },[ingredients])

    useEffect(() => {    
      setLoadingResults(false);
    },[filteredResults])

    useEffect(() => {
      setFilteredResults(results);
    },[results])

    useEffect(() => {
      if(values.length == 0){
        setFilteredResults(results);
      }else{
        var filtered = [];  
        for(var place of results){
          if(values.includes("all") && place.tags.length == ingredients.length){
            filtered.push(place);
          }else if(values.some(x => place.tags.includes(x.item))){
            filtered.push(place);
          }
        }
        setFilteredResults(filtered);
      } 
    },[values])

    function onMultiChange() {
      return (item) => {
        setValues(xorBy(values, [item], 'id'));
      };
    }

    const PlaceContainer = ({item} : Props) => {

      return(
        <View style={{
          margin: 5,
          top: 0,
        }}>  

          <View style={{
            position: 'relative',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
          }}>
          <Text style={{
            fontWeight: 'bold',
          }}>{item.name}</Text><Text>{item.distance} km</Text>
          </View>
          <View style={{
            flex: 1,
            flexWrap: 'wrap',
            flexDirection: 'row',
          }}>
          <Text numberOfLines={1}>{item.formatted_address}</Text>
          {(item.opening_hours && item.opening_hours.open_now)&&<Text style={{
            borderWidth: 1,
            borderColor: 'blue',
            borderRadius: 1,
            color: `${Colors.brand}`,
          }}>Open Now</Text>}
          </View>
          <Text style={{
            right: 0,
          }}>{item.rating} / 5 </Text>
        </View>
      )

    }
 
    const getResults = () =>{
      (async () => {
      var id = await AsyncStorage.getItem('id');
      token = await getToken();
      var headers = {
          "Content-Type": "application/json",
          'authorization' : `Bearer ${token}`};
      var locat = JSON.parse(text);
      var params = {
        id: id.id,
        requests: JSON.stringify(ingredients),
        location: JSON.stringify({lat: locat.coords.latitude, lng: locat.coords.longitude}),
      }
      axios.get(url, 
        {
          headers: headers,
          params: params,
        }).then((res) => {  
        token = null;
        setResults(JSON.parse(res.data.results));
        setModalVisible(!modalVisible);
      }).catch((err) => {
        token = null;
        console.log(err);
        listToast.show("Maps API is not working try again later.");
        navigation.navigate('Home');
      })
    })();
    }

    const LoadingBox = () => {
      return (
          <View style={{
            alignItems: 'center',
            position: 'absolute',
            zIndex: 5,
            top: Dimensions.get('window').height / 2,
            width: Dimensions.get('window').width,
          }}>
            <View style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: Colors.black,
              backgroundColor: Colors.tint,
            }}>
            <ActivityIndicator color={Colors.Brand} size="large"/>
            <Text> Retrieving Results... </Text>
            </View>
          </View>
      )
    }


    return (
        <StyledContainer>
          <AddIngredient
          icon="pencil"
          list={ingredients}
          setList={setIngredients}
          loading={loading}
          setLoading={setLoading}
          loadingResults={loadingResults}
          />
          <Modal
          animationType="fade"
          transparent={false}
          visible={modalVisible}
          >
          <SelectBox
            label="Select items"
            options={ingredients}
            selectedValues={values}
            setSelectedValues={setValues}
            onMultiSelect={onMultiChange()}
            onTapClose={onMultiChange()}
            isMulti
          />
            <View style={{
              flex: 1, 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: 30,
            }}> 
              <ScrollView>
              {(results?.length > 0 && !loading) ? (filteredResults.map((item, index) => (
                         <PlaceContainer item={item} key={index} />
                    ))
                    ): <Text>No results found!</Text>}
              </ScrollView>
            </View>
            <Button style={{
                bottom: 0,
              }}
              onPress={() => setModalVisible(!modalVisible)} title="close"/>
          </Modal>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            marginTop: 70,
            marginBottom: 50,
          }}>
          <ScrollView>
          {(ingredients?.length > 0 && !loading) ? (ingredients.map(({item, id}) => (
                         (item != 'all') ? 
                         (<IngredientContainer>
                         <Text>{item}</Text>
                         <Button title="-" onPress={() => setIngredients(ingredients.filter(obj => obj.item != item))}></Button>
                         </IngredientContainer>
                         ) : null
                    ))
                    ): null}
          </ScrollView>
            </View>
            {(loadingResults) ? 
              (<LoadingBox />) 
              :
              null}
            <View style={{
                flex: 1,
                position: 'absolute',
                bottom: 0,
                alignSelf: 'center',
                width: Dimensions.get('window').width,
              }}>
              <StyledButton style={{
                alignSelf: 'center',
                bottom: 0,
              }}
              disabled={loadingResults}
              onPress={async () => {if(text != errorMsg)
                  {

                    if(ingredients.length > 1){
                      setLoadingResults(true);
                      getResults();
                    }else{
                      listToast.show("Nothing to query.");
                    }
                  }else{
                    listToast.show(text);
                    }}}
              >
              <ButtonText>Locate Ingredients</ButtonText>
                </StyledButton>
            </View>
        </StyledContainer>
    )
  }

  const AddIngredient = ({icon, list, setList, setLoading, loadingResults, ...props} : Props) => {

    const [ingStr, setIngStr] = useState("");

    const AddIngredientItem = ({list, setList, setLoading}) => {
      if(ingStr){
        if(!list.some(({item, id})=> ingStr == item)){
          setLoading(true);
          setList([...list, {item: ingStr, id: ingStr}]);
        }
      }
    } 

    return (
        <View>
          <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={Colors.black} />
            </LeftIcon>
              <StyledSearchBar type="text" onChangeText={text => setIngStr(text)} style={{
                top: 10,
                borderWidth: 1,
                borderColor: Colors.black,
              }}

              {...props}/>
          </View>
          <View style={{
            top: 10,
          }}>
              <StyledButton style={{
                position: 'absolute',
                alignSelf: 'center',
              }}
              onPress={() => AddIngredientItem({list, setList, setLoading})}
              disabled={loadingResults}
              >
                <ButtonText>ADD</ButtonText>
                  </StyledButton>
          </View>
        </View>
    )
}

  export default Locate;