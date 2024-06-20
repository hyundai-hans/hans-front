import { React, useEffect, useState } from 'react';
import { TextBox } from '../../stores/atom/text-box';
import styled from 'styled-components';
import { SearchPagination } from '../../components/search';
import image1 from '../../assets/image/random1.jpg';
import image2 from '../../assets/image/random2.jpg';
import image3 from '../../assets/image/random3.jpg';
import image4 from '../../assets/image/random4.jpg';
import image5 from '../../assets/image/random5.png';
import image6 from '../../assets/image/random6.jpg';
import image7 from '../../assets/image/random7.jpg';
import { PlusOutlined } from '@ant-design/icons';
import StyleContainer from '../../components/style';
import PostAPI from '../../api/post-api';
import { getCookie } from '../../utils/cookie';
import { Spin } from 'antd';
const Style = () => {
  const [isLoading, setIsLoading] = useState(true);
  const randomArr = [image1, image2, image3, image4, image5, image6, image7];
  const [randomItem, setRandomItem] = useState(null);
  const accessToken = getCookie('accessToken');
  const [stylishArr, setStylishArr] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await PostAPI.viewEmptyAPI();
        setStylishArr(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const getRandomItem = (arr) => {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    };

    setRandomItem(getRandomItem(randomArr));

    return () => {};
  }, []);
  return (
    <Wrapper>
      {isLoading ? (
        <LoadingContainer>
          <BlackSpin size="large" />
        </LoadingContainer>
      ) : (
        <>
          <Container>
            <ImgContainer src={randomItem} alt="Image description" />
            <TextContainer style={{ cursor: 'default' }}>
              <TextBox typography="h1" fontWeight="700">
                Style
              </TextBox>
            </TextContainer>
          </Container>

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
                    <TextBox typography="h1" fontWeight={'700'}>
                      Most Stylish
                    </TextBox>
                  </div>
                  {accessToken ? (
                    <div>
                      <StyledPlusOutlined
                        onClick={() => {
                          window.location.href = 'http://localhost:3000/post';
                        }}
                      />
                    </div>
                  ) : null}
                </StylishContainer>
              </div>
              <SearchPagination arr={stylishArr} pageSize={8} />
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
                    justifyContent: 'center',
                    paddingBottom: '5vh',
                    width: '100%',
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
                    <TextBox typography="h1" fontWeight={'700'}>
                      In Fashion
                    </TextBox>
                  </div>
                </div>
                <StyleContainer
                  first="ootd"
                  second="데일리룩"
                  third="snobshots"
                  fourth="여름맞이"
                ></StyleContainer>
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
                    justifyContent: 'center',
                    paddingBottom: '5vh',
                    width: '100%',
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
                    <TextBox typography="h1" fontWeight={'700'}>
                      Categories
                    </TextBox>
                  </div>
                </div>
                <StyleContainer
                  first="원피스"
                  second="셔츠"
                  third="슬리브"
                  fourth="쇼츠"
                ></StyleContainer>
              </div>
            </Inner>
          </SubContainer>
        </>
      )}
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

const StyledPlusOutlined = styled(PlusOutlined)`
  font-size: 3vh;
  right: 0;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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
  padding: 10vh 0 10vh 0;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10vh 1vw 10vh 1vw;
`;

const StylishContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default Style;
