import React, { useState } from 'react';

export default function Feed({
    questions,
    currentFilter,
    onClearFilter,
    onPostQuestion,
    onCardClick,
    getCommentCount
}: any) {
    const [content, setContent] = useState('');
    const [keywords, setKeywords] = useState('');

    const handlePost = () => {
        if (!content.trim()) {
            alert('질문 내용을 입력해주세요.');
            return;
        }
        onPostQuestion(content, keywords); // author 파라미터 삭제
        setContent('');
        setKeywords('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handlePost();
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ko-KR', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <section className="feed-section">
            <div className="question-composer glass-panel">
                <textarea
                    placeholder="공부하다가 막히는 부분이 있나요? 편하게 질문해보세요!"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <div className="composer-actions">
                    <input
                        type="text"
                        placeholder="키워드 입력 (예: #수학 #기말고사)"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                    />
                    <button className="btn-primary" onClick={handlePost}>질문 올리기</button>
                </div>
            </div>

            <div className="feed-header">
                <h2>{currentFilter ? `${currentFilter} 질문 모아보기` : '모든 질문'}</h2>
                {currentFilter && (
                    <button className="btn-text" onClick={onClearFilter}>필터 초기화 ✕</button>
                )}
            </div>

            <div className="question-list">
                {questions.length === 0 ? (
                    <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
                        작성된 질문이 없습니다.
                    </p>
                ) : (
                    questions.map((q) => (
                        <div key={q.id} className="question-card glass-panel" onClick={() => onCardClick(q.id)}>
                            <div className="card-header">
                                <span className="card-author">{q.authorName}</span>
                                <span>•</span>
                                <span>{formatDate(q.createdAt)}</span>
                            </div>
                            <div className="card-content">{q.content}</div>
                            <div className="card-footer">
                                <div className="card-keywords">
                                    {q.keywords.map((kw, idx) => (
                                        <span key={idx}>{kw}</span>
                                    ))}
                                </div>
                                <div className="card-comment-count">
                                    💬 답변 {getCommentCount(q.id)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
