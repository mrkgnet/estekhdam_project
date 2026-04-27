"use client";
import { getApprovedComments } from '@/actions/comment/user/fetch/Actions'
import React, { useEffect, useState } from 'react'
import CommentSectionUI from './CommentSection'

interface Props {
  targetId: string;
  targetType: string; // به صورت string باز گذاشته شد تا هر مقداری (blog, product, news و ...) را بگیرد
}

export default function CommentManagment({ targetId, targetType }: Props) {
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getApprovedComments(targetId, targetType);
       
        if (response && response.success) {
          setComments(response.data);
        } else {
           console.log("خطا در دریافت:", response?.error);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [targetId, targetType]);

 if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-8 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
       <CommentSectionUI targetId={targetId} targetType={targetType} initialComments={comments} />
    </div>
  )
}
