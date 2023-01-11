import React, {useEffect, useState} from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom';
import {updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc} from 'firebase/firestore'
import {db} from '../firebase/firebase.config'
import { toast } from 'react-toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import listingItem from '../components/ListingItems'

export const Profile = () => {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [formData, setFormData] = useState({
    name: auth.currentUser ? auth.currentUser.displayName : '',
    email: auth.currentUser ? auth.currentUser.email : ''
  });

  const [changeDetails, setChangeDetails] = useState(false);

  const {name, email} = formData;
  
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchUserListings = async () => {
      const listingRefs = collection(db, 'listings');

      const q = query(
        listingRefs,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );

      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

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

  const onDelete = async (listingId) => {
    if(window.confirm('Are you sure you want to delete?')){
      await deleteDoc(doc(db, 'listings', listingId));
      const updatedList = listings.filter((listing) => listing.id !== listingId);
      setListings(updatedList);
      toast.success('Successfully deleted listing');
    }
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

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">
              Your Listings...
            </p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <listingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}