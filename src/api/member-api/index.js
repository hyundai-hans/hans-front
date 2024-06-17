import instance from '..'; // instance는 Axios 인스턴스로 가정합니다.

const MemberAPI = {
  signUpAPI: (signUpData) => {
    return instance.post('users', signUpData);
  },
  signInAPI: (signInData) => {
    return instance.post('users/login', signInData);
  },

  userProfileAPI: () => {
    return instance.get('users/profile');
  },
  signOutAPI: () => {
    return instance.post('users/logout');
  },
  editMemberInfoAPI: (editMemberInfoData) => {
    return instance.put('users', editMemberInfoData);
  },
  viewMemberInfoAPI: () => {
    return instance.get('users');
  },
};

export default MemberAPI;