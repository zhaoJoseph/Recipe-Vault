import React, {useState, useContext} from 'react';

import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {Octicons, Ionicons} from '@expo/vector-icons';

import {Formik } from 'formik';

import axios from 'axios';

import * as yup from 'yup';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {userContext} from '../../Context/userContext';

import {Colors} from '../../Constants/Colors';

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


const Login=({navigation})=> {
  const [hidePassword, setHidePassword] = useState(true);

  const [message, setMessage] = useState();

  const {UserId, setUserId} = useContext(userContext);

  const handleLogin = (credentials) => {
    const url = "http://10.0.2.2:3000/authenticate";
    axios.get(url, {params: {
      email: credentials.email,
      password: credentials.password
      }}).then((res) => {
        const result = res.data;
        if(result.message == 'user found!'){
          AsyncStorage
          .setItem('id', JSON.stringify({id: result.data[0].id}))
          .then(()=> {
            setUserId({id: result.data[0].id})
          })
          .catch((error) => {
            console.log(error);
            setMessage("Could not secure credentials please try again later.");
          })
        }else{
          setMessage("User Not Found");

        }
      }).catch((error) => {
        console.log(error);
        setMessage("An error occured while trying to login, please try again later");
    })  
  }

  return (
      <StyledContainer>
        <InnerContainer>
          <PageLogo resizeMode="cover" source={require('../../../assets/favicon.png')}/>
          <PageTitle>App</PageTitle>
          <PageSubTitle>Login to Account</PageSubTitle>

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
                    Don't have an account? 
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

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, setMessage,...props}) => {
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
