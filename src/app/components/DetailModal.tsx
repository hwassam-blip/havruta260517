import React, { useState } from 'react';

export default function DetailModal({
    question,
    comments,
    onClose,
    onPostComment
}) {
    const [commentContent, setCommentContent] = useState('');

    if (!question) return null;

    const handlePost = () => {
        if (!commentContent.trim()) {
            alert('답변 내용을 입력해주세요.');
            return;
        }
        onPostComment(question.id, commentContent);
        setCommentContent('');
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
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                
                <div className="modal-header">
                    <h2>상세 보기</h2>
                </div>
                
                <div className="modal-body">
                    <div className="modal-question">
                        <div className="card-header">
                            <div className="author-info">
                                <div className="avatar">
                                    {question.authorName ? question.authorName.charAt(0) : 'U'}
                                </div>
                                <span className="author-name">{question.authorName}</span>
                                <span className="time">{formatDate(question.createdAt)}</span>
                            </div>
                        </div>
                        <p className="card-content">{question.content}</p>
                    </div>

                    <div className="modal-comments">
                        <h3 className="comments-title">
                            💬 답변 ({comments.length})
                        </h3>
                        
                        <div className="comment-list">
                            {comments.length === 0 ? (
                                <p className="empty-state">아직 작성된 답변이 없습니다. 첫 답변을 남겨주세요!</p>
                            ) : (
                                comments.map(comment => (
                                    <div key={comment.id} className="comment-item">
                                        <div className="comment-header">
                                            <span className="author-name">{comment.authorName}</span>
                                            <span className="time">{formatDate(comment.createdAt)}</span>
                                        </div>
                                        <p className="comment-content">{comment.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <div className="comment-composer">
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
