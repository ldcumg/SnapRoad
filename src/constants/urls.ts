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

/* QUESTION - 가독성이 떨어지고, 확장할 때 뎁스만 깊어질 것 같은데 사용하는 곳에서
[URLS.groupDetail, URLS.groupList, URLS.makeGroup, URLS.myPage]으로 사용하는 건 어떨까요? */
export const PRIVATEURLS = ['/group', '/grouplist', '/makegroup', '/mypage'];

export default URLS;
