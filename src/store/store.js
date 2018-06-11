import Vue from 'vue'
import Vuex from 'vuex'
import {getCurrentUser} from '../../server/index';

Vue.use(Vuex)

export const store = new Vuex.Store({
  // strict: true,
  state: {
   email:localStorage.getItem('email'),
   userLoggedIn : false,
   authStorageTokens : []
  },

  mutations: {

    // For purpose of displaying username after user logs in 
    setCurrentUsername(state,payload){
      state.email = payload.email;
      state.userLoggedIn = payload.isLoggedIn;
      state.userLoggedIn = true;
      localStorage.setItem('email',payload.email);
    },

    // All auth storage tokens will be reseted and as a
    // result there will be no tokens either in localStorage 
    // nor in store's state
    signOut(state){
      var tokensToRemove = state.authStorageTokens
      tokensToRemove.forEach((item,index) =>{
        localStorage.removeItem(item);
      })
      state.authStorageTokens = []
      state.userLoggedIn = false;
      localStorage.setItem('email',null);
    },

    // Storing up all auth storage tokens in store after user sign in
    setAuthStorageTokens(state,payload){
      var keysOfToken = Object.keys(payload.authStorageTokens);
      state.authStorageTokens = keysOfToken;
    },

    // Every time page refreshes, this mutation gets called
    // to check if user is logged in
    checkUserIsLoggedIn(state,payload){
      
      if(payload.userLoggedIn){
        state.userLoggedIn = payload.userLoggedIn;
        state.email = localStorage.getItem('email');
        state.userLoggedIn = true;
        var email = state.email
        
        // for getting all local storage tokens, calling
        // the API for getCurrentUser to get series of 
        // available tokens
        getCurrentUser(email).then((data) =>{
          
          var heapOfUnusedData = Object.keys(data.storage);
          var localTokens = [];
          heapOfUnusedData.forEach((item,index) => {

            // if it is token then it will have 3
            // parts seperated by '.'
            var tokenToCheck = item.split('.');
            if(tokenToCheck.length > 2){
              localTokens.push(item);
            } else{
              // do nothing
            }
          })
          state.authStorageTokens = localTokens
        })
        .catch((err) =>{
          console.log('Err:',err);
        })
      } else{

        // repeat sign out action if user is not logged in
        var tokensToRemove = state.authStorageTokens
        tokensToRemove.forEach((item,index) =>{
          localStorage.removeItem(item);
        })
        state.authStorageTokens = []
        state.userLoggedIn = false;
        localStorage.removeItem('email');
      }
    }
  }
})

