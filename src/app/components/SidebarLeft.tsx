import React from 'react';

export default function SidebarLeft({ keywords, currentFilter, onFilterClick }) {
    return (
        <aside className="sidebar-left">
            <div className="sidebar-header">
                <h2>🏷️ 키워드</h2>
                <p>클릭해서 관련 질문만 모아보세요!</p>
            </div>
            <div className="keyword-list">
                {keywords.map((kw, index) => (
                    <button
                        key={index}
                        className={`keyword-tag ${currentFilter === kw ? 'active' : ''}`}
                        onClick={() => onFilterClick(kw)}
                    >
                        {kw}
                    </button>
                ))}
            </div>
        </aside>
    );
}
