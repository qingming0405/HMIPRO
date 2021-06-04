/* edge设置配置 */
let config = {
  gjModel: 0,/* 杭海地铁 0:正常模型，1:杭海城际 */
  tsRefresh: 0,/*实时数据列表三秒刷新数据,0:不做处理，1:3s假数据处理 */
  loginlogo: 'loginLogoBg_edge',/* 登陆页logo: loginLogoBg_edge:正常中自庆安logo；loginLogoBg_edge1:航天光电科技发展（天津）有限公司；loginLogoBg_edge0:透明无logo */
  logo: 'logo',/*主页左上角logo:  logo:正常中自庆安logo；logo1:航天光电科技发展（天津）有限公司；logo0:透明无logo*/
  loginName: '',//配置登录页标题，若为‘’则取后端返回值（临时现场需要）
  loginPhoneNum: 1,//配置登录页底部联系方式，若为0则不显示，若为1则根据当前标题数据显示
  generalStutas: 0,//总貌图状态配置（离线机组变为在线）=》目前只针对轨道交通 0:不变化保持原样；1：离线机组变为在线
  fdDiagnosis: 0,//风电智能诊断-0:取diagnosis；1：东汽智能诊断取fault_type，目前都只有风电传动链存在智能诊断
}
/* pro和edge的特别配置 */
let bothConfig = {
  /* 单位单独处理为mm/s2的风场 */
  mms2: ['1514420800218', '1534208427315', '1594775570215'],// 浙铁大风现场
}
/* pro设置配置 */
let proConfig = {
  waveColorB: [
    '1443262028655', //大唐瓜州桥六第一风电场
    '1594630891253', //张腰先风电场
    '1497947604894', //大唐贵州昌平坳风电项目
    '1600223694611', //大唐辽宁法库双台子风场
    '1542866620065', //贵州昌平坳风电场
    '1591424963536', //中国华能干河口北平价风电场
  ],/* 波形颜色需设置为黑色的风场组织ID */
}
// 登录页底部联系方式
function getLoginNum (index) {
  switch (index) {
    case 0: return 4000093668;/* CS2000 */
    case 1: return 4000093668;/* DS9100 */
    case 2: return 4000093668;/* TMS2000 */
    case 3: return 4000093668;/* WHD9100 */
    case 4: return 4000093668;/* 旋转机械8000 */
    case 5: return 4000093668;/* kj5000 */
    default: return 4000093668;
  }
}