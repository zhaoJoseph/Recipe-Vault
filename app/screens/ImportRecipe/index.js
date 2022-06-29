import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';

import {View, Text, Modal, ScrollView, Animated, StyleSheet} from 'react-native';

import axios from 'axios';

import {Formik} from 'formik';

import {Octicons, Ionicons} from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {getToken} from '../../helpers';

import {Links, Colors} from '../../Constants';

import { useToast } from "react-native-toast-notifications";

import {Picker as SelectedPicker} from '@react-native-picker/picker';

import * as Clipboard from 'expo-clipboard';

import {StyledContainer, 
    InnerContainer,
    StyledFormArea,
    CenterIcon,
    LeftIcon,
    RightIcon,
    StyledTextLabel,
    StyledTextInput,
    ButtonText,
    StyledButton,
    StyledFlatList,
    IngredientContainer,
    StyledTextInputLarge,
} from '../../components/styles.js';

const ImportRecipe = ({navigation}) => {

    const errorToast = useToast();

    const [viewBookmarks, setViewBookmarks] = useState(false);    

    const [bookmarks, setBookmarks] = useState([]);

    const [bookmarkList, setBookmarkList] = useState(false);

    const getURL = async (RecipeURL) => {
        const url = Links.url;
        let token = await getToken();
        var headers = {
            "Content-Type": "application/json",
            'authorization' : `Bearer ${token}`};
        var id = await AsyncStorage.getItem('id');
        id = JSON.parse(id);
        var params = {
            id: id.id,
            url: RecipeURL.url,
        }
        axios.get(url, 
            {   
                headers: headers,
                params: params,
            })
        .then((res) => {
            token = null;
            editRecipe(res.data.recipe);
        }).catch((error) => {
            token = null;
            console.log(error);
            errorToast.show("Could not fetch url.");
        })
    }

    useEffect(() => {
            AsyncStorage.getItem('id').then(id => {
                var arrString = `${id}` + ' bookmarks';
                AsyncStorage.getItem(arrString).then((res) => {
                    let arr = JSON.parse(res);
                    if(arr){
                        setBookmarks(arr);
                    }
                })
            }).catch(err => {
                console.log(err);
            })

    },[])

    function extractTimes(recipe, timeStr){

        var timeObj = {};

        var hr;

        var sec;

        var min;

        if(/(?=.*[hms])^(P([\d]*Y)?([\d]*M)?([\d]*W)?([\d]*D)?T([\d]*H)?([\d]*M)?([\d]*S)?)$/i.test(recipe[[timeStr]])){ //checks for ISO8601 Format
            hr = (recipe[[timeStr]].match(/([\d]+H)/i)) ? parseInt(recipe[[timeStr]].match(/([\d]+H)/i)[0].replace(/[^\d.]/g, ''), 10) : 0;
            min =  (recipe[[timeStr]].match(/([\d]+M)/i)) ? parseInt(recipe[[timeStr]].match(/([\d]+M)/i)[0].replace(/[^\d.]/g, ''), 10) : 0;
            sec =  (recipe[[timeStr]].match(/([\d]+S)/i)) ? parseInt(recipe[[timeStr]].match(/([\d]+S)/i)[0].replace(/[^\d.]/g, ''), 10) : 0;
            
        }else{  
            hr = /(([\d]+|[\d]+-[\d]+) (H|Hours?|Hrs?))/i.test(recipe[[timeStr]]) ? 
            parseInt(recipe[[timeStr]].match(/(([\d]+|[\d]+-[\d]+) (H|Hours?|Hrs?))/i)[0].replace(/[^\d.]/g, ''), 10) : 0;
            min = /(([\d]+|[\d]+-[\d]+) (M|Mins?|Minutes?))/i.test(recipe[[timeStr]]) ?  
            parseInt(recipe[[timeStr]].match(/(([\d]+|[\d]+-[\d]+) (M|Mins?|Minutes?))/i)[0].replace(/[^\d.]/g, ''), 10) : 0;
            sec = /(([\d]+|[\d]+-[\d]+) (Secs?|Seconds?))/i.test(recipe[[timeStr]]) ?   
            parseInt(recipe[[timeStr]].match(/(([\d]+|[\d]+-[\d]+) (Secs?|Seconds?))/i)[0].replace(/[^\d.]/g, ''), 10) : 0;
        }

        timeObj = {hours: hr, seconds: sec, minutes: min};

        return timeObj;
    }

    const editRecipe = (recipe) => {
        var newRecipe = {};

        newRecipe['title'] = recipe['name'];
        newRecipe['ingredients'] = [];
        newRecipe['steps'] = [];

        if(recipe.hasOwnProperty('recipeYield')){
            newRecipe['servings'] = (typeof recipe['recipeYield'] === 'number') ? parseInt(recipe['recipeYield'], 10) : recipe['recipeYield'];
        }

        if(recipe.hasOwnProperty('prepTime')){
 
            var prepTime = 'prepTime'

            newRecipe['prep'] = extractTimes(recipe, prepTime);
        }

        if(recipe.hasOwnProperty('cookTime')){

            var cookTime = 'cookTime'

            newRecipe['cook'] = extractTimes(recipe, cookTime);
        }

        if(recipe.hasOwnProperty('recipeIngredient')){

            for(var ingredient of recipe['recipeIngredient']){
                var ingredientItem = {};

                ingredientItem['ingredient'] = ingredient;

                ingredientItem['quantity'] = ingredient.match(/([\d]+|[\d]+-[\d]+|[\u00BC-\u00BE\u2150-\u215E]) [\w]+/i) ? 
                ingredient.match(/([\d]+|[\d]+-[\d]+|[\u00BC-\u00BE\u2150-\u215E]) [\w]+/i)[0] : "";
                newRecipe['ingredients'].push(ingredientItem);
            }
        }

        if(recipe.hasOwnProperty('recipeInstructions')){
            for(var instruction of recipe['recipeInstructions']){

                if(typeof instruction === 'object' && instruction.hasOwnProperty('text')){   //assume recipe schema step object
                    newRecipe['steps'].push(instruction.text);
                }else if(typeof elem === 'string'){
                    newRecipe['steps'].push(instruction);
                }
            }
        }

        let url = [];

        if(recipe.hasOwnProperty('image')){
            if(typeof recipe.image === 'object' && Array.isArray(recipe.image)){
                for(var i = 0; i < 3; i++){
                    url.push(recipe.image[i]);
                }
            }else if(typeof recipe.image === 'object' && recipe['image']['url']){
                url = [ recipe['image']['url'] ];
            }
        }

        newRecipe['images'] = url;

        navigation.navigate("CreateStack", {screen: 'Create', params: {mode: 'Edit', recipe: newRecipe}})

    }

    const BookmarkView = (props : Props) => {

        const [bounceValue] = useState(new Animated.Value(0));

        const [newBookmark, setNewBookmark] = useState("");

        useEffect(() => {
            var toValue = 60;

            if(bookmarks.length == 1){
                toValue = 185;
            }else if(bookmarks.length == 2){
                toValue = 240;
            }else if(bookmarks.length >= 3){
                toValue = 305;
            }

            if(props.viewBookmarks){
                toValue = 0;
            }

            Animated.spring(
                bounceValue,
                {
                    toValue: toValue,
                    velocity: 3,
                    tension: 2,
                    friction: 8,
                    useNativeDriver: true,
                }
            ).start();
            
        },[props.viewBookmarks])

        useEffect(() => {
            (async () => {
                if(bookmarks.length > 0){
                    setNewBookmark("");
                    const bookmarkString = JSON.stringify(bookmarks);
                    var id = await AsyncStorage.getItem('id');
                    try{
                        await AsyncStorage.setItem(`${id}` + ' bookmarks', bookmarkString);
                    }catch(err){
                        console.log(err);
                    }
                }else if(bookmarks.length == 0 ){
                    setBookmarkList(false);
                }
            })()
        },[bookmarks])

        const addBookmark = () => {
            if(newBookmark){
                setBookmarks([...bookmarks, newBookmark]);
            }
        }

        return(
            <Animated.View style={{flex: 1, position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', translateY : bounceValue,}}>
                <Octicons name={"bookmark"} size={30} color={props.viewBookmarks ? Colors.brand : Colors.tertiary} 
                        onPress={() => {setViewBookmarks(!props.viewBookmarks)}} style={{position: 'relative', top: 0}}/>
                <View style={{ postion: 'absolute', width: '100%', height: 60}}>
                    <MyTextInput 
                    icon="bookmark"
                    placeholder="Add bookmark."
                    rightIcon="add-circle"
                    value={newBookmark}
                    onChangeText={e => {setNewBookmark(e)}}
                    onpress={() => addBookmark()}
                    />
                </View>
                {
                bookmarks.length >= 1 && <BookmarkLink url={bookmarks[0]}/>   
                }
                {
                bookmarks.length >= 2 && <BookmarkLink url={bookmarks[1]}/>  
                }
                {
                bookmarks.length >= 3 && <BookmarkLink url={bookmarks[2]}/>  
                }
                {
                bookmarks.length > 0 && 
                <View style={{ flex: 1, height: 30, marginTop: 30}}>
                <Ionicons name={"reorder-three"} size={30} color={props.viewBookmarks ? Colors.brand : Colors.tertiary} 
                onPress={() => {setBookmarkList(!bookmarkList)}} />
                </View>
                }
            </Animated.View>
        )
        
    }

    const BookmarkLink = (props : Props) => {

        const [readonly, setReadonly] = useState(false);

        const pickerRef = useRef(0);

        const [selected, setSelectedValue] = useState("");

        useEffect(() => {
            (async () => {
                if(selected == 'Copy'){
                    Clipboard.setString(props.url);
                }else if(selected == 'Delete'){
                    await setBookmarks(bookmarks.filter(function(url) {
                        return url != props.url;
                    }))
                }
            })()
        },[selected])

        function open() {
            pickerRef.current.focus();
        }

        function close() {
            pickerRef.current.blur();
        }

        return(
            <View style={{width: '100%', height: 60}}>
                <MyTextInput 
                    icon="bookmark"
                    rightIcon="reorder-three"
                    onpress={() => {
                        if(pickerRef.current){
                            open();
                        }else{
                            close();
                        }
                    }}
                    defaultValue={`${props.url}`}
                    editable={readonly}
                    style={{ backgroundColor : 'white', borderWidth: 2, borderColor: `${Colors.secondary}`}}
                />
                <View style={{ position: 'absolute', bottom: -30, right: 60}}>
                <SelectedPicker
                    ref={pickerRef}
                    mode="dropdown"
                    selectedValue={selected || undefined}
                    onValueChange={(value) => {setSelectedValue(value)}}
                    dropdownIconColor={`white`}
                >
                <SelectedPicker.Item label="Options" value=""/>    
                <SelectedPicker.Item label="Copy" value="Copy"/>
                <SelectedPicker.Item label="Delete" value="Delete" />
                </SelectedPicker>
            </View>
            </View>
        )
    }


    return (
        <StyledContainer>
            <Modal
            animated
            animationType="slide"
            visible={bookmarkList}
            >
                <View style={{ flex: 1, alignItems: 'center', height: '100%', width: '100%'}}>
                <ScrollView style={{ flex: 1, height: '90%', width: '100%' }}  contentContainerStyle={{ flexGrow: 1 }}>
                    {bookmarks.map((val, index) => (
                     <BookmarkLink url={val} key={index} /> 
                    ))}
                </ScrollView>
                <Ionicons name={"chevron-down"} size={30} onPress={() => {setBookmarkList(!bookmarkList); setViewBookmarks(!viewBookmarks);}} style={{position: 'relative', bottom: 0,}}/>
                </View>
            </Modal>
            <InnerContainer style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>    
                <Formik
                initialValues={{url: ''}}
                onSubmit={(values) => {
                getURL(values)
                }}
                >
                {({handleChange, handleBlur, handleSubmit, values}) => (
                <StyledFormArea
                style={{ flex: 1, top: 150}}
                >
                    <MyTextInput   
                    icon="link"
                    onChangeText={handleChange('url')}
                    onBlur={handleBlur('url')}
                    value={values.url}
                    placeholder="Enter Recipe URL Here"
                    leftColor={Colors.brand}
                    rightColor={Colors.tertiary}
                    />
                    <StyledButton
                    onPress={handleSubmit}
                    >
                    <ButtonText>Get Recipe</ButtonText>
                    </StyledButton>
                </StyledFormArea>)}
                </Formik>
                <BookmarkView viewBookmarks={viewBookmarks}/>
            </InnerContainer>
        </StyledContainer>
    )   

}

const MyTextInput = ({label, icon, rightIcon, onpress, leftColor, rightColor, background, ...props} : Props) => {
  return  (
    <View>
    <LeftIcon>
        <Octicons name={icon} size={30} color={leftColor} />
    </LeftIcon>
      <StyledTextLabel>{label}</StyledTextLabel>
      <StyledTextInput  style={{color: background ? `${Colors.secondary}` :`${Colors.tertiary}` }} {...props}/>
      {rightIcon && (
        <RightIcon onPress={onpress}>
          <Ionicons name={rightIcon} size={30} color={rightColor}/>
        </RightIcon>
      )}
    </View> 
  )
}

export default ImportRecipe;