import {useState} from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import RootStack from './app/navigators/RootStack';

import { userContext } from './app/Context/userContext';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { ToastProvider } from 'react-native-toast-notifications';

export default function App() {

  const [UserId, setUserId] = useState("");

  const [loading, setLoading] = useState(true);

  const checkLoggedIn = () => {
    AsyncStorage
    .getItem('id')
    .then((result) =>{
      if(result != null){
        setUserId(result);
      }else{
        setUserId(null);
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }

  return (
    <ToastProvider>
    <userContext.Provider value={{UserId, setUserId, loading, setLoading}}>
      < RootStack/>
    </userContext.Provider>
    </ToastProvider>
  );
}
