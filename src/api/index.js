/*
  包含n个接口请求函数的模块
*/
import ajax from './ajax';
import { GET, POST_JSON, POST_FORM, POST_TOKEN, POST_TOKEN_FORM } from './ajaxRequestType';
import { BASE_URL } from '../common/config';

// 获取首页数据
export const getIndexInfo = () => ajax(`${BASE_URL}/openapi/indexInfo`, {}, POST_JSON);

// 导航模块
// 获取标签类型
export const getTagType = () => ajax(`${BASE_URL}/openapi/selectTagType`, {}, POST_JSON);

// 根据标签类型获取对应的标签
export const getTagByTagTypeId = id =>
  ajax(`${BASE_URL}/openapi/selectTagsByType`, { id }, POST_JSON);

// 自动登录
export const authLogin = loginParams =>
  ajax(`${BASE_URL}/openapi/deviceInfo`, loginParams, POST_JSON);

// 获取日排行
export const findEverydayPays = () =>
  ajax(`${BASE_URL}/openapi/videoPay/findEverydayPays`, {}, GET);
// 获取周排行
export const findWeeklyPays = () => ajax(`${BASE_URL}/openapi/videoPay/findWeeklyPays`, {}, GET);
// 获取月排行
export const findMonthlyPays = () => ajax(`${BASE_URL}/openapi/videoPay/findMonthlyPays`, {}, GET);

// 获取漫画数据
export const getCartoonInfo = params =>
  ajax(`${BASE_URL}/openapi/caricature/getCaricatureInfo`, params, POST_TOKEN);

// 获取明星列表接口
export const getStarList = params => ajax(`${BASE_URL}/ying/getStarPage`, params, POST_TOKEN);

// 获取明星信息
export const getStarInfo = id => ajax(`${BASE_URL}/openapi/getStarInfo`, { id }, POST_TOKEN);

// 收藏明星列表
export const saveMemberCollect = starId =>
  ajax(`${BASE_URL}/ying/memberStar/saveMemberCollect`, { starId }, POST_TOKEN_FORM);
// 取消收藏明星
export const delMemberCollect = starId =>
  ajax(`${BASE_URL}/ying/memberStar/delMemberCollect`, [starId], POST_TOKEN);

// 获取电影列表
export const getMovieList = params =>
  ajax(`${BASE_URL}/openapi/getVideoByStarId`, params, POST_JSON);

// 获取漫画基本信息
export const getCaricatureInfo = caricatureId =>
  ajax(`${BASE_URL}/ying/caricature/getCaricatureDetail`, { caricatureId }, POST_TOKEN);

// 获取漫画章节信息
export const getCaricatureChapterInfo = caricatureId =>
  ajax(`${BASE_URL}/openapi/caricatureChapter/getListByCaricatureId`, { caricatureId }, POST_JSON);

// 获取漫画图片集合
export const getChapterPictureList = chapterId =>
  ajax(`${BASE_URL}/ying/caricatureChapter/getChapterDetail`, { chapterId }, POST_TOKEN);

// 添加漫画收藏
export const addCaricatureCollect = caricatureId =>
  ajax(`${BASE_URL}/ying/apiCaricatureBookcase/save`, { caricatureId }, POST_TOKEN);
// 删除漫画收藏
export const delCaricatureCollect = caricatureId =>
  ajax(`${BASE_URL}/ying/apiCaricatureBookcase/del`, [caricatureId], POST_TOKEN);

// 获取漫画搜索热门标签
export const getCaricatureHotLabel = () =>
  ajax(`${BASE_URL}/openapi/caricatureSearch/getHotSearchName`, {}, POST_JSON);

// 获取电影搜索热门标签
export const getMovieHotLabel = () => ajax(`${BASE_URL}/openapi/searchSearchName`, {}, POST_JSON);

// 获取影片信息
export const getVideoDetail = params => ajax(`${BASE_URL}/ying/getVideoDetail`, params, POST_TOKEN);

// 用户登录
export const login = params => ajax(`${BASE_URL}/openapi/login`, params, POST_JSON);

// 电影搜索
export const searchVideo = searchName =>
  ajax(`${BASE_URL}/openapi/selectOPenVideo`, { searchName }, POST_JSON);

// 添加用户影片收藏
export const setCareHistory = params => ajax(`${BASE_URL}/ying/setCareHistory`, params, POST_TOKEN);

// 获取观看记录
export const getMemberViewHistoryMore = params =>
  ajax(`${BASE_URL}/ying/getMemberViewHistoryMore`, params, POST_TOKEN);

// 删除观看记录
export const deleteViewHistory = params =>
  ajax(`${BASE_URL}/ying/deleteViewHistory`, params, POST_TOKEN);

// 获取观看记录
export const getCaricatureBookcaseList = params =>
  ajax(`${BASE_URL}/ying/apiCaricatureBookcase/getCaricatureBookcaseList`, params, POST_TOKEN);

// 删除观看记录
export const delCaricatureBookcase = params =>
  ajax(`${BASE_URL}/ying/apiCaricatureBookcase/del`, params, POST_TOKEN);

