"use client";
import React, { useState, useEffect } from 'react';
import SidebarLeft from './components/SidebarLeft';
import Feed from './components/Feed';
import SidebarRight from './components/SidebarRight';
import DetailModal from './components/DetailModal';
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth, provider } from "../lib/firebase";

export default function Home() {
    const [isEntered, setIsEntered] = useState(false);
    const [user, setUser] = useState(null); // 로그인한 유저 상태
    const [questions, setQuestions] = useState([]);
    const [comments, setComments] = useState([]);
    const [currentFilter, setCurrentFilter] = useState(null);
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);

    // 파이어베이스 인증(로그인) 상태 실시간 감지
    useEffect(() => {
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // 파이어베이스 데이터베이스 실시간 연동
    useEffect(() => {
        if (!db) return;

        try {
            const qQuery = query(collection(db, "questions"), orderBy("createdAt", "desc"));
            const unsubscribeQ = onSnapshot(qQuery, (snapshot) => {
                const qData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
                }));
                setQuestions(qData);
            });

            const cQuery = query(collection(db, "comments"), orderBy("createdAt", "asc"));
            const unsubscribeC = onSnapshot(cQuery, (snapshot) => {
                const cData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
                }));
                setComments(cData);
            });

            return () => {
                unsubscribeQ();
                unsubscribeC();
            };
        } catch (error) {
            console.error("Firebase 연결 중 오류 발생:", error);
        }
    }, []);

    const allKeywords = Array.from(new Set(questions.flatMap(q => q.keywords || [])));

    // 구글 로그인 버튼 클릭 시 실행
    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
            setIsEntered(true); // 로그인 성공 시 메인 화면으로 바로 이동!
        } catch (error) {
            console.error("로그인 에러:", error);
            alert("구글 로그인에 실패했습니다. 파이어베이스 콘솔 설정을 확인해주세요!");
        }
    };

    // 로그아웃 버튼 클릭 시 실행
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsEntered(false); // 로그아웃 시 랜딩 화면으로 추방!
        } catch (error) {
            console.error("로그아웃 에러:", error);
        }
    };

    // 파이어베이스 클라우드에 새 질문 등록 (구글 계정 이름 사용)
    const handlePostQuestion = async (content, keywordsString) => {
        if (!db || !user) {
            alert("로그인이 필요합니다!");
            return;
        }

        let keywordsArray = [];
        if (keywordsString) {
            keywordsArray = keywordsString.split(/\s+/).map(kw => kw.startsWith('#') ? kw : `#${kw}`);
        }
        
        try {
            await addDoc(collection(db, "questions"), {
                authorId: user.uid,
                authorName: user.displayName || "익명 학생",
                authorPhoto: user.photoURL || null,
                content,
                keywords: keywordsArray,
                createdAt: serverTimestamp()
            });
        } catch (e) {
            alert("질문 등록에 실패했습니다. " + e.message);
        }
    };

    // 파이어베이스 클라우드에 새 답변 등록 (구글 계정 이름 사용)
    const handlePostComment = async (questionId, content) => {
        if (!db || !user) {
            alert("로그인이 필요합니다!");
            return;
        }

        try {
            await addDoc(collection(db, "comments"), {
                questionId,
                authorId: user.uid,
                authorName: user.displayName || "익명 학생",
                authorPhoto: user.photoURL || null,
                content,
                createdAt: serverTimestamp()
            });
        } catch (e) {
            alert("답변 등록에 실패했습니다. " + e.message);
        }
    };

    const filteredQuestions = questions.filter(q => currentFilter ? (q.keywords || []).includes(currentFilter) : true);
    const selectedQuestion = questions.find(q => q.id === selectedQuestionId);
    const questionComments = comments.filter(c => c.questionId === selectedQuestionId);

    // 랜딩 페이지
    if (!isEntered) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                backgroundImage: 'url("/main-banner.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f8fafc'
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '3.5rem 4.5rem',
                    borderRadius: '24px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    backdropFilter: 'blur(10px)'
                }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', margin: 0, letterSpacing: '-0.02em' }}>학생 Q&A 플랫폼</h1>
                    <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                        친구들과 함께 모르는 것을 질문하고,<br />
                        서로 답변하며 성장하는 학습 공간
                    </p>
                    
                    {user ? (
                        // 이미 로그인 된 유저라면 게시판 입장 버튼 보임
                        <button 
                            className="btn-primary" 
                            style={{ 
                                padding: '1rem 3rem', 
                                fontSize: '1.2rem', 
                                fontWeight: 'bold',
                                borderRadius: '50px', 
                                background: '#4f46e5',
                                boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onClick={() => setIsEntered(true)}
                        >
                            게시판 입장하기
                        </button>
                    ) : (
                        // 로그인이 안 된 유저라면 구글 로그인 버튼 보임
                        <button 
                            style={{ 
                                padding: '0.8rem 1.5rem', 
                                fontSize: '1.1rem', 
                                fontWeight: 'bold',
                                borderRadius: '50px', 
                                background: '#ffffff',
                                color: '#3c4043',
                                border: '1px solid #dadce0',
                                boxShadow: '0 1px 3px 0 rgba(60,64,67,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onClick={handleLogin}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: '24px', height: '24px'}}/>
                            Google 계정으로 시작하기
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // 메인 화면
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <header className="app-header glass-panel-header">
                <div className="header-content">
                    <h1 className="logo">Q&A <span>Space</span></h1>
                    <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {user ? (
                            <>
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="프로필" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <div className="avatar" style={{ background: '#22c55e' }}>✨</div>
                                )}
                                <span className="username" style={{ fontWeight: '600' }}>{user.displayName}</span>
                                <button 
                                    onClick={handleLogout} 
                                    style={{ 
                                        background: 'transparent', 
                                        border: '1px solid #cbd5e1', 
                                        padding: '0.4rem 0.8rem', 
                                        borderRadius: '6px', 
                                        cursor: 'pointer', 
                                        fontSize: '0.85rem',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <span className="username">로그인이 필요합니다</span>
                        )}
                    </div>
                </div>
            </header>

            <main className="app-container">
                <SidebarLeft 
                    keywords={allKeywords}
                    currentFilter={currentFilter}
                    onFilterClick={(kw) => setCurrentFilter(currentFilter === kw ? null : kw)}
                />
                
                <Feed 
                    questions={filteredQuestions}
                    currentFilter={currentFilter}
                    onClearFilter={() => setCurrentFilter(null)}
                    onPostQuestion={handlePostQuestion}
                    onCardClick={(id) => setSelectedQuestionId(id)}
                    getCommentCount={(qId) => comments.filter(c => c.questionId === qId).length}
                />
                
                <SidebarRight />
            </main>

            {selectedQuestionId && (
                <DetailModal 
                    question={selectedQuestion}
                    comments={questionComments}
                    onClose={() => setSelectedQuestionId(null)}
                    onPostComment={handlePostComment}
                />
            )}
        </div>
    );
}
