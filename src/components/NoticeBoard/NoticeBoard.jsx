import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import NoticeItem from './NoticeItem';
import CreateNotice from './CreateNotice';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { isTeacher, isAdmin } = useAuth();

  const canManageNotices = isTeacher || isAdmin;

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await axios.get('/api/notices');
      setNotices(res.data.notices);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNoticeCreated = () => {
    setShowCreateForm(false);
    fetchNotices();
  };

  const handleNoticeDeleted = () => {
    fetchNotices();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-ocean">📌 Notice Board</h2>
        {canManageNotices && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            {showCreateForm ? 'Cancel' : '+ New Notice'}
          </button>
        )}
      </div>

      {/* Create Notice Form */}
      {showCreateForm && (
        <CreateNotice onNoticeCreated={handleNoticeCreated} />
      )}

      {/* Notices List */}
      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">No notices available</p>
          </div>
        ) : (
          notices.map((notice) => (
            <NoticeItem
              key={notice._id}
              notice={notice}
              onDelete={handleNoticeDeleted}
              canManage={canManageNotices}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;
