import React, {useState, useContext, useEffect, useRef} from 'react';

import { useIsFocused } from '@react-navigation/native';

import {View, Text, Button, Modal, Image, ScrollView, Dimensions} from 'react-native';

import {Octicons, Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import { Formik } from 'formik';

import {Colors, Links} from '../../Constants';

import AsyncStorage from '@react-native-async-storage/async-storage';

import NumberPlease from "digicard-react-native-number-please";

import axios from 'axios';

import * as yup from 'yup';

import {recipeContext} from '../../Context/recipeContext';

import {getToken} from '../../helpers';

import {StyledContainer, 
        InnerContainer,
        StyledFormArea,
        LeftIcon,
        StyledTextLabel,
        StyledTextInput,
        ButtonText,
        StyledButton,
} from '../../components/styles.js';

const Create = ({navigation, route} : Props) => {

    const isFocused = useIsFocused();

    const {recipe, setRecipe} = useContext(recipeContext);

    const initialRecipe = useRef(recipe);

    const time = [{id: "hours", label: "H", min: 0, max: 24 }, {id: "minutes", label: "M", min: 0, max: 59},{id: "seconds", label: "S", min: 0, max: 59},];

    const initialTime = { hours: 0, minutes: 0, seconds: 0 };

    const [PrepTime, SetPrepTime] = useState(initialTime);

    const [CookTime, SetCookTime] = useState(initialTime);

    const [ready, setReady] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const windowWidth = Dimensions.get('window').width;
    
    const windowHeight = Dimensions.get('window').height;

    useEffect(() => {
      (async () => {
      if(route.params.mode == "Edit" && !route.params.recipe){
        const url = Links.recipe;
        var id = await AsyncStorage.getItem('id');
        id = JSON.parse(id);
        token = await getToken();
        var headers = {
            "Content-Type": "application/json",
            'authorization' : `Bearer ${token}`};
        var params = {
            id: id,
            name: route.params.name,
        }
        axios.get(url, 
        {
            headers: headers,
            params: params,
        })
        .then((response) => {
          token = null;
            setRecipe(response.data.recipe);
        }).catch((err) => {
            token = null;
            console.log(err);
            navigation.navigate("Logout");
        })
      }else if(route.params.recipe){
        setRecipe(route.params.recipe);
      }else{
        setReady(true);
      }

    })()
  },[]);

  useEffect(() => {
    if(route.params?.image){
      if(recipe.images && recipe.images.length < 3 && route.params.image || !recipe.hasOwnProperty('images')){
        let imageSet = recipe.images ? recipe.images : [];
        imageSet.push(route.params.image); 
        setRecipe({...recipe, 
          images: imageSet,
          })
      }
      delete route.params?.image;

    }
  },[isFocused])

    useEffect(() => {
      if((route.params.mode == "Edit") && (JSON.stringify(initialRecipe.current) != JSON.stringify(recipe)) && isFocused){
        setReady(true);
        SetCookTime(recipe.cook);
        SetPrepTime(recipe.prep);
      }

      if(!recipe.hasOwnProperty('images') || recipe.images.length == 0){
        setModalVisible(false);
      }

    },[recipe])

    const handleCreate = (values) => {

      if(route.params.mode == "Create"){
      setRecipe({...recipe, 
      title: values.name,
      prep: PrepTime,
      cook: CookTime,
      servings: values.serve,
      images: (recipe.images) ? recipe.images : [],
      steps: null,
      });
      }else{
      setRecipe({...recipe, 
        title: values.name,
        prep: PrepTime,
        cook: CookTime,
        servings: values.serve,
        images: (recipe.images) ? recipe.images : [],
        });
      }

      if(route.params.mode == "Edit"){
        navigation.navigate("CreateStack", {screen: 'IngredientStep', params: {mode: route.params.mode, name: route.params.name}});
      }else{
        navigation.navigate("CreateStack", {screen: 'IngredientStep', params: {mode: route.params.mode}});
      }
    }       


    const ImageContainer = ({item} : Props) => {

      return(
        <View style={{
          height: '100%',
        }}>
        <Image
          style={{
            height: '90%',
            width: windowWidth,
          }}
          source={{ uri: item }}
        />
         <Button 
         onPress={() => {
           let uriSet = [];
           for(var uri of recipe.images){
             if(uri != item){
               uriSet.push(uri);
             }
           }
           setRecipe({...recipe, 
             images: uriSet,
           })
         }}
         title="Remove image"
         />
         </View>
      )
    }

    return (   
        <StyledContainer>
          <Modal
            animationType="fade"
            transparent={false}
            visible={modalVisible}
          >
          <ScrollView
              style={{ flex: 1 }}
              pagingEnabled={true}
              horizontal={true}
              scrollEventThrottle={16}
          >
              {(recipe.images?.length > 0) ? (recipe.images.map((item, index) => (
                         <ImageContainer item={item} key={index} />
                    ))
                    ): <Text>No results found!</Text>}
              </ScrollView>
          <Button style={{
                bottom: 0,
              }}
              onPress={() => setModalVisible(false)} title="close"/>
          </Modal>
            <InnerContainer>
                {(ready) ? 
                (<Formik
                initialValues={{name: recipe.title || '', serve: recipe.servings || ''}}
                onSubmit={(values) => handleCreate(values)}
                validationSchema={nameValidate}
                >
                {({handleChange, handleBlur, handleSubmit, values, touched, errors}) => (
                    <StyledFormArea style={{
                      flex: 1,
                      justifyContent: 'space-between',
                    }}>
                        <MyTextInput
                        label="Set the name of your delicious recipe!"
                        font={<FontAwesome name="book" size={30} color={Colors.brand} />}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        value={values.name}
                        placeholderTextColor={Colors.darklight}
                        />
                        {((errors.name && touched.name) && <Text style={{ fontSize: 10, color: 'red' }}>{errors.name}</Text>)}
                        <StyledTextLabel>Prep Time</StyledTextLabel>
                        <NumberPlease
                        pickers={time}
                        values={PrepTime}
                        onChange={(timeValues) => SetPrepTime(timeValues)}
                        />
                        <StyledTextLabel>Cook Time</StyledTextLabel>
                        <NumberPlease
                        pickers={time}
                        values={CookTime}
                        onChange={(timeValues) => SetCookTime(timeValues)}
                        />
                        <MyTextInput
                        label="Servings"
                        font={<FontAwesome name="spoon" size={30} color={Colors.brand} />}
                        onChangeText={handleChange('serve')}
                        onBlur={handleBlur('serve')}
                        value={values.serve}
                        keyboardType='numeric'
                        placeholderTextColor={Colors.darklight}
                        />
                      <Button  
                      onPress={() => {
                        if(!recipe.hasOwnProperty('images') || recipe.images?.length < 3){
                          navigation.navigate("CreateStack", {screen: "CameraModal", params: {mode: route.params.mode}})
                        }else{
                          alert("Can only have 3 photos.");
                        }
                          }
                          }
                              title="Add Image"
                      />

                      <Button
                      onPress={() => {
                        if(recipe.hasOwnProperty('images') && recipe.images.length > 0){
                          setModalVisible(true);
                        }else{
                          alert("No images added");
                        }
                      }
                      }
                      title="Show Images"
                      />
                      <StyledButton
                      onPress={handleSubmit}
                      >
                        <ButtonText>List Ingredients</ButtonText>
                      </StyledButton>
                    </StyledFormArea>
                )}
                </Formik>)
                : 
                (<View> 
                  <Text>
                  Loading Screens...
                  </Text>
                </View>)
                }
            </InnerContainer>
        </StyledContainer> 
    )
}

const nameValidate = yup.object().shape({
  name: yup
    .string()
    .required('name required'),
})

const MyTextInput = ({label, font, ...props} : Props) => {
  return  (
    <View>
      <LeftIcon>
        {font}
      </LeftIcon>
      <StyledTextLabel>{label}</StyledTextLabel>
      <StyledTextInput {...props}/>
    </View> 
  )
}

export default Create;