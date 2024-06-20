import instance from '..';

const PostAPI = {
  viewEmptyAPI: () => {
    return instance.get('posts?page=0&size=100&sort=created_at&by=desc');
  },
  viewPostsAPI: (viewPostsData) => {
    return instance.get('posts', {
      params: {
        tag: viewPostsData,
        page: 0,
        size: 100,
        sort: 'created_at',
        by: 'desc',
      },
    });
  },

  // 추천
  viewRecommendPostsAPI: () => {
    return instance.get('posts', {
      params: {
        page: 0,
        size: 100,
        sort: 'post_likes',
        by: 'desc',
      },
    });
  },

  // 최신
  viewRecentPostsAPI: () => {
    return instance.get('posts', {
      params: {
        page: 0,
        size: 100,
        sort: 'created_at',
        by: 'desc',
      },
    });
  },

  viewPostDetailAPI: (viewPostDetailData) => {
    return instance.get(`posts/${viewPostDetailData}`);
  },
  viewClothesAPI: (viewClothesData) => {
    return instance.get(`products?product_name=${viewClothesData}`);
  },
  recommendPostAPI: (recommendPostData) => {
    return instance.patch(`posts/${recommendPostData}`);
  },
  modifyPostAPI: (modifyPostData) => {
    return instance.put('posts', modifyPostData);
  },
  writePostAPI: (writePostData) => {
    return instance.post('posts', writePostData);
  },
  removePostAPI: (removePostData) => {
    return instance.delete(`posts/${removePostData}`);
  },
};

export default PostAPI;