// 获取用户收藏数据
export const getMemberCareHistoryPage = params =>
  ajax(`${BASE_URL}/ying/getMemberCareHistoryPage`, params, POST_TOKEN);

// 删除用户电影收藏数据
export const deleteCareHistory = params =>
  ajax(`${BASE_URL}/ying/deleteCareHistory`, params, POST_TOKEN);

// 查询积分获取类型
export const getIntegralClassifies = () =>
  ajax(`${BASE_URL}/ying/integralClassify/findAll`, {}, POST_TOKEN);

// 查询是否开启vip购买
export const findIsOpenPay = () =>
  ajax(`${BASE_URL}/ying/payOpenSetting/findIsOpenPay`, {}, POST_TOKEN);

// 添加积分
export const addIntegral = integralId =>
  ajax(`${BASE_URL}/ying/payOpenSetting/addIntegral`, { integralId }, POST_TOKEN_FORM);

// 兑换vip
export const exchangeVip = integralVipId =>
  ajax(`${BASE_URL}/ying/integralVip/exchange`, { integralVipId }, POST_TOKEN_FORM);

// 查询所有的会员积分兑换
export const getExchangeVipTypes = () =>
  ajax(`${BASE_URL}/ying/integralVip/findAll`, {}, POST_TOKEN);

// 获取个人中心信息
export const getMemberInfo = params => ajax(`${BASE_URL}/ying/getMemberInfo`, params, POST_TOKEN);

// 获取积分详情
export const getHistoryRecord = params =>
  ajax(`${BASE_URL}/ying/integralClassify/getHistoryRecord`, params, POST_TOKEN);

// 退出登录
export const logout = () => ajax(`${BASE_URL}/ying/logout`, {}, POST_TOKEN);

// 获取验证码
export const getSmsCode = params => ajax(`${BASE_URL}/openapi/getSmsCode`, params, POST_JSON);

// 手机号注册
export const telRegedit = params => ajax(`${BASE_URL}/openapi/regedit`, params, POST_JSON);

// 修改密码
export const loseTel = params => ajax(`${BASE_URL}/openapi/loseTel`, params, POST_JSON);

// 影片点赞
export const setCareTimess = params => ajax(`${BASE_URL}/ying/setCareTimes`, params, POST_TOKEN);

// 添加积分
export const checkInAddIntegral = integralId =>
  ajax(`${BASE_URL}/ying/integralClassify/addIntegral`, { integralId }, POST_TOKEN_FORM);

// 查询购买vip支付方式
export const getPayType = () => ajax(`${BASE_URL}/openapi/getPayType`, {}, POST_JSON);

// 获取卡密类型
export const getVipList = () => ajax(`${BASE_URL}/ying/getVipList`, {}, POST_JSON);

// 获取后台开启的模块功能
export const getModuleSetting = () =>
  ajax(`${BASE_URL}/openapi/moduleSetting/getModuleSetting`, {}, POST_JSON);

// 获取推广用户
export const getExtensionHistory = () =>
  ajax(`${BASE_URL}/ying/getExtensionHistory`, {}, POST_TOKEN);

// 获取推广码
export const getExtensionCode = params =>
  ajax(`${BASE_URL}/ying/getExtensionCode`, params, POST_JSON);

// 使用激活码
export const useRechargeCode = rechargeCode =>
  ajax(`${BASE_URL}/ying/useRechargeCode`, { rechargeCode }, POST_TOKEN);

// 获取交流群接口
export const getGcGroup = () => ajax(`${BASE_URL}/openapi/acGroup/getAcGroup`, {}, POST_JSON);

// 获取推广url
export const getExtensionUrl = () =>
  ajax(`${BASE_URL}/openapi/extensionInfo/getExtensionUrl`, {}, POST_JSON);

// 根据广告类型获取广告
export const getBannerByCid = cId => ajax(`${BASE_URL}/openapi/findBanner`, { cId }, POST_FORM);

// 根据广告类型获取广告
export const search = options => ajax(`${BASE_URL}/openapi/search`, options, POST_JSON);

// 支付
export const getAcTurn = () => ajax(`${BASE_URL}/openapi/acTurn/getAcTurn`, {}, POST_JSON);

// 评论
export const commentOn = options => ajax(`${BASE_URL}/ying/saveVideoCommon`, options, POST_JSON);

// 获取评论列表
export const getComments = options => ajax(`${BASE_URL}/ying/getVideoCommon`, options, POST_JSON);

// 获取小说查询接口
export const getNovelInfo = options =>
  ajax(`${BASE_URL}/openapi/novel/getNovelInfo`, options, POST_JSON);

// 获取小说章节列表
export const getNovelChapters = options =>
  ajax(`${BASE_URL}/openapi/novelChapter/getChapterList`, options, POST_JSON);

// 获取小说内容
export const getChapterDetail = options =>
  ajax(`${BASE_URL}/ying/novelChapter/getChapterDetail`, options, POST_JSON);
