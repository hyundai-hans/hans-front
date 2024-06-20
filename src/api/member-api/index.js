import instance from '..';

const MemberAPI = {
  signUpAPI: (signUpData) => {
    return instance.post('users', signUpData);
  },
  signInAPI: (signInData) => {
    return instance.post('users/login', signInData);
  },
  checkDuplicatedEmailAPI: (checkDuplicatedEmailData) => {
    return instance.post('users/email', checkDuplicatedEmailData);
  },
  checkDuplicatedNicknameAPI: (checkDuplicatedNicknameData) => {
    return instance.post('users/nickname', checkDuplicatedNicknameData);
  },
  memberProfileAPI: () => {
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
