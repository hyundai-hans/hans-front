import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  HeartOutlined,
  SendOutlined,
  CopyOutlined,
  XOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { message, Dropdown, Menu, Button, Modal, Spin } from 'antd';
import { TextBox } from '../../stores/atom/text-box';
import { DetailCarousel, DetailCard } from '../../components/detail';
import { useCustomNavigate } from '../../hooks';
import { ROUTES } from '../../constants/routes';
import PostAPI from '../../api/post-api';
import { useRecoilValue } from 'recoil';
import { memberState } from '../../stores/atom/member-atom';
import { getCookie } from '../../utils/cookie';
const Detail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const memberData = useRecoilValue(memberState);
  const accessToken = getCookie('accessToken');
  const { postId } = useParams();
  console.log(postId);
  const [detailArr, setDetailArr] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await PostAPI.viewPostDetailAPI(postId);
        setDetailArr(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  const [isLike, setIsLike] = useState(false);
  function onClickShareTwitter() {
    const link = window.location.href;
    const twitterIntent = `https://twitter.com/intent/tweet?text=custom%20text&url=${link}`;
    window.open(twitterIntent, '_blank');
  }
  const { handleChangeUrl } = useCustomNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      await PostAPI.removePostAPI(postId);
      setIsModalOpen(false);
      window.location.href = 'http://localhost:3000/';
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleLike = async () => {
    if (accessToken) {
      setIsLike(!isLike);
      if (isLike) {
        setDetailArr((prevState) => ({
          ...prevState,
          likesCount: prevState.likesCount - 1,
        }));
        try {
          await PostAPI.recommendPostAPI(postId);
        } catch (error) {
          console.error(error);
        }
        // 변한 카운트를 api 요청
      } else {
        setDetailArr((prevState) => ({
          ...prevState,
          likesCount: prevState.likesCount + 1,
        }));
        // 변한 카운트를 api 요청
        try {
          await PostAPI.recommendPostAPI(postId);
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      message.error({
        content: (
          <TextBox typography="body3" fontWeight={'400'}>
            로그인이 필요한 서비스 입니다.
          </TextBox>
        ),
        duration: 2,
        style: {
          width: '346px',
          height: '41px',
        },
      });
    }
  };

  function handleCopyLink() {
    const link = window.location.href;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success({
          content: (
            <TextBox typography="body3" fontWeight={'400'}>
              클립보드에 링크가 복사되었습니다.
            </TextBox>
          ),
          duration: 2,
          style: {
            width: '346px',
            height: '41px',
          },
        });
      })
      .catch((error) => {
        message.error(error.message);
      });
  }
  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={handleCopyLink}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <CopyOutlined />
          <span>URL 복사</span>
        </div>
      </Menu.Item>
      <Menu.Item key="1" onClick={onClickShareTwitter}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <XOutlined />
          <span>X 공유</span>
        </div>
      </Menu.Item>
      <Menu.Divider />
    </Menu>
  );
  return (
    <DetailContainer>
      {isLoading ? (
        <LoadingContainer>
          <BlackSpin size="large" />
        </LoadingContainer>
      ) : (
        <PostWrapper>
          <PostImageWrapper>
            <DetailCarousel images={detailArr.imgList}></DetailCarousel>
            {/* 캐러셀 */}
          </PostImageWrapper>
          <PostContentWrapper>
            <PostHeader>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ProfileImage src={detailArr.profileImg} alt="Profile" />
                  <TextBox typography="body3" fontWeight={'700'}>
                    {detailArr.nickname}
                  </TextBox>
                </div>
                {accessToken &&
                memberData.nickname === detailArr.nickname &&
                memberData.profileImage === detailArr.profileImg ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                    }}
                  >
                    <EditOutlined
                      style={{ fontSize: '3vh', cursor: 'pointer' }}
                      onClick={() => {
                        handleChangeUrl(`/edit/${postId}`);
                        // window.location.href = `http://localhost:3000/edit/${postId}`;
                      }}
                    />
                    <DeleteOutlined
                      style={{ fontSize: '3vh', cursor: 'pointer' }}
                      onClick={showModal}
                    />
                  </div>
                ) : null}
              </div>
              <StyledModal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <p>삭제하시겠습니까?</p>
              </StyledModal>
            </PostHeader>
            <PostContent>
              <PostDescription>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <ProfileImage src={detailArr.profileImg} alt="Profile" />
                  </div>
                  <TextBox typography="body3" fontWeight={'700'}>
                    {detailArr.nickname}
                  </TextBox>
                  <div style={{ marginLeft: '10px' }}>
                    <TextBox typography="body3" fontWeight={'700'}>
                      {detailArr.title}
                    </TextBox>
                  </div>
                </div>
                <div style={{ marginLeft: '46px' }}>
                  <TextBox typography="body2" fontWeight={'500'}>
                    {detailArr.body}
                  </TextBox>
                  <TagListContainer>
                    {detailArr.tagList.map((tag) => (
                      <Hashtags key={tag.tagId}>#{tag.body}</Hashtags>
                    ))}
                  </TagListContainer>
                </div>
              </PostDescription>
              <LikeSectionDivider /> {/* 줄 추가 */}
              <LikeSection>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <LikeIcon onClick={handleLike} islike={isLike} />
                  <Dropdown overlay={menu} trigger={['click']}>
                    <SendIcon onClick={(e) => e.preventDefault()} />
                  </Dropdown>
                </div>
                <LikeCount>좋아요 {detailArr.likesCount}개</LikeCount>
              </LikeSection>
              <LikeSectionDivider /> {/* 줄 추가 */}
              <AdditionalImagesContainer>
                <TextBox typography="body2" fontWeight={'700'}>
                  Related Products
                </TextBox>
                <DetailCard
                  productPrice={detailArr.product.productPrice}
                  productImg={detailArr.product.productImg}
                  productUrl={detailArr.product.productUrl}
                  productName={detailArr.product.productName}
                ></DetailCard>
              </AdditionalImagesContainer>
            </PostContent>
          </PostContentWrapper>
        </PostWrapper>
      )}
    </DetailContainer>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;
