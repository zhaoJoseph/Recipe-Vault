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

  return (
        <View style={{
            flex: 1,
        }}>
        </View>

  );
}

export default ViewRecipe;