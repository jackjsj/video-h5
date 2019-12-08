import { get, post } from './request';

/**
 * 1. 获取漫画列表
 */
export function getCaricatureList(options) {
  return post('/caricature/getCaricatureInfo', options);
}

/**
 * 2. 获取频道标签大类型
 */
export function selectTagType() {
  return post('/selectTagType', {});
}

/**
 * 3. 获取频道标签列表
 */
export function selectTagsByType(id) {
  return post('/selectTagsByType', {
    id,
  });
}

/**
 * 4. 获取首页数据
 */
export function indexInfo() {
  return post('/indexInfo', {});
}

/**
 * 5. 获取每日排行
 */
export function findEverydayPays() {
  return get('/videoPay/findEverydayPays');
}

/**
 * 6. 获取周排行
 */
export function findWeeklyPays() {
  return get('/videoPay/findWeeklyPays');
}

/**
 * 7. 获取月排行
 */
export function findMonthlyPays() {
  return get('/videoPay/findMonthlyPays');
}

/**
 * 登录接口
 */
export function deviceInfo() {
  return post('/deviceInfo', {
    deviceCode: '935ebad1-a968-413c-9a57-e62533800bc1',
    fromCode: 'android',
    token:
      'eyJhbGciOiJIUzI1NiJ9.eyJleHQiOjE1NzU3OTQyMTQzODksInVpZCI6NzYsImlhdCI6MTU3NTc3NjIxNDM4OX0.E4-KUoCuHq9Qh5ETvFK8Yk7sWcjJOdLBDy6zctxyz_E',
    version: '1.1.0',
    versionType: '2',
  });
}
