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

    return (
        <StyledContainer>
        </StyledContainer>
    )
  }

  export default Locate;