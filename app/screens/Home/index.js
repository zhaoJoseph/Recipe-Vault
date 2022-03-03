import React, {useContext} from 'react';

import {Text} from 'react-native';

import {Formik} from 'formik';

import { StackActions, NavigationActions } from '@react-navigation/stack';

import {userContext} from '../../Context/userContext';

import {Colors} from '../../Constants/Colors';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Recipes from '../Recipes';

import { 
  StyledContainer, 
  InnerContainer, 
  PageLogo, 
  PageTitle,
  PageSubTitle,
  StyledFormArea,
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

const Home = ({navigation}) => {

    const {UserId, setUserId} = useContext(userContext);

    const handleLogout = () =>{
            AsyncStorage.clear()
            .then(() =>{
                setUserId(null);
            })
            .catch((err) =>{
                console.log(err);
            })
    }

    const handleRecipes = () => {
        navigation.navigate("Recipes");
    }

    const handleCreate = () => {
         navigation.navigate("CreateStack", {screen: 'Create'});
    }


    return (
       <StyledContainer>
            <InnerContainer>
                <PageTitle>Welcome Back</PageTitle>
                <Formik
                >
                {({handleSubmit}) => (
                    <StyledFormArea>
                         <StyledButton
                        onPress={handleRecipes}
                        >
                        <ButtonText>My Recipes</ButtonText>
                        </StyledButton>
                         <StyledButton
                        onPress={handleSubmit}
                        >
                        <ButtonText>Share Recipe</ButtonText>
                        </StyledButton>
                         <StyledButton
                        onPress={handleSubmit}
                        >
                        <ButtonText>Import Recipe</ButtonText>
                        </StyledButton>
                         <StyledButton
                        onPress={handleSubmit}
                        >
                        <ButtonText>Locate Ingredients</ButtonText>
                        </StyledButton>
                        <StyledButton
                        onPress={handleCreate}
                        >
                        <ButtonText>Create Recipe</ButtonText>
                        </StyledButton>
                         <StyledButton
                        onPress={handleLogout}
                        >
                        <ButtonText>Logout</ButtonText>
                        </StyledButton>
                    </StyledFormArea>
                )}
                </Formik>
            </InnerContainer>
       </StyledContainer>
    );
}

export default Home;