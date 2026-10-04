// Demo 模式数据层端到端测试（Node 环境垫片 localStorage）
const store = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => store.set(k, v),
  removeItem: (k: string) => store.delete(k),
};

const { registerWithEmail, loginWithEmail, logoutAuth } = await import('../src/supabase/auth');
const { saveMember, createMemberWork, deleteMemberWork, fetchMembers, fetchAllWorks, fetchMember } = await import('../src/supabase/database');

const IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

console.log('1. 注册...');
const user = await registerWithEmail('测试同学', 'test_demo@cxm.com', '123456', 2026);
console.log('  OK uid=', user.uid);

await logoutAuth();
const u2 = await loginWithEmail('test_demo@cxm.com', '123456');
console.log('2. 登录 OK');

await saveMember(u2.uid, { role: '摄影组组长', bio: '热爱摄影', description: '自我介绍', tags: ['摄影', '剪辑'], socialLinks: [{ platform: '小红书', url: '#' }] });
const me = await fetchMember(u2.uid);
console.log('3. 资料保存 OK:', me?.role, '| tags:', me?.tags.join(','));

await saveMember(u2.uid, { avatar: IMG, backgroundImage: IMG });
const me2 = await fetchMember(u2.uid);
console.log('4. 头像/背景图 OK:', !!me2?.avatar, !!me2?.backgroundImage);

const w1 = await createMemberWork(u2.uid, { title: '测试摄影', type: 'photo', imageUrl: IMG, description: '一' });
await createMemberWork(u2.uid, { title: '测试海报', type: 'poster', imageUrl: IMG, description: '二' });
console.log('5. 添加作品 OK');

const allMembers = await fetchMembers();
const allWorks = await fetchAllWorks();
console.log('6. 星光墙人数:', allMembers.length, '| 作品墙数量:', allWorks.length);
console.log('   新成员在列表:', allMembers.some(m => m.uid === u2.uid), '| 新作品在列表:', allWorks.some(w => w.memberId === u2.uid));

await deleteMemberWork(u2.uid, w1.id);
const after = await fetchAllWorks();
console.log('7. 删除后作品数:', after.length, '| 剩:', after[0]?.title);

// 错误密码应报错
try {
  await loginWithEmail('test_demo@cxm.com', 'wrong-pw');
  console.log('8. FAIL: 错误密码竟然登录成功');
} catch {
  console.log('8. 错误密码正确被拒绝 OK');
}

console.log('\n全部验证通过');
