import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import auth from '../../../utils/firebase.config';

const initialState = {
  name: '',
  email: '',
  isLoading:true,
  isError:false,
  error:''
};

export const createUser = createAsyncThunk('userSlice/createUser',
async({email,password,name})=>{
  const data = await createUserWithEmailAndPassword(auth,email,password);
  // console.log(data);
  await updateProfile(auth.currentUser,{
    displayName:name
  })
  return {
    name:data.user.displayName,
    email:data.user.email
  }
})

export const signInUser = createAsyncThunk('userSlice/signInUser',async ({email,password})=>{
  const data = await signInWithEmailAndPassword(auth,email,password);
  console.log(data);
  return {
    email:data.user.email,
    name:data.user.displayName
  }
})

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUser:(state,action)=>{
     state.name = action.payload.name;
     state.email = action.payload.email
    },
    toggleLoading:(state,action)=>{
      state.isLoading = action.payload
    },
    logOut:(state)=>{
      state.name='',
      state.email = ''
    }
  },
  extraReducers:(builder) =>{
    builder.addCase(createUser.pending,(state)=>{
      state.isLoading = true;
      state.isError = false;
      state.name = '';
      state.email = ''
      state.error=''
    }).addCase(createUser.fulfilled,(state,action)=>{
      state.isLoading = false;
      state.isError = false;
      state.name = action.payload.name;
      state.email = action.payload.email
      state.error=''
    }).addCase(createUser.rejected,(state,action)=>{
      state.isLoading = false;
      state.isError = true;
      state.name = '';
      state.email = ''
      state.error=action.error.message
    })
    builder.addCase(signInUser.pending,(state)=>{
      state.isLoading = true;
      state.isError = false;
      state.name = '';
      state.email = ''
      state.error=''
    }).addCase(signInUser.fulfilled,(state,action)=>{
      state.isLoading = false;
      state.isError = false;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.error=''
    }).addCase(signInUser.rejected,(state,action)=>{
      state.isLoading = false;
      state.isError = true;
      state.name = '';
      state.email = '';
      state.error=action.error.message
    })
  }
});

export const  {setUser,toggleLoading,logOut} = userSlice.actions;

export default userSlice.reducer;