const BlackSpin = styled(Spin)`
  .ant-spin-dot {
    i {
      background: black;
    }
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-footer {
    .ant-btn-primary,
    .ant-btn-primary:hover {
      background-color: black; /* Ok 버튼의 배경 색상 */
      border-color: black; /* Ok 버튼의 테두리 색상 */
    }

    .ant-btn {
      &:not(.ant-btn-primary) {
        color: black; /* Cancel 버튼의 텍스트 색상 */
        border-color: black; /* Cancel 버튼의 테두리 색상 */
      }
    }
  }
`;
const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: 20px; /* 위와의 간격을 띄우기 위해 추가 */
  line-height: 1.6; /* 기본 줄 간격 설정 */
  cursor: default;
`;

const PostWrapper = styled.div`
  border: 2px solid #dbdbdb; /* 외부 테두리 */
  border-radius: 10px; /* 둥근 테두리 적용 */
  width: 1000px; /* 너비를 1000px로 증가 */
  margin-bottom: 20px;
  background-color: white;
  display: flex; /* 가로로 나열하기 위해 flex 속성 추가 */
  overflow: hidden; /* 자식 요소의 테두리 반경을 부모에 맞추기 위해 추가 */
`;

const PostImageWrapper = styled.div`
  width: 60%; /* 이미지 영역을 60%로 설정 */
  height: inherit;
  border-right: 2px solid #dbdbdb; /* 내부 구분을 위한 테두리 */
`;

const PostContentWrapper = styled.div`
  width: 40%; /* 내용 영역을 40%로 설정 */
  display: flex;
  flex-direction: column;
  border-radius: 0 10px 10px 0; /* 내용 영역에 둥근 테두리 적용 */
  overflow: hidden;
  word-wrap: break-word;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  border-bottom: 1px solid #dbdbdb;
  width: 100%;
`;

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 14px;
`;

const PostContent = styled.div`
  padding: 14px;
  border-bottom: 1px solid #dbdbdb; /* 내부 구분을 위한 테두리 */
`;

const LikeSectionDivider = styled.div`
  border-top: 1px solid #dbdbdb; /* 줄 추가 */
  margin: 10px 0; /* 줄 위아래 간격 추가 */
`;

const LikeSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  margin-top: 20px;
`;

const LikeIcon = styled(HeartOutlined)`
  font-size: 24px;
  cursor: pointer;
  border-radius: 50%;
  padding: 5px;
  color: ${(props) => (props.islike ? '#ff6f61' : 'black')};

  &:hover {
    color: #ff6f61;
  }
`;

const SendIcon = styled(SendOutlined)`
  font-size: 24px;
  cursor: pointer;

  &:hover {
    color: green;
  }
`;
const LikeCount = styled.span`
  font-weight: bold;
`;

const PostDescription = styled.div`
  margin-bottom: 10px;
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
`;

const TagListContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* 자식 요소가 부모 요소의 너비를 초과할 경우 줄바꿈 */
  gap: 8px; /* 요소들 간의 간격 설정 */
`;
const Hashtags = styled.div`
  color: #00376b;
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AdditionalImagesContainer = styled.div`
  margin-bottom: 10vh;
`;

export default Detail;
