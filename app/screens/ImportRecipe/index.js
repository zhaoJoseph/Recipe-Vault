import React from 'react';

import {View, Text} from 'react-native';

import axios from 'axios';

import {Formik} from 'formik';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {getToken} from '../../helpers';

import {Links} from '../../Constants/Links';

import { useToast } from "react-native-toast-notifications";

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
    StyledTextInputLarge,
} from '../../components/styles.js';

const ImportRecipe = ({navigation}) => {

    const errorToast = useToast();

    const getURL = async (RecipeURL) => {
        const url = Links.url;
        let token = await getToken();
        var headers = {
            "Content-Type": "application/json",
            'authorization' : `Bearer ${token}`};
        var id = await AsyncStorage.getItem('id');
        id = JSON.parse(id);
        var params = {
            id: id.id,
            url: RecipeURL.url,
        }
        axios.get(url, 
            {   
                headers: headers,
                params: params,
            })
        .then((res) => {
            token = null;
            editRecipe(res.data.recipe);
        }).catch((error) => {
            token = null;
            console.log(error);
            errorToast.show("Could not fetch url.");
        })
    }

    function extractTimes(recipe, timeStr){

        var timeObj = {};

        var hr;

        var sec;

        var min;

        if(/(?=.*[hms])^(P([\d]*Y)?([\d]*M)?([\d]*W)?([\d]*D)?T([\d]*H)?([\d]*M)?([\d]*S)?)$/i.test(recipe[[timeStr]])){ //checks for ISO8601 Format
            hr = (recipe[[timeStr]].match(/([\d]+H)/i)) ? parseInt(recipe[[timeStr]].match(/([\d]+H)/i)[0].replace(/[^\d.]/g, ''), 10) : 0;
            min =  (recipe[[timeStr]].match(/([\d]+M)/i)) ? parseInt(recipe[[timeStr]].match(/([\d]+M)/i)[0].replace(/[^\d.]/g, ''), 10) : 0;
            sec =  (recipe[[timeStr]].match(/([\d]+S)/i)) ? parseInt(recipe[[timeStr]].match(/([\d]+S)/i)[0].replace(/[^\d.]/g, ''), 10) : 0;
            
        }else{  
            hr = /(([\d]+|[\d]+-[\d]+) (H|Hours?|Hrs?))/i.test(recipe[[timeStr]]) ? 
            parseInt(recipe[[timeStr]].match(/(([\d]+|[\d]+-[\d]+) (H|Hours?|Hrs?))/i)[0].replace(/[^\d.]/g, ''), 10) : 0;
            min = /(([\d]+|[\d]+-[\d]+) (M|Mins?|Minutes?))/i.test(recipe[[timeStr]]) ?  
            parseInt(recipe[[timeStr]].match(/(([\d]+|[\d]+-[\d]+) (M|Mins?|Minutes?))/i)[0].replace(/[^\d.]/g, ''), 10) : 0;
            sec = /(([\d]+|[\d]+-[\d]+) (Secs?|Seconds?))/i.test(recipe[[timeStr]]) ?   
            parseInt(recipe[[timeStr]].match(/(([\d]+|[\d]+-[\d]+) (Secs?|Seconds?))/i)[0].replace(/[^\d.]/g, ''), 10) : 0;
        }

        timeObj = {hours: hr, seconds: sec, minutes: min};

        return timeObj;
    }

    const editRecipe = (recipe) => {
        var newRecipe = {};

        newRecipe['title'] = recipe['name'];
        newRecipe['ingredients'] = [];
        newRecipe['steps'] = [];

        if(recipe.hasOwnProperty('recipeYield')){
            newRecipe['servings'] = (typeof recipe['recipeYield'] === 'number') ? parseInt(recipe['recipeYield'], 10) : recipe['recipeYield'];
        }

        if(recipe.hasOwnProperty('prepTime')){
 
            var prepTime = 'prepTime'

            newRecipe['prep'] = extractTimes(recipe, prepTime);
        }

        if(recipe.hasOwnProperty('cookTime')){

            var cookTime = 'cookTime'

            newRecipe['cook'] = extractTimes(recipe, cookTime);
        }

        if(recipe.hasOwnProperty('recipeIngredient')){

            for(var ingredient of recipe['recipeIngredient']){
                var ingredientItem = {};

                ingredientItem['ingredient'] = ingredient;

                ingredientItem['quantity'] = ingredient.match(/([\d]+|[\d]+-[\d]+|[\u00BC-\u00BE\u2150-\u215E]) [\w]+/i) ? 
                ingredient.match(/([\d]+|[\d]+-[\d]+|[\u00BC-\u00BE\u2150-\u215E]) [\w]+/i)[0] : "";
                newRecipe['ingredients'].push(ingredientItem);
            }
        }

        if(recipe.hasOwnProperty('recipeInstructions')){
            for(var instruction of recipe['recipeInstructions']){

                if(typeof instruction === 'object' && instruction.hasOwnProperty('text')){   //assume recipe schema step object
                    newRecipe['steps'].push(instruction.text);
                }else if(typeof elem === 'string'){
                    newRecipe['steps'].push(instruction);
                }
            }
        }

        let url = [];

        if(recipe.hasOwnProperty('image')){
            if(typeof recipe.image === 'object' && Array.isArray(recipe.image)){
                for(var i = 0; i < 3; i++){
                    url.push(recipe.image[i]);
                }
            }else if(typeof recipe.image === 'object' && recipe['image']['url']){
                url = [ recipe['image']['url'] ];
            }
        }

        newRecipe['images'] = url;

        navigation.navigate("CreateStack", {screen: 'Create', params: {mode: 'Edit', recipe: newRecipe}})

    }


    return (
        <StyledContainer>
            <InnerContainer style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>    
                <Formik
                initialValues={{url: ''}}
                onSubmit={(values) => {
                getURL(values)
                }}
                >
                {({handleChange, handleBlur, handleSubmit, values}) => (
                <StyledFormArea>
                    <MyTextInput   
                    onChangeText={handleChange('url')}
                    onBlur={handleBlur('url')}
                    value={values.url}
                    placeholder="Enter Recipe URL Here"
                    />
                    <StyledButton
                    onPress={handleSubmit}
                    >
                    <ButtonText>Get Recipe</ButtonText>
                    </StyledButton>
                </StyledFormArea>)}
                </Formik>
            </InnerContainer>
        </StyledContainer>
    )
}

const MyTextInput = ({label, ...props} : Props) => {
  return  (
    <View>
      <StyledTextLabel>{label}</StyledTextLabel>
      <StyledTextInput {...props}/>
    </View> 
  )
}

export default ImportRecipe;