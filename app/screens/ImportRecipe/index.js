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

    return (
        <StyledContainer>
        </StyledContainer>
    )
}

export default ImportRecipe;