import React, {useState, useContext} from 'react';

import {View} from 'react-native';

import {Octicons, Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import { Formik } from 'formik';

import {Colors} from '../../Constants/Colors';

import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';

import NumberPlease from "digicard-react-native-number-please";

import {recipeContext} from '../../Context/recipeContext';

import {StyledContainer, 
        InnerContainer,
        StyledFormArea,
        LeftIcon,
        StyledTextLabel,
        StyledTextInput,
        ButtonText,
        StyledButton,
} from '../../components/styles.js';

const Create = ({navigation}) => {

    const {recipe, setRecipe} = useContext(recipeContext);


    const time = [{id: "hours", label: "Hrs", min: 0, max: 24 }, {id: "minutes", label: "Mins", min: 0, max: 59},];

    const initialTime = { hours: 0, minutes: 0 };

    const [PrepTime, SetPrepTime] = useState(initialTime);

    const [CookTime, SetCookTime] = useState(initialTime);

    const handleCreate = (values) => {
      setRecipe({...recipe, 
      title: values.name,
      prep: PrepTime,
      cook: CookTime,
      servings: values.serve
      });
      navigation.navigate("CreateStack", {screen: 'IngredientStep'});
    } 

    return (   
        <KeyboardAvoidingWrapper>
        <StyledContainer>
            <InnerContainer>
                <Formik
                initialValues={{name: '', }}
                onSubmit={(values) => {
                      handleCreate(values);
                      }}
                >
                {({handleChange, handleBlur, values}) => (
                    <StyledFormArea>
                        <MyTextInput
                        label="Set the name of your delicious recipe!"
                        font={<FontAwesome name="book" size={30} color={Colors.brand} />}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        value={values.name}
                        placeholderTextColor={Colors.darklight}
                        />
                        <StyledTextLabel>Prep Time</StyledTextLabel>
                        <NumberPlease
                        pickers={time}
                        values={PrepTime}
                        onChange={(timeValues) => SetPrepTime(timeValues)}
                        />
                        <StyledTextLabel>Cook Time</StyledTextLabel>
                        <NumberPlease
                        pickers={time}
                        values={CookTime}
                        onChange={(timeValues) => SetCookTime(timeValues)}
                        />
                        <MyTextInput
                        label="Servings"
                        font={<FontAwesome name="spoon" size={30} color={Colors.brand} />}
                        onChangeText={handleChange('serve')}
                        onBlur={handleBlur('serve')}
                        value={values.serve}
                        keyboardType='numeric'
                        placeholderTextColor={Colors.darklight}
                        />
                      <StyledButton
                      onPress={handleCreate}
                      >
                        <ButtonText>List Ingredients</ButtonText>
                      </StyledButton>
                    </StyledFormArea>
                )}
                </Formik>
            </InnerContainer>
        </StyledContainer> 
        </KeyboardAvoidingWrapper>
    )
}

const MyTextInput = ({label, font, ...props}) => {
  return  (
    <View>
      <LeftIcon>
        {font}
      </LeftIcon>
      <StyledTextLabel>{label}</StyledTextLabel>
      <StyledTextInput {...props}/>
    </View> 
  )
}

export default Create;