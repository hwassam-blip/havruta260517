import React, { useState } from 'react';

export default function DetailModal({
    question,
    comments,
    onClose,
    onPostComment
}) {
    const [commentContent, setCommentContent] = useState('');
    const [commentAuthor, setCommentAuthor] = useState('');

    if (!question) return null;

    const handlePost = () => {
        if (!commentAuthor.trim()) {
            alert('작성자 이름을 입력해주세요.');
            return;
        }
        if (!commentContent.trim()) {
            alert('답변 내용을 입력해주세요.');
            return;
        }
        onPostComment(question.id, commentContent, commentAuthor);
        setCommentContent('');
        setCommentAuthor('');
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>상세 보기</h2>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="detail-question">
                        <div className="card-header" style={{ marginBottom: '1rem' }}>
                            <span className="card-author" style={{ fontSize: '1rem' }}>{question.authorName}</span>
                            <span>•</span>
                            <span>{formatDate(question.createdAt)}</span>
                        </div>
                        <div className="card-content" style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '1rem' }}>
                            {question.content}
                        </div>
                        <div className="card-keywords" style={{ display: 'flex', gap: '0.4rem' }}>
                            {question.keywords.map((kw, idx) => (
                                <span key={idx} style={{ fontSize: '0.75rem', color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="comments-section">
                        <h3>💬 답변 ({comments.length})</h3>
                        <div className="comment-list">
                            {comments.length === 0 ? (
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>아직 작성된 답변이 없습니다. 첫 답변을 남겨주세요!</p>
                            ) : (
                                comments.map(c => (
                                    <div key={c.id} className="comment-item">
                                        <div className="comment-header">
                                            <span className="comment-author">{c.authorName}</span>
                                            <span className="comment-date">{formatDate(c.createdAt)}</span>
                                        </div>
                                        <div className="comment-content">{c.content}</div>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <div className="comment-composer">
                            <input 
                                type="text" 
                                placeholder="작성자 이름" 
                                value={commentAuthor} 
                                onChange={(e) => setCommentAuthor(e.target.value)} 
                                style={{ 
                                    padding: '0.8rem', 
                                    borderRadius: '8px', 
                                    border: '1px solid #cbd5e1', 
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    fontSize: '0.95rem'
                                }} 
                            />
                            <textarea
                                placeholder="친구의 질문에 답변을 달아주세요!"
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="btn-primary" onClick={handlePost}>답변 등록</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
