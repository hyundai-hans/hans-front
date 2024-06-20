import instance from '..';

const HistoryAPI = {
  bannerAPI: () => {
    return instance.get('users/histories/products');
  },
};

export default HistoryAPI;
