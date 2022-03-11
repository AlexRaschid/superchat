import firebase from 'firebase/compat/app'

import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import useState from 'react'
import './App.css';


firebase.initializeApp({
    apiKey: "AIzaSyCLOwqBrL3GGEP8gW0khyYcmno4yveddFo",
    authDomain: "superchat-cca07.firebaseapp.com",
    projectId: "superchat-cca07",
    storageBucket: "superchat-cca07.appspot.com",
    messagingSenderId: "257973539012",
    appId: "1:257973539012:web:4afb72534b9b7453a23991",
    measurementId: "G-V28B3K0STK"
});

const auth = firebase.auth();
const firestore = firebase.firestore();


export default App => {
    const [user] = useAuthState(auth);

    return (
        <div className="App">
        <header>
            <h1>⚛️🔥💬</h1>
            <SignOut />
        </header>

        <section>
            {user ? <ChatRoom /> : <SignIn />}
        </section>

    </div>
    )
}


function SignIn(){
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    )
}

function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>Sign Out</button>
    )
    
}

function ChatRoom() {
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query, {idField: 'id'});

    const [formValue, setFormValue] = useState('');

    const sendMessage = async(e) => {
        e.preventDefault();
        const {uid, photoURL} = auth.currentUser;

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        });

        setFormValue('');
    }



    return (<>
        <div>
            {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
        </div>
        <form onSubmit={sendMessage}>
    
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
    
          <button type="submit" disabled={!formValue}>🕊️</button>
    
        </form>
      </>)

}

function ChatMessage(props){
    const {text, uid, photoURL} = props.message;
    
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
        <div className={`message ${messageClass}`}>
            <img src={photoURL}/>
            <p>{text}</p>
        </div>
    )
}