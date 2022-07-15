import React, {useEffect, useState} from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom';
import {updateDoc, doc} from 'firebase/firestore'
import {db} from '../firebase/firebase.config'
import { toast } from 'react-toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

export const Profile = () => {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser ? auth.currentUser.displayName : '',
    email: auth.currentUser ? auth.currentUser.email : ''
  });

  const [changeDetails, setChangeDetails] = useState(false);

  const {name, email} = formData;
  
  const navigate = useNavigate();
  const handleClick = ()=>{
    auth.signOut();
    navigate('/');
    
  }

  const onSubmit = async ()=>{
    try {
      if(auth.currentUser.displayName !== name){
        //update displayName in firebase
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        //Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name
        })
      }
    } catch (error) {
      toast.error('Something get wrong updating your Profile, try again');
    }
  }

  const onChange= (e)=>{
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }  

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button 
        className='logOut'
        type='button'
        onClick={handleClick}>LogOut</button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p className="changePersonalDetails" onClick={()=>{
            changeDetails && onSubmit();;
            setChangeDetails((prevState) => !prevState)
          }}>
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input 
            type="text"
            id="name"
            className={!changeDetails ? 'profileName' : 'profileNameActive'}
            disabled={!changeDetails} 
            value={name}
            onChange={onChange}/>

            <input 
            type="text"
            id="email"
            className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
            disabled={!changeDetails} 
            value={email}
            onChange={onChange}/>            
          </form>
        </div>

        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt = 'Home' />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right"/>
        </Link>
      </main>
    </div>
  );
}