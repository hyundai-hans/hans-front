import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Radio, Spin } from 'antd';
import PropTypes from 'prop-types';
import { SearchPagination } from '../search';
import PostAPI from '../../api/post-api';
const StyleContainer = ({ first, second, third, fourth }) => {
  const [selectedValue, setSelectedValue] = useState('a');
  const [selectedText, setSelectedText] = useState(first);
  const [isLoading, setIsLoading] = useState(true);
  const [arr, setArr] = useState([]);

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
    switch (e.target.value) {
      case 'a':
        setSelectedText(first);
        break;
      case 'b':
        setSelectedText(second);
        break;
      case 'c':
        setSelectedText(third);
        break;
      case 'd':
        setSelectedText(fourth);
        break;
      default:
        setSelectedText(''); // Handle unexpected cases
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await PostAPI.viewPostsAPI(selectedText);
        setArr(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedText]);

  return (
    <>
      {isLoading ? (
        <LoadingContainer>
          <BlackSpin size="large" />
        </LoadingContainer>
      ) : (
        <>
          <StyledRadioGroup
            defaultValue="a"
            value={selectedValue}
            onChange={handleChange}
          >
            <Radio.Button value="a">{first}</Radio.Button>
            <Radio.Button value="b">{second}</Radio.Button>
            <Radio.Button value="c">{third}</Radio.Button>
            <Radio.Button value="d">{fourth}</Radio.Button>
          </StyledRadioGroup>
          <div style={{ width: '100%', paddingTop: '10vh' }}>
            <SearchPagination arr={arr} pageSize={8} />
          </div>
        </>
      )}
    </>
  );
};

StyleContainer.propTypes = {
  first: PropTypes.string.isRequired,
  second: PropTypes.string.isRequired,
  third: PropTypes.string.isRequired,
  fourth: PropTypes.string.isRequired,
};
const LoadingContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
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
const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  align-items: center;
  justify-content: center;
  .ant-radio-button-wrapper {
    border: 1px solid black;
    color: black !important;
  }

  .ant-radio-button-wrapper-checked {
    background-color: black !important;
    border-color: black !important;
    color: white !important;
  }

  .ant-radio-button-wrapper:hover {
    border-color: black !important;
    color: black !important;
  }

  .ant-radio-button-wrapper-checked:not(
      .ant-radio-button-wrapper-disabled
    ):hover {
    background-color: black !important;
    border-color: black !important;
    color: white !important;
  }

  .ant-radio-button-wrapper-disabled {
    border-color: black !important;
    color: black !important;
  }
`;

export default StyleContainer;
