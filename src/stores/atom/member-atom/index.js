import { atom } from 'recoil';

export const memberState = atom({
  key: 'memberState',
  default: [
    {
      nickname: '',
      profileImage: '',
    },
  ],
});
