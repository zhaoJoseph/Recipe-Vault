import React, {useState, useContext} from 'react';

import {Text, View, FlatList, ScrollView, Button} from 'react-native';

import {Formik, Form, FieldArray} from 'formik';

import NavigationEvents from '@react-navigation/native';

import {Octicons, Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import {Colors} from '../../Constants/Colors';

import {ingredientContext} from '../../Context/ingredientContext';

import {recipeContext} from '../../Context/recipeContext';

import Modal from 'react-native-modal';

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
} from '../../components/styles.js';

function IngredientStep ({navigation, route}){

    const {ingredientsList, setIngredientsList} = useContext(ingredientContext);

    const {recipe, setRecipe} = useContext(recipeContext);

    React.useEffect(() => {
        navigation.setOptions({
            headerRight: function HB () {
            return (
            <Button 
                    onPress={() => {navigation.navigate("CreateStack", {screen: "MyModal",
                        params: {onReturn: (item) => {setIngredientsList([...ingredientsList, item])}}
                    })
                    }}
                    title="Add Ingredient"
                    color={Colors.brand}
            />
            )
            }},[])
    })

    const onSubmit = () => {
        setRecipe({...recipe, 
        ingredients: ingredientsList,
        });
        navigation.push("StepStack", {screen: "CreateStep"});
    }   

    return (

        <StyledContainer>
            <InnerContainer>
                <ScrollView style={{ 
                    width: '100%',
                }}>
                    {(ingredientsList.length > 0) ? (ingredientsList.map(({value}, index) => (
                        <IngredientView key={index} index={index} ingredient={ingredientsList[index].ingredient} quantity={ingredientsList[index].quantity} /> 
                    ))
                    ): <Text> Your ingredients will be here!</Text>}
                </ScrollView>
                {(ingredientsList.length > 0) ? (
                    <StyledButton
                    onPress={onSubmit}
                    >
                        <ButtonText>Create Step</ButtonText>
                    </StyledButton>
                ) : null}
            </InnerContainer>
        </StyledContainer> 
    )

}

const IngredientView = ({ingredient, quantity, index}) => {

    const {ingredientsList, setIngredientsList} = useContext(ingredientContext);

    return(
        <IngredientContainer>   
        <Text style={{ 
            width: "50%",
        }}>{ingredient}</Text>
        <Text style={{ 
            width: "30%",
        }}>{quantity}</Text>
        <Button onPress={() => {setIngredientsList(ingredientsList.filter((value, itemIndex)=> {if(itemIndex != index){return value}}))}} title="-"/>
        </IngredientContainer>
    )
}   

export default IngredientStep;