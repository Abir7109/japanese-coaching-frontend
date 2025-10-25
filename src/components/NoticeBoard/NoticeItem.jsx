import React, { useState } from 'react';
import axios from 'axios';

const NoticeItem = ({ notice, onDelete, canManage }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'low':
        return 'bg-green-100 border-green-500 text-green-700';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this notice?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`/api/notices/${notice._id}`);
      onDelete();
    } catch (error) {
      console.error('Error deleting notice:', error);
      alert('Failed to delete notice');
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`card border-l-4 ${getPriorityColor(notice.priority).split(' ')[1]}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-ocean">{notice.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notice.priority)}`}>
              {notice.priority.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-600 whitespace-pre-wrap">{notice.content}</p>
        </div>
        {canManage && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 ml-4"
          >
            {isDeleting ? '...' : '🗑️'}
          </button>
        )}
      </div>

      {/* Author and Date */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-aqua to-teal rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {notice.author?.name?.charAt(0).toUpperCase()}
          </div>
          <span>Posted by {notice.author?.name || 'Unknown'}</span>
        </div>
        <span>{formatDate(notice.createdAt)}</span>
      </div>

      {/* Attachments */}
      {notice.attachments && notice.attachments.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm font-medium text-ocean mb-2">Attachments:</p>
          <div className="space-y-1">
            {notice.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal hover:text-ocean text-sm flex items-center gap-1"
              >
                📎 {attachment.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeItem;
