import React from 'react';

export default function SidebarRight() {
    return (
        <aside className="sidebar-right">
            <div className="sidebar-header">
                <h2>📢 공지사항</h2>
            </div>
            <div className="announcement-list glass-panel" style={{ marginBottom: '2rem' }}>
                <div className="announcement-item">
                    <span className="badge badge-red">필독</span>
                    <p>질문하기 전에 비슷한 내용이 있는지 <strong>키워드 검색</strong>을 먼저 활용해보세요!</p>
                </div>
                <div className="announcement-item">
                    <span className="badge badge-blue">이벤트</span>
                    <p>이번 주 <strong>베스트 답변자</strong>에게는 소정의 선물이 있습니다. 멋진 답변을 기대할게요! 🎁</p>
                </div>
            </div>

            <div className="sidebar-header">
                <h2>🏆 명예의 전당 (답변 왕)</h2>
            </div>
            <div className="ranking-list glass-panel">
                <div className="ranking-item">
                    <div className="rank-info">
                        <span className="rank-badge gold">1</span>
                        <div className="rank-user">
                            <span className="rank-avatar" style={{ background: '#e879f9' }}>MA</span>
                            <span className="rank-name">수학천재_김</span>
                        </div>
                    </div>
                    <span className="rank-score">답변 24회</span>
                </div>
                <div className="ranking-item">
                    <div className="rank-info">
                        <span className="rank-badge silver">2</span>
                        <div className="rank-user">
                            <span className="rank-avatar" style={{ background: '#c084fc' }}>SC</span>
                            <span className="rank-name">물리마스터</span>
                        </div>
                    </div>
                    <span className="rank-score">답변 18회</span>
                </div>
                <div className="ranking-item">
                    <div className="rank-info">
                        <span className="rank-badge bronze">3</span>
                        <div className="rank-user">
                            <span className="rank-avatar" style={{ background: '#60a5fa' }}>EN</span>
                            <span className="rank-name">영어정복자</span>
                        </div>
                    </div>
                    <span className="rank-score">답변 15회</span>
                </div>
            </div>
        </aside>
    );
}
