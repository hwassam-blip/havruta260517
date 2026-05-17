import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 선생님께서 발급받은 파이어베이스 설정값들이 들어갈 자리입니다.
// 프로젝트 보안을 위해 이 파일에 직접 넣지 않고, .env.local 파일에서 불러옵니다.
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// 파이어베이스 앱 초기화
let app;
if (firebaseConfig.projectId) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
}

// 데이터베이스(Firestore) 연결 객체 (키가 없으면 연결하지 않음)
export const db = app ? getFirestore(app) : null;
