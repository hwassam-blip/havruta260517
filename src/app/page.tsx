"use client";
import React, { useState, useEffect } from 'react';
import SidebarLeft from './components/SidebarLeft';
import Feed from './components/Feed';
import SidebarRight from './components/SidebarRight';
import DetailModal from './components/DetailModal';
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Home() {
    const [isEntered, setIsEntered] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [comments, setComments] = useState([]);
    const [currentFilter, setCurrentFilter] = useState(null);
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);

    // 파이어베이스 데이터베이스 실시간 연동 (onSnapshot)
    useEffect(() => {
        // 데이터베이스가 연결되어있지 않은 상태(키가 없는 상태)면 에러 방지
        if (!db) return;

        try {
            // 질문 데이터 구독 (최신순)
            const qQuery = query(collection(db, "questions"), orderBy("createdAt", "desc"));
            const unsubscribeQ = onSnapshot(qQuery, (snapshot) => {
                const qData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    // 화면 표시를 위해 파이어베이스 시간 형식을 문자열로 변환
                    createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
                }));
                setQuestions(qData);
            });

            // 답변 데이터 구독 (오래된 순)
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

    // 유니크 키워드 추출
    const allKeywords = Array.from(new Set(questions.flatMap(q => q.keywords || [])));

    // 파이어베이스 클라우드에 새 질문 등록
    const handlePostQuestion = async (content, keywordsString, authorName) => {
        if (!db) {
            alert("아직 파이어베이스 키가 입력되지 않아서 글을 저장할 수 없습니다!");
            return;
        }

        let keywordsArray = [];
        if (keywordsString) {
            keywordsArray = keywordsString.split(/\s+/).map(kw => kw.startsWith('#') ? kw : `#${kw}`);
        }
        
        try {
            await addDoc(collection(db, "questions"), {
                authorName: authorName,
                content,
                keywords: keywordsArray,
                createdAt: serverTimestamp() // 파이어베이스 서버의 정확한 시간 저장
            });
        } catch (e) {
            alert("질문 등록에 실패했습니다. " + e.message);
        }
    };

    // 파이어베이스 클라우드에 새 답변 등록
    const handlePostComment = async (questionId, content, authorName) => {
        if (!db) {
            alert("아직 파이어베이스 키가 입력되지 않아서 답변을 저장할 수 없습니다!");
            return;
        }

        try {
            await addDoc(collection(db, "comments"), {
                questionId,
                authorName: authorName,
                content,
                createdAt: serverTimestamp()
            });
        } catch (e) {
            alert("답변 등록에 실패했습니다. " + e.message);
        }
    };

    // 화면 필터링
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
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        입장하기
                    </button>
                </div>
            </div>
        );
    }

    // 메인 화면
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header */}
            <header className="app-header glass-panel-header">
                <div className="header-content">
                    <h1 className="logo">Q&A <span>Space</span></h1>
                    <div className="user-profile">
                        <div className="avatar" style={{ background: '#22c55e' }}>✨</div>
                        <span className="username">LIVE 연동됨</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
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

            {/* Modal */}
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
