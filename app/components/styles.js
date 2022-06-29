import styled from 'styled-components/native';
import Constants from 'expo-constants';
import { FlatList } from 'react-native-gesture-handler';
import {View, Text, Image, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import {Colors} from '../Constants/Colors';

export const StyledContainer = styled.View`
    flex: 1;
    padding: 25px;
    height: 100%;
    width: 100%;
    justifyContent: center;
`

export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    height: 100%;
    align-items: center;
`;

export const PageLogo = styled.Image`
    width: 50px;
    height: 50px;
`;

export const PageTitle = styled.Text`
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    color: ${Colors.brand}; 
`;

export const PageSubTitle = styled.Text`
    font-size: 18px;
    margin-bottom: 20px;
    letter-spacing: 1px;
    font-weight: bold;
    color: ${Colors.tertiary};
`;

export const StyledFormArea = styled.View`
    width: 90%;
`;

export const StyledTextLabel = styled.Text`
font-weight: bold;
color: ${Colors.tertiary};
font-size: 13px;
text-align: left;
`

export const StyledTextInput = styled.TextInput`
    background-color: ${Colors.secondary};
    padding: 15px;
    padding-left: 55px;
    padding-right: 5px;
    border-radius: 5px;
    font-size: 16px;
    height: 60px;
    margin-vertical: 3px;
    margin-bottom: 10px;
    color: ${Colors.tertiary};
`;

export const StyledInputArea = styled.TextInput`
    color: ${Colors.tertiary};
    font-size: 13px;
    text-align: left;

`;

export const LeftIcon = styled.View`
    left: 15px;
    top: 30px;
    position: absolute;
    z-index: 1;
`;

export const CenterIcon = styled.View`
    position: absolute;
    z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
    right: 20px;
    top: 35px;
    position: absolute;
    z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
    padding: 15px;
    background-color: ${Colors.brand};
    justify-content: center;
    flex-direction: row;
    align-items: center;
    border-radius: 5px;
    margin-vertical: 5px;
    height: 60px;
`

export const ButtonText = styled.Text`
    color: ${Colors.primary};
    font-size: 16px;
`

export const ExtraView = styled.View`
    justify-content: center;
    flex-direction: row;
    align-items: center;
    padding: 10px;
`;

export const ExtraText = styled.Text`
    font-weight: bold;
    justify-content: center;
    align-content: center;
    color: ${Colors.tertiary};
    font-size: 16px;
`;

export const TextLink = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
`;

export const TextLinkContent = styled.Text`
    color: ${Colors.brand};
    font-size: 15px;
`;

export const StyledSearchBar = styled.TextInput`
    background-color: ${Colors.tint};
    height: 60px;
    paddingLeft: 50px;
    color: ${Colors.tertiary};
`;

export const RecipeContainer = styled.TouchableOpacity`
    background-color: 'transparent';
    minHeight: 100px;
    border-radius: 5px;
    margin: 5px;
`;


export const StyledFlatList = styled.FlatList.attrs(() => ({
    contentContainerStyle: {
        flexDirection: 'column',
    },
}))`
    height: 90%;
    width: 100%;
    margin: 10px;
    marginBottom: 90px;
`;

export const FloatingButton = styled.TouchableOpacity`
    position: absolute;
    bottom: 0;
    right: 20px;
    background-color: ${Colors.brand};
    alignSelf: flex-end;
    alignItems: center;
    justifyContent: center;
    width: 50px;
    height: 50px;
    border-radius: 25px;
`;

export const IngredientContainer = styled.View`
    position: relative;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    width: 100%;
    marginBottom: 10px;
`;

export const StyledTextInputLarge = styled.TextInput`
    background-color: ${Colors.secondary};
    border-radius: 5px;
    font-size: 16px;
    height: 300px;
    textAlignVertical: top;
    marginBottom: 5px;
    color: ${Colors.black};
`;
