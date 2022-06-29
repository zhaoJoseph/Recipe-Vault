import React, {useState} from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { LogBox } from "react-native";

import RootStack from './app/navigators/RootStack';

import { userContext } from './app/Context/userContext';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { ToastProvider } from 'react-native-toast-notifications';

export default function App() {

  const ignoreWarns = [
    "Setting a timer for a long period of time",
    "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation",
    "ViewPropTypes will be removed",
    "AsyncStorage has been extracted from react-native",
    "EventEmitter.removeListener",
  ];
  const warn = console.warn;
  console.warn = (...arg) => {
      for (let i = 0; i < ignoreWarns.length; i++) {
          if (arg[0].startsWith(ignoreWarns[i])) return;
      }
      warn(...arg);
  };

LogBox.ignoreLogs(ignoreWarns);

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
