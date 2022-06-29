import React, {useContext, useEffect} from 'react';

import {Text} from 'react-native';

import { useToast } from "react-native-toast-notifications";

import {userContext} from '../../Context/userContext';

import AsyncStorage from '@react-native-async-storage/async-storage';

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

const Logout = () => {

    const {UserId, setUserId} = useContext(userContext);

    const errorToast = useToast();    

    useEffect(() => {

        let keys = ['id', 'access_token', 'refresh_token'];
        AsyncStorage.multiRemove(keys)
        .then(() =>{
            setUserId(null);
        })
           .catch((err) =>{
            errorToast.show(err);
            console.log(err);
            return err;
        })
    },[])

    return (
        <StyledContainer style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <PageTitle> Logging Out ... </PageTitle>
        </StyledContainer>
    )
}

export default Logout;