import React , {useEffect, useContext} from 'react';

import {Text, View, Button} from 'react-native';

import {Formik} from 'formik';

import {Octicons, Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import {Colors} from '../../Constants/Colors';

import {ingredientContext} from '../../Context/ingredientContext';

import * as yup from 'yup';

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


function ModalScreen({ navigation, route } : Props) {

    const handleAdd = (data) => {

      navigation.navigate("CreateStack", {screen: "IngredientStep", params: {mode: route.params.mode, ingredient : data, oldIngredient: route.params?.ingredient ? route.params?.ingredient : ""}})

    }

  return (
      <StyledContainer>
            <InnerContainer>
                <Formik
                initialValues={{ingredient: route.params.ingredient || '', quantity: route.params.quantity || ''}}
                onSubmit={(values) => {
                      handleAdd(values);
                      }}
                validationSchema={ingredientValidate}
                >
                {({handleChange, handleBlur, values, handleSubmit, touched, errors}) => (
                    <StyledFormArea>
                        <MyTextInput
                        label="Ingredient Name"
                        font={<FontAwesome name="book" size={30} color={Colors.brand} />}
                        onChangeText={handleChange('ingredient')}
                        onBlur={handleBlur('ingredient')}
                        value={values.ingredient}
                        placeholderTextColor={Colors.darklight}
                        />
                        {((errors.ingredient && touched.ingredient) && <Text style={{ fontSize: 10, color: 'red' }}>{errors.ingredient}</Text>)}
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

const ingredientValidate = yup.object().shape({
  ingredient: yup
    .string()
    .required("Ingredient name required."),
});

const MyTextInput = ({label, font, ...props} : Props) => {
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