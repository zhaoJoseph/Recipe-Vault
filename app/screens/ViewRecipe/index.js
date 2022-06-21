import React , {useEffect, useState} from 'react';

import {Text, View, Button, ScrollView, Image, Dimensions} from 'react-native';

import {Formik} from 'formik';

import {Octicons, Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import {Colors, Links} from '../../Constants';

import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {getToken} from '../../helpers';

import {StyledContainer, 
        InnerContainer,
        StyledFormArea,
        LeftIcon,
        StyledTextLabel,
        StyledTextInput,
        ButtonText,
        StyledButton,
        StyledFlatList,
        IngredientContainer,
        PageTitle,
        PageSubTitle,
} from '../../components/styles.js';


function ViewRecipe({ navigation, route } : Props) {

    const [step, incrementStep] = useState(1);

    const [isLoading, setLoading] = useState(true);

    const [recipe, setRecipe] = useState({});

    const [ingredients, setIngredients] = useState([]);

    const [recipeLen, setRecipeLen] = useState(0);

    const windowWidth = Dimensions.get('window').width;

    useEffect(() => {
        (async () => {
        const url = Links.recipe;
        let token = await getToken();
        var headers = {
          "Content-Type": "application/json",
          'authorization' : `Bearer ${token}`};
        var id = await AsyncStorage.getItem('id');
        id = JSON.parse(id);
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
            setLoading(false);

        }).catch((err) => {
            token = null;
            console.log(err.response.data.message);
            navigation.navigate("Home");
        })
    })()
    }, []);

    useEffect(() => {

        if(!isLoading){
            var inglist = [];
            for(let i = 0; i < recipe.ingredients.length; i++){
                inglist.push(
                <View
                style={{
                    padding: 10,
                    backgroundColor:`${Colors.primary}`,
                    shadowColor: `${Colors.black}`,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,  
                    elevation: 5,
                }}>
                    <PageSubTitle>Ingredient: {recipe.ingredients[`${i}`].ingredient}</PageSubTitle>
                    {(recipe.ingredients[i].quantity != "") && <PageSubTitle>Quantity: {recipe.ingredients[`${i}`].quantity}</PageSubTitle>}
                </View>
                    );
                }
                setIngredients(inglist);
                setRecipeLen(recipe.steps.length + 3);
        }

    },[recipe, isLoading])

  function next(){
      incrementStep(step+1);
  }

  function back(){
      incrementStep(step-1);
  }

  return (
        <View style={{
            flex: 1,
        }}>
            <StyledContainer>
                {renderSwitch(step, isLoading, recipe, ingredients, windowWidth)}
            </StyledContainer>
            <View>
            {(step < recipeLen-1) && <Button onPress={() => next()} title="Next" />}
            {(step > 1) && <Button  onPress={() =>back()} title="Back" />}
            <Button  onPress={() => navigation.pop()} title="Exit" />
            </View>
        </View>

  );
}

const renderSwitch = (step, isLoading, recipe, ingredients, windowWidth) => {
        if(step == 1){
            return recipeInfo(isLoading, recipe, windowWidth);
        }else if(step == 2){
            return ingredientList(isLoading, ingredients);
        }else if(step >= 3){
            return steps(isLoading, recipe, step);
        }else{
            return (
                <PageTitle> Loading ... </PageTitle>
            )
        }
}

    function recipeInfo(isLoading, recipe, windowWidth){

        return (
            <>
            {(!isLoading) ? 
            (
            <View style={{ flex: 1, alignItems: 'center' }}>
            <PageTitle
             style={{
                top: 20,
            }}>{recipe.title}
            </PageTitle>

            {recipe.hasOwnProperty('images') && 
            <ScrollView
                style={{
                    top: 50,
                    flex: 1,
                    width: windowWidth,
                }}
                pagingEnabled={true}
                horizontal={true}
            >
                {recipe.images.length >= 1 && 
                  <View style={{ alignItems: 'center', width: windowWidth }}>
                  <Image
                    style={{
                      height: '90%',
                      width: '100%',
                    }}
                    source={{ uri: recipe.images[0] }}
                  />
                  <Text> 1 / {recipe.images.length}</Text>
                  </View>
                  }
                  {recipe.images.length >= 2  && 
                  <Image
                    style={{
                        height: 300,
                        width: windowWidth,
                    }}
                    source={{ uri: recipe.images[1] }}
                  />}
                  {recipe.images.length == 3  &&
                  <Image
                    style={{
                        height: 300,
                        width: windowWidth,
                    }}
                    source={{ uri: recipe.images[2] }}
                  />}
            </ScrollView>}
            <View
            style={{
                top: 50,
                alignItems: 'center',
                padding: 30,
            }}>
            <PageSubTitle>Servings: {recipe.servings}</PageSubTitle>
            <PageSubTitle> Prep Time [{recipe.prep['hours']} H : {recipe.prep['minutes']} M : {recipe.prep['seconds']} S]</PageSubTitle>
            <PageSubTitle> Cook Time [{recipe.cook['hours']} H : {recipe.cook['minutes']} M : {recipe.cook['seconds']} S ]</PageSubTitle>
            </View>
            </View>
            ):(
                <PageTitle> Loading ... </PageTitle>
            )}
            </>
        )

    }
    
    function ingredientList(isLoading, ingredients){
        return (
            <>
            {(!isLoading) ? 
            (   
                <View
                style={{
                    backgroundColor: `${Colors.secondary}`,
                }}>
                <PageTitle
                style={{
                    top: 30,
                }}>Ingredients</PageTitle>
                    <ScrollView 
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                    style={{
                        top: 50,
                    }}>
                    {ingredients}
                    </ScrollView>
                </View>
                
            ) :
            (
                <PageTitle> Loading ... </PageTitle>
            )
            }
            </>
        )
    }
    
    function steps(isLoading, recipe, step){
        return (
            <>
            {(!isLoading) ? (
                <View>
                <PageTitle style={{
                    top: 20,
                }}>Step {`${step-2}`}</PageTitle> 
                    <StyledTextLabel style={{
                        top: 50,
                        fontSize: 25,
                    }}>{recipe.steps[`${step-3}`]}</StyledTextLabel>
                </View>
            ) : (
                <PageTitle> Loading ... </PageTitle>
            )}
            </>
        )
    }
    


export default ViewRecipe;