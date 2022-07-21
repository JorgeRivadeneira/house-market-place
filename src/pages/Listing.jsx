import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {doc, getDoc} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase/firebase.config'
import { Spinner } from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import { list } from 'firebase/storage'

export const Listing = () => {

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(null)

    const navigate = useNavigate();
    const params = useParams();
    const auth = getAuth();

    useEffect(()=>{
        const fetchListing = async()=>{
            const docRef = doc(db,'listings',params.listingId);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                console.log(docSnap.data());
                setListings(docSnap.data());                
                setLoading(false);
            }
        }
        fetchListing();
    }, [navigate, params.listingId]);

    if(loading){
        return <Spinner />
    }


  return (
    <main >
        {/** MAP */}
        <div className='shareIconDiv' onClick={()=>{
            navigator.clipboard.writeText(window.location.href);
            setShareLinkCopied(true);
            setTimeout(()=>{
                setShareLinkCopied(false);
            }, 2000);
        }}>
            <img src={shareIcon} alt=''/>
        </div>

        {shareLinkCopied && <p  className='linkCopied'>Link Copied!</p>}
        <div className="listingDetails">
            <p className="listingName">
                {listings?.name} - $
                {listings?.offer
                    ? listings.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : listings?.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </p>
            <p className="listingLocation">{listings?.location}</p>
            <p className="listingType">
                For {listings?.type === 'rent' ? 'Rent' : 'Sale'}
            </p>
            {listings?.offer && (
                <p className="discountPrice">
                    ${listings?.regularPrice - listings?.discountedPrice}
                    discount
                </p>
            )}

            <ul className="listingDetailsList">
                <li>
                    {listings?.bedrooms > 1
                    ? `${listings?.bedrooms} Bedrooms`
                    : '1 Bedroom'}
                </li>
                <li>
                    {listings?.bathrooms > 1
                    ? `${listings?.bathrooms} Bathrooms`
                    : '1 Bathroom'}
                </li>  
                <li>{listings?.parking && 'Parking Spot'}</li>              
                <li>{listings?.furnished && 'Furnished'}</li>   
            </ul>
            <p className="listingLocationTitle">Location</p>
            {/**MAP */}

            {auth.currentUser?.uid !== listings?.userRef && (
                <Link 
                    to={`/contact/${listings?.userRef}?listingName=${listings?.name}`}
                    className='primaryButton'
                    >
                    Contact landlord
                </Link>
            )}
        </div>

    </main>
  )
}
