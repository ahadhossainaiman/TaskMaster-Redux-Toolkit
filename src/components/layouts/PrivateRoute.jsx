import { Navigate, useLocation } from 'react-router-dom';
import Loading from './Loading';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import auth from '../../utils/firebase.config';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, toggleLoading } from '../../redux/features/user/userSlice';

const PrivateRoute = ({ children }) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch()
  const {email,isLoading} = useSelector((state)=>state.userSlice)

console.log(email,isLoading);
  useEffect(()=>{
      onAuthStateChanged(auth,(user)=>{
        console.log(user);
        if(user){
          dispatch(setUser({
            name:user.displayName,
            email:user.email
          }))
        }else{
          dispatch(toggleLoading(false))
        }
        dispatch(toggleLoading(false))
      })
  },[])

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoading && !email) {
    return <Navigate to="/login" state={{ path: pathname }} />;
  }

  return children;
};

export default PrivateRoute;
