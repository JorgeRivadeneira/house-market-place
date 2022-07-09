import { useNavigate, useLocation } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { setDoc, getDoc, doc, serverTimestamp} from "firebase/firestore"
import {db} from '../firebase/firebase.config'
import { toast } from "react-toastify"
import GoogleIcon from '../assets/svg/googleIcon.svg'

export const OAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async ()=>{
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user

      //CHeck for user
      const docRef = doc( db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      //If user doesn't exist, create user
      if(!docSnap.exists()){
        await setDoc(doc(db,'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp()
        })
      }
      navigate('/');
    } catch (error) {
      toast.error('Could not authorize with Google')
    }
  }

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === '/sign-up' ? 'Up' : 'In'} with </p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img className="socialIconImg" src={GoogleIcon} alt="Google" />
      </button>
    </div>
  )
}
