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

    const logout = () => {
        navigation.navigate("Logout");
    }

    const handleNav = (name) => {

        navigation.navigate(name);
    }

    const handleCreate = () => {
         navigation.navigate("CreateStack", {screen: 'Create', params: {mode: "Create"}});
    }


    return (
       <StyledContainer>
            <InnerContainer>
                <PageTitle style={{
                    top: 100,
                }}>Menu</PageTitle>
                <Formik
                >
                {({handleSubmit}) => (
                    <StyledFormArea 
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                    }}>
                         <StyledButton
                        onPress={() => handleNav("Recipes")}
                        >
                        <ButtonText>Recipes</ButtonText>
                        </StyledButton>
                         <StyledButton
                        onPress={() => handleNav("Import")}
                        >
                        <ButtonText>Import</ButtonText>
                        </StyledButton>
                         <StyledButton
                        onPress={() => handleNav("Locate")}
                        >
                        <ButtonText>Locate</ButtonText>
                        </StyledButton>
                        <StyledButton
                        onPress={handleCreate}
                        >
                        <ButtonText>Create Recipe</ButtonText>
                        </StyledButton>
                         <StyledButton
                        onPress={logout}
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