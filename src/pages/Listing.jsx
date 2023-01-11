import React, {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {doc, getDoc} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase/firebase.config'
import { Spinner } from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import { list } from 'firebase/storage'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import SwiperCore, {Navigation, Pagination, Scrollbar, A11y} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/css'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

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
        
        <Swiper slidesPerView={1} pagination={{clickable: true}}>
            {listings.imgUrls.map((url, index) => (
                <SwiperSlide key={index}>
                    <div style={{background: `url(${listings.imgUrls[index]}) center no-repeat`,
                    backgroundSize: 'cover'}}
                        className='swiperSlideSwip'>

                        
                    </div>
                </SwiperSlide>
            ))}

        </Swiper>

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
            
            <div className='leafletContainer'>
            <MapContainer
                style={{ height: '100%', width: '100%' }}
                center={[listings.geolocation.lat, listings.geolocation.lng]}
                zoom={13}
                scrollWheelZoom={false}
            >
                <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                />

                <Marker
                position={[listings.geolocation.lat, listings.geolocation.lng]}
                >
                <Popup>{listings.location}</Popup>
                </Marker>
            </MapContainer>
            </div>

            {auth.currentUser?.uid !== listings?.userRef && (
                <Link 
                    to={`/contact/${listings?.useRef}?listingName=${listings?.name}`}
                    className='primaryButton'
                    >
                    Contact landlord
                </Link>
            )}
        </div>

    </main>
  )
}


// https://stackoverflow.com/questions/67552020/how-to-fix-error-failed-to-compile-node-modules-react-leaflet-core-esm-pat