import React, { useEffect, useState } from 'react';
import image1 from '../../assets/image/random1.jpg';
import image2 from '../../assets/image/random2.jpg';
import image3 from '../../assets/image/random3.jpg';
import image4 from '../../assets/image/random4.jpg';
import image5 from '../../assets/image/random5.png';
import image6 from '../../assets/image/random6.jpg';
import image7 from '../../assets/image/random7.jpg';
import { TextBox } from '../../stores/atom/text-box';
import { SearchPagination } from '../../components/search';
import styled from 'styled-components';
import { ROUTES } from '../../constants/routes';
import { SettingOutlined } from '@ant-design/icons';
import { useCustomNavigate } from '../../hooks';
import MemberAPI from '../../api/member-api';
import { useRecoilValue } from 'recoil';
import { memberState } from '../../stores/atom/member-atom';
import { Spin } from 'antd';
const MyPage = () => {
  const randomArr = [image1, image2, image3, image4, image5, image6, image7];
  const [randomItem, setRandomItem] = useState(null);
  const [memberInfo, setMemberInfo] = useState(null);
  const { handleChangeUrl } = useCustomNavigate();
  const memberData = useRecoilValue(memberState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await MemberAPI.viewMemberInfoAPI();
        console.log(response);
        setMemberInfo(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const getRandomItem = (arr) => {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    };

    fetchData();
    setRandomItem(getRandomItem(randomArr));
  }, []);

  if (!memberInfo) {
    return (
      <LoadingContainer>
        <BlackSpin size="large" />
      </LoadingContainer>
    );
  }

  return (
    <Wrapper>
      <Container>
        <ImgContainer src={randomItem} alt="Image description" />
        <TextContainer style={{ cursor: 'default' }}>
          <TextBox typography="h1" fontWeight="700">
            My Page
          </TextBox>
        </TextContainer>
      </Container>
      <SubContainer>
        <Inner>
          <div
            style={{
              paddingBottom: '6vh',
              cursor: 'default',
              margin: '0 auto',
              width: '100%',
            }}
          >
            <StylishContainer>
              <div
                style={{
                  borderTop: '1px solid black',
                  paddingBottom: '7vh',
                  cursor: 'default',
                  margin: '0 auto',
                  paddingTop: '3.5vh',
                }}
              >
                <TextBox
                  typography="h1"
                  fontWeight={'700'}
                  style={{ textAlign: 'center' }}
                >
                  About {memberInfo.nickname}
                </TextBox>
              </div>

              <div>
                <StyledSettingOutlined
                  onClick={() => {
                    handleChangeUrl(ROUTES.MODIFY);
                  }}
                />
              </div>
            </StylishContainer>
          </div>
          <div style={{ margin: '0 auto' }}>
            <ProfileContainer
              src={memberData.profileImage}
              alt="Profile Image"
            />
          </div>
        </Inner>
      </SubContainer>
      <SubContainer>
        <Inner>
          <div
            style={{
              borderTop: '1px solid black',
              paddingBottom: '7vh',
              cursor: 'default',
              margin: '0 auto',
              paddingTop: '3.5vh',
            }}
          >
            <TextBox
              typography="h1"
              fontWeight={'700'}
              style={{ textAlign: 'center' }}
            >
              Email
            </TextBox>
          </div>
        </Inner>
      </SubContainer>
      <SubContainer>
        <Inner>
          <div style={{ margin: '0 auto', cursor: 'default' }}>
            <TextBox
              typography="h4"
              fontWeight={'400'}
              style={{ textAlign: 'center' }}
            >
              {memberInfo.email}
            </TextBox>
          </div>
        </Inner>
      </SubContainer>
      <SubContainer>
        <Inner>
          <div
            style={{
              paddingBottom: '15vh',
              cursor: 'default',
              margin: '0 auto',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  borderTop: '1px solid black',
                  paddingBottom: '7vh',
                  cursor: 'default',
                  margin: '0 auto',
                  paddingTop: '3.5vh',
                }}
              >
                <TextBox
                  typography="h1"
                  fontWeight={'700'}
                  style={{ textAlign: 'center' }}
                >
                  Recent Posts
                </TextBox>
              </div>
            </div>
          </div>
          <SearchPagination arr={memberInfo.postList} pageSize={4} />
        </Inner>
      </SubContainer>
    </Wrapper>
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

const ProfileContainer = styled.img`
  width: 250px;
  height: 300px;
  object-fit: cover;
`;

const StyledSettingOutlined = styled(SettingOutlined)`
  font-size: 3vh;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 17vh;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const TextContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
  font-weight: ${(props) => props.fontWeight};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
`;

const ImgContainer = styled.img`
  display: block;
  width: 100%;
  height: 80vh;
  object-fit: fill;
`;

const SubContainer = styled.div`
  margin: 0 auto;
  width: 80vw;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3vh 1vw 3vh 1vw;
`;

const StylishContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default MyPage;
