import { Modal, Pagination } from 'antd';
import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { HomeCard } from '../home';
import styled from 'styled-components';
const SearchContainer = ({ open, onCancel, confirmLoading, modalText }) => {
  return (
    <Modal
      title="Search"
      open={open}
      footer={null}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
    >
      {modalText}
    </Modal>
  );
};

SearchContainer.propTypes = {
  open: PropTypes.bool.isRequired,
  onSearch: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmLoading: PropTypes.bool.isRequired,
  modalText: PropTypes.node.isRequired,
};

const SearchPagination = ({ arr = [], pageSize = 8 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const dataArray = Array.isArray(arr) ? arr : [];
  const totalPages = Math.ceil(dataArray.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, arr.length);
  const displayItems = dataArray.slice(startIndex, endIndex);
  console.log('여기', displayItems);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchDataForPage = (page) => {
    console.log(`Fetching data for page ${page}`);
  };

  useEffect(() => {
    fetchDataForPage(currentPage);
  }, [currentPage, pageSize]);

  return (
    <div>
      <InnerContainer>
        {displayItems.map((item, index) => (
          <HomeCard
            key={index}
            thumbnail_img_url={item.thumbNailImgUrl}
            title={item.title}
            nickname={item.nickname}
            postId={item.postId}
          />
        ))}
      </InnerContainer>
      <PaginationContainer>
        <StyledPagination
          current={currentPage}
          total={dataArray.length}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </PaginationContainer>
    </div>
  );
};

SearchPagination.propTypes = {
  arr: PropTypes.array.isRequired,
  pageSize: PropTypes.number,
};

const InnerContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
  align-items: center;
  justify-content: center;
`;
const StyledPagination = styled(Pagination)`
  .ant-pagination-item {
    border-color: black !important;
  }
  .ant-pagination-item a {
    color: black !important;
  }
  .ant-pagination-item-active {
    border-color: black !important;
    background-color: black !important;
  }
  .ant-pagination-item-active a {
    color: white !important;
  }
  .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination-next .ant-pagination-item-link {
    border-color: black !important;
    color: black !important;
  }
  .ant-pagination-prev .ant-pagination-item-link:hover,
  .ant-pagination-next .ant-pagination-item-link:hover {
    border-color: black !important;
    color: black !important;
  }
  .ant-pagination-disabled,
  .ant-pagination-disabled:hover {
    border-color: black !important;
    color: black !important;
  }
`;

const PaginationContainer = styled.div`
  padding-top: 10vh;
  text-align: center;
`;
export { SearchContainer, SearchPagination };
