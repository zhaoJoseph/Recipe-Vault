import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import {Links} from './Constants';


export const getToken = async () => {

    var token = await AsyncStorage.getItem('access_token');
    var decoded = jwt_decode(token);

    if(Date.now() >= decoded.exp * 1000){ // True if expired token
        var url = Links.refresh;
        const refresh_token = await AsyncStorage.getItem('refresh_token');
        let result;
        var body = {
            grant_type: "refresh",
            client_id: "835e2ab849857e36ec036adb3b1e8839",
            refresh_token: refresh_token,
        }
    try{
        result = await axios.post(url, body);
    }catch(err){
        console.log(err);
        return err;
    }
        if(result){

            await AsyncStorage.setItem('access_token', result.data.access_token);

            return result.data.access_token;
        }else{
            return new Error("Error occured refreshing access token");
        }

    }else{
        return token;
    }

}
