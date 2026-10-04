import type { Member, Work } from '../types/member';

/**
 * 本地开发 fallback 数据。
 * 当前为空：页面数据一律通过 hooks 获取
 *   useMembers() / useMember(id) / useAllWorks() / useWorks(id)
 * 接入 Supabase 后此文件不再参与运行时数据读取。
 */
export const seedMembers: Member[] = [];

export const seedWorks: Work[] = [];
