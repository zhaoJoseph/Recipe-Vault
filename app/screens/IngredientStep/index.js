import React, {useContext, useEffect, useState} from 'react';

import { useIsFocused } from "@react-navigation/native";

import {Text, View, FlatList, ScrollView, Button} from 'react-native';

import {Formik, Form, FieldArray} from 'formik';

import NavigationEvents from '@react-navigation/native';

import {Octicons, Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import {Colors} from '../../Constants/Colors';

import {ingredientContext} from '../../Context/ingredientContext';

import {recipeContext} from '../../Context/recipeContext';

import { PropTypes } from 'prop-types';

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

function IngredientStep ({navigation, route} : Props){

    const {ingredientsList, setIngredientsList} = useContext(ingredientContext);

    const {recipe, setRecipe} = useContext(recipeContext);

    const [loading, setLoading] = useState(true);

    const isFocused = useIsFocused();

    React.useEffect(() => {

        navigation.setOptions({
            headerRight: function HB () {
            return (
            <Button 
                    onPress={() => {navigation.navigate("CreateStack", {screen: "Add Ingredient", params: {mode: route.params.mode}})
                }}
                title="Add Ingredient"
                color={Colors.brand}
            />            
            )
            }},[])
    },[])

    useEffect(() => {

        if(route.params?.ingredient && route.params?.oldIngredient){
            let newList = ingredientsList;
            let ind = 0;

            while(ind < newList.length){
                if(newList[ind].ingredient == route.params?.oldIngredient){
                    newList[ind].ingredient = route.params?.ingredient.ingredient;
                    newList[ind].quantity = route.params?.ingredient.quantity;
                    ind = newList.length + 1;
                }
                ind++;
            }
            //console.log(newList);
            setIngredientsList(newList);
            
        }else if(route.params?.ingredient){
            setIngredientsList([...ingredientsList, route.params?.ingredient]);
        }else if(route.params.mode == "Edit" && loading && ingredientsList.length == 0){
            setIngredientsList(recipe.ingredients);
            setLoading(true);
        }
    },[isFocused])

    useEffect(() => {
        if(route.params?.ingredient){
            delete route.params.ingredient;
        }

        if(route.params?.oldIngredient){
            delete route.params.oldIngredient;
        }

        setLoading(false);
    },[ingredientsList])

    useEffect(() => {
        setLoading(false);
    },[recipe])


    const onSubmit = () => {
        setRecipe({...recipe, 
        ingredients: ingredientsList,
        });
        if(route.params.mode == "Edit"){
            navigation.navigate("StepStack", {screen: "Step 1", params: {mode: route.params.mode, name: route.params.name}});
        }else{
            navigation.navigate("StepStack", {screen: "Step 1", params: {mode: route.params.mode}});
        }
    }   

    return (

        <StyledContainer>
            {(!loading) ? (<InnerContainer>
                <ScrollView style={{ 
                    width: '100%',
                }}>
                    {(ingredientsList?.length > 0) ? (ingredientsList.map(({value}, index) => (
                        <IngredientView 
                        key={index} 
                        index={index} 
                        ingredient={ingredientsList[index].ingredient}
                        navigation={navigation} 
                        mode={route.params.mode} 
                        quantity={ingredientsList[index].quantity} 
                        setLoading={setLoading}
                        /> 
                    ))
                    ): <Text> Your ingredients will be here!</Text>}
                </ScrollView>
                {(ingredientsList?.length > 0) ? (
                    <StyledButton
                    onPress={onSubmit}
                    >
                        <ButtonText>Create Step</ButtonText>
                    </StyledButton>
                ) : null}
            </InnerContainer>) 
            : 
            (<View> 
                <Text>
                    Loading ...
                    </Text>
                </View>)}
        </StyledContainer> 
    )

}

const IngredientView = ({ingredient, quantity, index, navigation, mode, setLoading} : Props) => {

    const {ingredientsList, setIngredientsList} = useContext(ingredientContext);

    return(
        <IngredientContainer>   
        <Text 
        ellipsizeMode='tail'
        numberOfLines={2}
        style={{ 
            width: "50%",
        }}>{ingredient}</Text>
        <Text 
        ellipsizeMode='tail'
        numberOfLines={2}
        style={{ 
            width: "30%",
        }}>{quantity}</Text>
        <Button onPress={() => {setLoading(true); setIngredientsList(ingredientsList.filter((value, itemIndex)=> {if(itemIndex != index){return value}}))}} title="-"/>
        <Button onPress={() => {navigation.navigate("CreateStack", {screen: "Add Ingredient", params: {mode: mode, ingredient: ingredient, quantity: quantity}});
                                }} title="Edit"/>
        </IngredientContainer>
    )
}   

IngredientStep.propTypes = {
    route: PropTypes.shape({
        params: PropTypes.shape({
            mode: PropTypes.number.isRequired
        })
    }).isRequired
}

export default IngredientStep;