import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore'
import {db} from '../firebase/firebase.config'
import {toast} from 'react-toastify'
import { Spinner } from "../components/Spinner"
import { ListingItems } from "../components/ListingItems"

export const Category = () => {

    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);

    const params = useParams();

    useEffect(()=>{
        const fetchListings = async()=>{
            try {
                //get reference
                const listingsRef = collection(db, 'listings');

                console.log(params);

                //create a query
                //categoryName = :category (app.js)
                const q = query(listingsRef, 
                where('type', '==', params.categoryName),
                orderBy('timestamp', 'desc'),
                limit(10))

                //execute query
                const querySnaps = await getDocs(q);

                const listings = [];
                querySnaps.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings(listings);
                setLoading(false);

            } catch (error) {
                toast.error("Couldn't fetch listings: " + error);
            }
        }
        fetchListings();
    },[params.categoryName])

  return (
    <div className="category">
        <header>
            <p className="pageHeader">
                {params.categoryName === 'rent' ? 
                'Places for rent' : 
                'Places for sell'}
            </p>
        </header>

        {loading ? (<Spinner /> ) : listings && listings.length > 0 ? (
            <>
                <main>
                    <ul className="categoryListings">
                        {listings.map((listing) => (
                            <ListingItems
                                id={listing.id}
                                listing={listing.data}
                                key={listing.id}
                            />
                        ))}
                    </ul>
                </main>
            </>
        ) : <p>No Listings for {params.categoryName}</p>}
    </div>
  )
}
