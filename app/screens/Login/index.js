import React, {useState, useContext} from 'react';

import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {Octicons, Ionicons} from '@expo/vector-icons';

import {Formik } from 'formik';

import axios from 'axios';

import * as yup from 'yup';

import * as qs from 'qs';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {userContext} from '../../Context/userContext';

import {Colors, Links} from '../../Constants';

import * as Crypto from 'expo-crypto';

import * as Random from 'expo-random';

import { Buffer } from 'buffer';

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


const Login=({navigation} : Props)=> {
  const [hidePassword, setHidePassword] = useState(true);

  const [message, setMessage] = useState();

  const {UserId, setUserId} = useContext(userContext);

  //create verifier and challenge code https://www.loginradius.com/blog/engineering/pkce/
  function base64URLEncode(str) {
      return str
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');
  }

  async function sha256(buffer): Promise<string> {
      return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        buffer,
        {encoding : Crypto.CryptoEncoding.BASE64}
      ); 
  }


  const handleLogin = async (credentials) => {
    const url = Links.accesscode;
    try{
    const randomBytes = await Random.getRandomBytesAsync(32);
    const base64String = Buffer.from(randomBytes).toString('base64');
    var verifier = base64URLEncode(base64String);
    let result;
    let tokenResult;
    if(verifier){
      try{
        var challenge = base64URLEncode(await sha256(verifier));
      }catch(err){
        console.log(err);
      }
      await AsyncStorage.setItem('verifier', verifier);
      let params = {
        username: credentials.email,
        password: credentials.password,
        grant_type: "authorization_code",
        client_id: "835e2ab849857e36ec036adb3b1e8839",
        redirect_uri: Links.token,
        code_challenge: challenge,
        code_challenge_method: 'SHA256',
        };
      try{
        result = await axios.get(url, {params : params});
      }catch(err){
        setMessage(err.response.data.message);

      }
    }

    if(result && verifier){
      verifier = await AsyncStorage.getItem('verifier');
      let body = qs.stringify({ 
        username: credentials.email,
        grant_type: "authorization_code",
        client_id: "835e2ab849857e36ec036adb3b1e8839",
        redirect_uri: result.data.redirect_uri,
        id: result.data.id,
        code: result.data.code,
        code_verifier: verifier
        });
      let config = {  
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
      const tokenRequest = result.data;
      tokenResult = await new Promise((resolve, reject) => {
        resolve(axios.post(tokenRequest.url, body, config));
      })
      await AsyncStorage.clear();
      verifier = null;
    }

    if(tokenResult){
      var items = [['access_token', tokenResult.data.access_token], ['id', tokenResult.data.id], ['refresh_token', tokenResult.data.refresh_token]]

      await AsyncStorage
          .multiSet(items)
          .then(()=> {
            setUserId({id: tokenResult.data.id})
          })
          .catch((error) => {
            console.log(error);
            setMessage("Could not secure credentials please try again later.");
          })
    }else if(!message){
      setMessage("Error setting variables or token")
    }else{
      setMessage("An error occured while trying to login, please try again later.");
    }
    }catch{(error) => {
          if( error.response.status == 404 && error.response.data['message'] != null){
            const errorMessage = error.response.data['message'];
            setMessage(errorMessage);
          }else{
            console.log(error.response.data);
          setMessage("An error occured while trying to login, please try again later.");
          }
      }}
  }

  return (  
      <StyledContainer>
        <InnerContainer>
          <PageLogo resizeMode="cover" source={require('../../../assets/favicon.png')}/>
          <PageTitle>Quick Recipes</PageTitle>
          <PageSubTitle>Login</PageSubTitle>

          <Formik
            initialValues={{email: '', password: ''}}
            onSubmit={(values) => {
            handleLogin(values)
            }}
            validationSchema={loginValidate}
          >
            {({handleChange, handleBlur, handleSubmit, values, touched, errors}) => (
            <StyledFormArea>
              <MyTextInput 
              label="Email Address"
              icon="mail"
              placeholder="example@gmail.com"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholderTextColor={Colors.darklight}
              keyboardType="email-address"
              setMessage={setMessage}
              /> 
              
               {(errors.email && touched.email) && 
                <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>}
              <MyTextInput 
              label="Password"
              icon="key"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry={hidePassword}
              isPassword={true}
              placeholderTextColor={Colors.darklight}
              hidePassword={hidePassword}
              setHidePassword={setHidePassword}
              setMessage={setMessage}
              />
               {(errors.password && touched.password) &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text>} 
              <StyledButton
              onPress={handleSubmit}
              >
                <ButtonText>Login</ButtonText>
              </StyledButton>
                <ExtraView>
                  <ExtraText>
                    Don&apos;t have an account? 
                  </ExtraText>
                  <TextLink
                  onPress={() => navigation.navigate('Register')}
                  >
                    <TextLinkContent> Register Here</TextLinkContent>
                  </TextLink>
                </ExtraView>
                <Text style={{ fontSize: 20, color: 'red', textAlign: 'center' }}>{message}</Text>
            </StyledFormArea>)}
          </Formik>
        </InnerContainer>
      </StyledContainer>
  );
}

const loginValidate = yup.object().shape({
    email: yup
      .string()
      .email()
      .required('email required'),
    password: yup
      .string()
      .required('Password required'),
})

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, setMessage,...props} : Props) => {
  return  (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={Colors.brand} />
      </LeftIcon>
      <StyledTextLabel>{label}</StyledTextLabel>
      <StyledTextInput onChange={()=> setMessage()} {...props}/>
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={Colors.darklight}/>
        </RightIcon>
      )}
    </View> 
  )
}



export default Login;
