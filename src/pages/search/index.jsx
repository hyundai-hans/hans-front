import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import PostAPI from '../../api/post-api';
import { Spin } from 'antd';
const Search = () => {
  let { query } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const randomArr = [image1, image2, image3, image4, image5, image6, image7];
  const [randomItem, setRandomItem] = useState(null);
  const [searchArr, setSearchArr] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await PostAPI.viewPostsAPI(query);
        console.log(res);
        setSearchArr(res.data.data);
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
  }, [query]);
  console.log(searchArr);
  return (
    <Wrapper>
      {isLoading ? (
        <LoadingContainer>
          <BlackSpin size="large" />
        </LoadingContainer>
      ) : (
        <>
          <ImgContainer src={randomItem} alt="Image description" />
          <SubContainer>
            <Inner>
              <div
                style={{
                  paddingBottom: '15vh',
                  cursor: 'default',
                  margin: '0 auto',
                }}
              >
                <TextBox typography="h1" fontWeight={'700'}>
                  Search result for &rdquo;{query}&rdquo;
                </TextBox>
              </div>
              <SearchPagination arr={searchArr} pageSize={8} />
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ImgContainer = styled.img`
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

export default Search;
