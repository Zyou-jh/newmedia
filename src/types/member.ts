export interface Member {
  uid: string;
  name: string;
  avatar: string;
  batch: number; // 届别年份，如 2025
  role: string;
  bio: string;
  description: string; // 自我介绍长文
  tags: string[];
  socialLinks: { platform: string; url: string }[];
  joinDate: string;
  backgroundImage: string;
  email?: string;
}

export type WorkType = 'photo' | 'poster' | 'video';

export interface Work {
  id: string;
  title: string;
  type: WorkType;
  imageUrl: string;
  description: string;
  createdAt: string;
  memberId: string;
  memberName?: string;
  memberBatch?: number;
}

export const WORK_TYPE_LABEL: Record<WorkType, string> = {
  photo: '摄影',
  poster: '海报',
  video: '视频',
};
