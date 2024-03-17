import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Toast from 'react-native-toast-message'
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export const login = createAsyncThunk(
    "auth/login",
    async(config) => {
        
        return auth().signInWithEmailAndPassword(config.email, config.password)
        .then(async({user}) => {
            const userId = user.uid;
            const userRef = database().ref(`/users/${userId}`);

            return userRef.once('value')
            .then(async snapshot => {
                return await snapshot.val()
            })
        })
        .catch((err) => {
            
            Toast.show({
                type: 'error',
                text1: 'Oops',
                text2: `${err.message} 👋`
            })
            return err
        })
    }
)

const AuthSlice = createSlice({
    name: 'auth',
    initialState: {
        userLoggedIn: false,
        loading: false,
        data: {},
        packageBought: false,
        token: "",
    },
    reducers: {
        logout(state){
            state.userLoggedIn = false
            state.loading = false
            state.data = {}
            state.token = ""
            state.packageBought = false
        },
        signup(state, action){
            state.userLoggedIn = action.payload.success
            state.token = action.payload.token
            state.data = action.payload.data
        },
        updateUserData(state, action){
            state.data = action.payload
        },
        makeLoadingFalse(state, action){
            state.loading = false
        },
        setPackageBought(state, action){
            state.packageBought = action.payload
        }
    },
    extraReducers(builder){
        builder.addCase(login.pending, (state, action) => {
            state.loading = true
            
        }).addCase(login.fulfilled, (state, action) => {            
            state.loading = false
            if(action.payload?.userId?.length > 0){
                state.userLoggedIn = true
                state.token = action.payload?.userId
                state.data = action.payload
            }
            
        }).addCase(login.rejected, (state, action) => {
            state.loading = false

        })
    }
})

export const {logout, updateUserData, makeLoadingFalse, setPackageBought, signup} = AuthSlice.actions;
export default AuthSlice.reducer;