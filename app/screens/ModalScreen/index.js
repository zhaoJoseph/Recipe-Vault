import React , {useEffect} from 'react';

import {Text, View, Button} from 'react-native';

import {Formik} from 'formik';

import {Octicons, Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import {Colors} from '../../Constants/Colors';

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
} from '../../components/styles.js';


function ModalScreen({ navigation, route }) {

    const handleAdd = (data) => {
        route.params.onReturn(data);
        navigation.navigate("CreateStack", {
        screen: "IngredientStep",})
    }

  return (
      <StyledContainer>
            <InnerContainer>
                <Formik
                initialValues={{ingredient: '', quantity: ''}}
                onSubmit={(values) => {
                      handleAdd(values);
                      }}
                >
                {({handleChange, handleBlur, values, handleSubmit}) => (
                    <StyledFormArea>
                        <MyTextInput
                        label="Ingredient Name"
                        font={<FontAwesome name="book" size={30} color={Colors.brand} />}
                        onChangeText={handleChange('ingredient')}
                        onBlur={handleBlur('ingredient')}
                        value={values.ingredient}
                        placeholderTextColor={Colors.darklight}
                        />
                        <MyTextInput
                        label="Quantity"
                        font={<FontAwesome name="spoon" size={30} color={Colors.brand} />}
                        onChangeText={handleChange('quantity')}
                        onBlur={handleBlur('quantity')}
                        value={values.quantity}
                        placeholderTextColor={Colors.darklight}
                        />
                      <StyledButton
                      onPress={handleSubmit}
                      >
                        <ButtonText>Add Ingredient</ButtonText>
                      </StyledButton>
                    </StyledFormArea>
                )}
                </Formik>
                <Button onPress={() => navigation.goBack()} title="Cancel" />
            </InnerContainer>
        </StyledContainer> 
  );
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

export default ModalScreen;