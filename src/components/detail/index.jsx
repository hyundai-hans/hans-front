import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Carousel } from 'antd';

const { Meta } = Card;

const DetailCarousel = ({ images }) => {
  const [imageBlobs, setImageBlobs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAndStoreBlobs = async () => {
      try {
        const fetchedBlobs = await Promise.all(
          images.map(async (element) => {
            const response = await fetch(element.imgUrl, { mode: 'cors' });
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const blob = await response.blob();
            return blob;
          }),
        );

        const blobUrls = fetchedBlobs.map((blob) => URL.createObjectURL(blob));
        setImageBlobs(blobUrls);
        console.log('여기', blobUrls);
      } catch (error) {
        console.error('Error fetching or storing blobs:', error);
      }
    };

    fetchAndStoreBlobs();

    return () => {
      // Clean up blob URLs when component unmounts
      imageBlobs.forEach((blobUrl) => URL.revokeObjectURL(blobUrl));
    };
  }, [images]);

  // if (imageBlobs.length === 0) {
  //   return <div>Loading...</div>;
  // }

  return (
    <StyledCarousel arrows infinite autoplay>
      {imageBlobs.map((blobUrl, index) => (
        <CarouselItem key={index} imgUrl={blobUrl} />
      ))}
    </StyledCarousel>
  );
};

DetailCarousel.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      imgUrl: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const CarouselItem = ({ imgUrl }) => {
  return (
    <ItemContainer>
      <StyledImage src={imgUrl} alt="Carousel Item" />
    </ItemContainer>
  );
};

CarouselItem.propTypes = {
  imgUrl: PropTypes.string.isRequired,
};

const StyledCarousel = styled(Carousel)`
  max-width: 100vw;
  margin: 0 auto;
  overflow: hidden;
  height: 100%;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100vh;
  object-fit: fill;
`;

const ItemContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const DetailCard = ({ productPrice, productImg, productUrl, productName }) => {
  const formattedPrice = `${new Intl.NumberFormat().format(productPrice)} 원`;

  const absoluteProductUrl = /^https?:\/\//i.test(productUrl)
    ? productUrl
    : `http://localhost:3000/${productUrl}`;
  return (
    <CardContainer>
      <a href={absoluteProductUrl} target="_blank" rel="noopener noreferrer">
        <StyledCard
          hoverable
          style={{ width: 240 }}
          cover={<StyledCardCover alt="example" src={productImg} />}
        >
          <StyledMeta title={productName} description={formattedPrice} />
        </StyledCard>
      </a>
    </CardContainer>
  );
};

DetailCard.propTypes = {
  productPrice: PropTypes.number.isRequired,
  productImg: PropTypes.string.isRequired,
  productUrl: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
};

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const StyledCard = styled(Card)`
  width: 240px;
  border: 1px solid black;
`;

const StyledCardCover = styled.img`
  height: 300px;
  object-fit: fill;
  border: 1px solid black;
`;

const StyledMeta = styled(Meta)`
  .ant-card-meta-title {
    font-size: 20px;
    font-weight: bold;
  }

  .ant-card-meta-description {
    font-size: 15px;
    color: gray;
  }
`;

export { DetailCarousel, DetailCard };
