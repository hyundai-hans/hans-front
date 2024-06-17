import styled from 'styled-components';
import {
  LoginOutlined,
  LogoutOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { SearchContainer } from '../../search';
import React, { useState } from 'react';
import { Input, Spin, message } from 'antd';
import { useCustomNavigate } from '../../../hooks';
import { TextBox } from '../../../stores/atom/text-box';
import SignOutContainer from '../../sign-out';
import { ROUTES } from '../../../constants/routes';
import { useRecoilValue } from 'recoil';
import { memberState } from '../../../stores/atom/member-atom';
import MemberAPI from '../../../api/member-api';
const { Search } = Input;

const MainHeader = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { handleChangeUrl } = useCustomNavigate();
  const [inputDisabled, setInputDisabled] = useState(false);
  const showMessage = SignOutContainer();
  const memberData = useRecoilValue(memberState);
  const onSearch = (value) => {
    // test
    if (value.length > 0) {
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
        handleChangeUrl(`/search/${value}`);
      }, 2000);
    } else if (value.length === 0) {
      setInputDisabled(true);
      message.error({
        content: (
          <TextBox typography="body3" fontWeight={'400'}>
            검색어를 입력해주세요.
          </TextBox>
        ),
        duration: 2,
        style: {
          width: '346px',
          height: '41px',
        },
      });
      setTimeout(() => {
        setInputDisabled(false);
        setOpen(false);
      }, 1000);
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Navbar>
      <Logo
        onClick={() => {
          handleChangeUrl('/');
        }}
      >
        HANS
      </Logo>
      <NavLinks>
        <NavLink onClick={() => handleChangeUrl(ROUTES.HOME)}>Home</NavLink>
        <NavLink onClick={() => handleChangeUrl(ROUTES.STYLE)}>Style</NavLink>
        <NavLink onClick={() => handleChangeUrl(ROUTES.MYPAGE)}>
          My Page
        </NavLink>
      </NavLinks>
      <Profile>
        <>
          <StyledSearchIcon onClick={showModal} />
          <SearchContainer
            open={open}
            onSearch={onSearch}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            modalText={
              <>
                {!confirmLoading && (
                  <StyledSearch
                    placeholder="ex) 여름"
                    allowClear
                    onSearch={onSearch}
                    disabled={inputDisabled}
                  />
                )}
                {confirmLoading && (
                  <LoadingContainer>
                    <BlackSpin size="large" />
                  </LoadingContainer>
                )}
              </>
            }
          />
        </>

        {memberData[0].nickname === '' && memberData[0].profileImage === '' ? (
          <>
            <ProfileImage>
              <LoginOutlined
                style={{ fontSize: '3vh' }}
                onClick={() => {
                  handleChangeUrl(ROUTES.HOME);
                }}
              />
            </ProfileImage>
          </>
        ) : (
          <>
            <StyledLogoutIcon
              onClick={async () => {
                try {
                  await MemberAPI.signOutAPI();
                  showMessage();
                } catch (error) {
                  message.error({
                    content: (
                      <TextBox typography="body3" fontWeight={'400'}>
                        로그아웃에 실패했습니다.
                      </TextBox>
                    ),
                    duration: 2,
                    style: {
                      width: '346px',
                      height: '41px',
                    },
                  });
                  handleChangeUrl(ROUTES.HOME);
                }
              }}
            />
            <ProfileImage>
              <span role="img" aria-label="user">
                {memberData[0].profileImage}{' '}
              </span>
            </ProfileImage>
            <span>{memberData[0].nickname}</span>
          </>
        )}
      </Profile>
    </Navbar>
  );
};

const Navbar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const Logo = styled.div`
  flex: 1;
  font-size: 4vh;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const NavLinks = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 3vw;
`;

const NavLink = styled.a`
  text-decoration: none;
  color: black;
  font-size: 2.2vh;
`;

const StyledSearchIcon = styled(SearchOutlined)`
  font-size: 3vh;
  margin-right: 0.5vw;
`;

const StyledLogoutIcon = styled(LogoutOutlined)`
  font-size: 3vh;
  margin-right: 1vw;
`;

const Profile = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5vw;
`;

const ProfileImage = styled.div`
  width: 4vh;
  height: 4vh;
  border-radius: 50%;
  background-color: #d8d8d8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1vw;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const BlackSpin = styled(Spin)`
  .ant-spin-dot {
    i {
      background: black; // Change background color to black
    }
  }
`;

const StyledSearch = styled(Input.Search)`
  width: 100%;
  .ant-input-outlined:hover,
  .ant-input-outlined:focus-within {
    border-color: black !important;
  }

  .ant-input-group-addon:last-child .ant-input-search-button:hover {
    border-color: black !important;
  }

  .css-dev-only-do-not-override-3rel02 .ant-btn.ant-btn-icon-only .anticon {
    font-size: 16px;
    color: black;
  }
`;

export default MainHeader;
