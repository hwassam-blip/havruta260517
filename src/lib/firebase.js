import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Vercel 환경변수 오류를 원천 차단하기 위해 설정값을 직접 입력합니다.
const firebaseConfig = {
    apiKey: "AIzaSyChdTKeNpT_PekyVGfADTBpu3mehACRAO0",
    authDomain: "test-havruta-260517.firebaseapp.com",
    projectId: "test-havruta-260517",
    storageBucket: "test-havruta-260517.firebasestorage.app",
    messagingSenderId: "560423751",
    appId: "1:560423751:web:b04efbc6c4764b3ed22262"
};

// 파이어베이스 앱 초기화
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 데이터베이스(Firestore) 및 인증(Auth) 연결 객체
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
