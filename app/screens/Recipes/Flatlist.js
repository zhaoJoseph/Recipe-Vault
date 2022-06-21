import React, {useEffect, useState, Component} from 'react';

import { View, Text, VirtualizedView, TouchableOpacity, ActivityIndicator, SafeAreaView, ToastAndroid } from 'react-native';

import {Colors, Links} from '../../Constants';

import {Octicons } from '@expo/vector-icons';

import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';

import {getToken} from '../../helpers';

import {
    StyledFormArea, 
    StyledContainer,
    InnerContainer,
    LeftIcon,
    StyledSearchBar,
    GridContainer,
    RecipeContainer,
    StyledFlatList,
    FloatingButton,
    ButtonView,
    } from '../../components/styles.js';

import RecipeItem from './RecipeItem';

class Flatlist extends Component {

    constructor() {
        super();

        this.state = {
          data: [],
          listEnd: false,
          lastItem: "",
          moreLoading: false,
          refreshing : false,
          enable: true,
        };

        this.setScrollEnabled = this.setScrollEnabled.bind(this);

    }

    async componentDidMount() {
        await this.fetchResult();
    }

    fetchResult = async (query) => {

        const url = Links.recipesList;

        const searchURL = Links.listSearch;

        let searchTerm;

        if(query && 'term' in query){
            searchTerm = query.term ? query.term : "_empty";
        }

        if(searchTerm && typeof searchTerm === 'string'){
            await this.setState({
                    listEnd: false,
                    data: [],
                    lastItem: "",
                });
        }

        if(!this.state.listEnd && !this.state.moreLoading) {

            this.setState({
                moreLoading: true,
            });

            var queryURL = (searchTerm && typeof searchTerm === 'string' && searchTerm != '_empty') ? searchURL : url;

                let token;
                try{    
                    token = await getToken();
                    id = await AsyncStorage.getItem('id');
                    id = JSON.parse(id);
                    var headers = {
                        "Content-Type": "application/json",
                        'Authorization' : `Bearer ${token}`};
                    let params;
                    if(searchTerm && searchTerm != '_empty'){
                        params = {
                            id: id,
                            current: this.state.lastItem,
                            term: searchTerm,
                        }
                    }else{
                        params = {
                            id: id,
                            current: this.state.lastItem,
                        }
                    }
                       axios.get(queryURL, 
                    {
                        headers: headers,
                        params: params,
                    })
                    .then((res) => {
                        token = null;
                        if(res.data._end){

                            this.setState({
                                data: [...this.state.data, ...res.data.list],
                                listEnd: true,
                                moreLoading: false,
                                refreshing: false,
                            })

                        }else{
                            this.setState({
                                data: [...this.state.data, ...res.data.list],
                                moreLoading: false,
                                lastItem: res.data._tail,
                                refreshing: false,
                            })
                
                        }
                    }).catch((error) => {
                        token = null;
                        console.log(error);
                        this.props.navigation.navigate("Home");
                    })
            
                }catch(err){
                    console.log(err);
                    this.props.navigation.navigate("Home");
                }  
        }
    };

    removeFromList = (data, item) => {
        try{
            this.setState({
                refreshing: true,
            })

            var items = [];
            for(var obj of this.state.data){
                if(obj.id != item){
                    items.push(obj);
                }
            }
            let newLast;
            if(this.state.lastItem == item){
                if(response.data.head){
                    newLast = data.head;
                }else{
                    newLast = "";
                }
            }else{
                newLast = this.state.lastItem;
            }

            this.setState({
                lastItem: newLast,
                data: items,
                refreshing: false,
            })  

            this.notifyMessage(data.message);
        }catch(err){
            console.log(err);
        }
        
    }

    notifyMessage(msg) {   
        if (Platform.OS === 'android') {
          ToastAndroid.show(msg, ToastAndroid.SHORT)
        } else {
          AlertIOS.alert(msg);
        }
    }


    renderItem = ({item, index}) => {
    
            return (
                <RecipeItem 
                item={item} 
                navigation={this.props.navigation} 
                setScrollEnabled={enable => this.setScrollEnabled(enable)} 
                index={index}
                removeFromList={(data, item) => this.removeFromList(data, item)}
                />
                )
        };
    
    getItemLayout = (data, index) => {
        return { length: 100, offset: 100 * Math.floor(index / 2), index}
    };

    renderEmpty = () => {

        return(
            <Text
            style={{
                textAlign: 'center',
            }}> Created recipes will show up here! </Text>
        )
    }

    handleRefresh = () => {
        this.setState(
            {
            refreshing: true,
            },
            () => {
                this.fetchResult();
            }
        )
    }

    renderFooter = () => {

        return(
            <View
            style={{
                height: 10,
            }}
            >
                {this.state.moreLoading && <ActivityIndicator size='large' />}
            </View>
        )
    }

    setScrollEnabled(enable) {
        this.setState({
          enable,
        });
      }

      render(){
          return (
          <StyledFlatList
            numColumns={2}
            keyboardShouldPersistTaps="always"
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            getItemLayout={this.getItemLayout}
            renderItem={this.renderItem}
            ListEmptyComponent={this.renderEmpty}
            ListFooterComponent={this.renderFooter}
            onEndReached={this.fetchResult}
            onEndReachedThreshold={0.01}
            data={this.state.data}
            keyExtractor={item => item.id}
            scrollEnabled={this.state.enable}
            extraData={this.state.refreshing}
          />
          );
      };
  }

  export default Flatlist;