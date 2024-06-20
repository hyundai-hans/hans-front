import React, { useState } from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import ValidateSchema from '../../utils/sign-in/validateSchema';
import { message, Layout, Input, Button } from 'antd';
import { TextBox } from '../../stores/atom/text-box';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { colors } from '../../constants/colors';
import { useCustomNavigate } from '../../hooks';
import MemberAPI from '../../api/member-api';
import { setCookie } from '../../utils/cookie';
import { ROUTES } from '../../constants/routes';
import { useRecoilValue, useSetRecoilState } from 'recoil'; // Import useSetRecoilState
import { memberState } from '../../stores/atom/member-atom';
const SignInContainer = () => {
  const { handleChangeUrl } = useCustomNavigate();
  const setMemberState = useSetRecoilState(memberState);
  const memberData = useRecoilValue(memberState);
  const [isDisabled, setIsDisabled] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: ValidateSchema,
    onSubmit: async (values) => {
      try {
        setIsDisabled(true);
        const response = await MemberAPI.signInAPI({
          email: values.email,
          password: values.password,
        });
        const accessToken = response.headers.get('Authorization');
        console.log(accessToken);
        if (accessToken) {
          setCookie(accessToken);
        } else {
          console.error('No accessToken in response');
          return;
        }

        try {
          const profileResponse = await MemberAPI.memberProfileAPI();
          const memberResponse = profileResponse.data.data;
          const updatedMemberData = {
            nickname: memberResponse.nickname,
            profileImage: memberResponse.profileImg,
          };
          setMemberState(updatedMemberData);
          handleChangeUrl(ROUTES.HOME);
        } catch (profileError) {
          console.error('Error fetching profile:', profileError);
        }
      } catch (signInError) {
        setIsDisabled(false);

        console.error('Error signing in:', signInError);
        message.error({
          content: (
            <TextBox typography="body3" fontWeight={'400'}>
              아이디와 비밀번호를 확인해주세요.
            </TextBox>
          ),
          duration: 2,
          style: {
            width: '346px',
            height: '41px',
          },
        });
      }
    },
  });

  const { values, touched, errors, handleChange, handleBlur, handleSubmit } =
    formik;

  const handleOnclick = () => {
    if (
      (errors.email && touched.email) ||
      (errors.password && errors.email) ||
      !values.email ||
      !values.password
    ) {
      message.error({
        content: (
          <TextBox typography="body3" fontWeight={'400'}>
            이메일과 비밀번호를 확인해 주세요.
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

  return (
    <FullHeightLayout>
      <StyledContent>
        <Inner>
          <LoginContainer>
            <FormContainer onSubmit={handleSubmit}>
              <StyledInput
                size="large"
                placeholder="이메일 입력"
                type="text"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && (
                <TextBox typography="body4" color="error">
                  {errors.email}
                </TextBox>
              )}
              <StyledPassword
                size="large"
                placeholder="비밀번호 입력"
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
              {touched.password && errors.password && (
                <TextBox typography="body4" color="error">
                  {errors.password}
                </TextBox>
              )}
              <ButtonContainer>
                <LoginButton
                  htmlType="submit"
                  type="primary"
                  onClick={handleOnclick}
                  disabled={isDisabled}
                >
                  <TextBox
                    typography="h5"
                    color={colors.black900}
                    fontWeight={'700'}
                    textAlign="center"
                  >
                    로그인
                  </TextBox>
                </LoginButton>
              </ButtonContainer>
            </FormContainer>
          </LoginContainer>
        </Inner>
        <SignUpContainer>
          <SignUpButton onClick={() => handleChangeUrl('/signup/agreement')}>
            <TextBox
              typography="h5"
              color="white"
              fontWeight={'700'}
              textAlign="center"
            >
              회원가입
            </TextBox>
          </SignUpButton>
        </SignUpContainer>
      </StyledContent>
    </FullHeightLayout>
  );
};

const FullHeightLayout = styled(Layout)`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const StyledContent = styled(Layout.Content)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 52px;
  height: 660px;
  padding: 20px;
  box-sizing: border-box;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.form`
  width: 374px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledInput = styled(Input)`
  height: 54px;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
`;

const StyledPassword = styled(Input.Password)`
  height: 54px;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
`;

const ButtonContainer = styled.div``;

const SignUpButton = styled(Button)`
  width: 100%;
  height: 54px;
  border-radius: 2px;
  padding: 12px 32px 12px 32px;
  border: 1px solid ${colors.black900};
  background-color: ${colors.black900};
  color: white;

  &:hover {
    background-color: ${colors.black900} !important;
    border-color: ${colors.black900} !important;
    color: white !important;
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
  height: 54px;
  border-radius: 2px;
  padding: 12px 32px 12px 32px;
  border: 1px solid ${colors.black900};
  background-color: white;
  color: ${colors.black900};

  &:hover {
    background-color: white !important;
    border-color: ${colors.black900} !important;
    color: ${colors.black900} !important;
  }
`;

const SignUpContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default SignInContainer;
