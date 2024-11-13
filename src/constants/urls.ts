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

export const PRIVATEURLS = [
  String(URLS.groupDetail),
  String(URLS.groupList),
  String(URLS.makeGroup),
  String(URLS.myPage),
];

export default URLS;
