enum URLS {
  home = '/',
  signUp = '/signup',
  logIn = '/login',
  admin = '/admin',
  groupDetail = '/group',
  groupList = '/grouplist',
  makeGroup = '/makegroup',
  myPage = '/mypage',
  signupSuccess = '/signup/success',
}

export const PRIVATEURLS = [URLS.groupDetail, URLS.groupList, URLS.makeGroup, URLS.myPage];

export default URLS;
