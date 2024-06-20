import { colors } from '../../constants/colors';
import ValidateSchema from '../../utils/modify/validateSchema';
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { TextBox } from '../../stores/atom/text-box';
import { useCustomNavigate } from '../../hooks';
import { Button, Input, Layout, message, Upload, Image } from 'antd';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CustomFooter from '../layouts/footer';
import MemberAPI from '../../api/member-api';
import { useSetRecoilState } from 'recoil'; // Import useSetRecoilState
import { memberState } from '../../stores/atom/member-atom'; // Import memberState atom
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
const ModifyContainer = () => {
  const setMemberState = useSetRecoilState(memberState); // Access to setMemberState
  const { handleChangeUrl } = useCustomNavigate();
  const [nicknameDisabled, setNicknameDisabled] = useState(false);
  const [checkOne, setCheckOne] = useState(false);
  const [checkTwo, setCheckTwo] = useState(false);
  const [checkTwo_1, setCheckTwo_1] = useState(false);
  const [checkTwo_2, setCheckTwo_2] = useState(false);
  const [checkThree, setCheckThree] = useState(false);
  const [checkFour, setCheckFour] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [nicknameError, setNicknameError] = useState(false);
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      files: [],
      nickname: '',
      password: '',
      checkPassword: '',
    },
    validationSchema: ValidateSchema,
    onSubmit: async (values) => {
      // handle form submission
      console.log(values.files[0].blobUrl);
      try {
        await MemberAPI.editMemberInfoAPI({
          profileImg: values.files[0].blobUrl,
          nickname: values.nickname,
          password: values.password,
        });
        const updatedMemberData = {
          nickname: values.nickname,
          profileImage: values.files[0].blobUrl,
        };
        setMemberState(updatedMemberData);
        message.success({
          content: (
            <TextBox typography="body3" fontWeight={'400'}>
              성공적으로 수정했습니다.
            </TextBox>
          ),
          duration: 2,
          style: {
            width: '346px',
            height: '41px',
          },
        });
        setIsSubmitted(true);
      } catch (error) {
        console.error(error);
        message.error({
          content: (
            <TextBox typography="body3" fontWeight={'400'}>
              입력 형식을 확인해주세요.
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
  useEffect(() => {
    if (isSubmitted) {
      navigate('/mypage');
    }
  }, [isSubmitted, navigate]);
  useEffect(() => {
    if (touched.password && errors.password) {
      setCheckThree(false);
    }
    if (errors.password === undefined && values.password.length > 0) {
      setCheckThree(true);
    }
    if (
      values.password !== values.checkPassword &&
      values.checkPassword.length > 0
    ) {
      setCheckFour(false);
    }
    if (
      values.password === values.checkPassword &&
      values.checkPassword.length > 0
    ) {
      setCheckFour(true);
    }
    setIsDisabled(!(checkOne && checkTwo && checkThree && checkFour));
    console.log(checkOne, checkTwo, checkThree, checkFour);
    // console.log(
    //   values.file,
    //   values.checkPassword,
    //   values.password,
    //   values.nickname,
    // );
  }, [values.files, values.checkPassword, values.password, values.nickname]);

  useEffect(() => {
    setIsDisabled(!(checkOne && checkTwo && checkThree && checkFour));
  }, [checkOne, checkTwo, checkThree, checkFour]);

  useEffect(() => {
    if (values.nickname.length >= 0) {
      setNicknameError(false);
      setCheckTwo_2(false);
      setCheckTwo_1(false);
    }
  }, [values.nickname]);

  useEffect(() => {
    // console.log(formik.values.files.length);
    if (formik.values.files.length === 1) setCheckOne(true);
    else setCheckOne(false);
  }, [formik.values.files]);
  useEffect(() => {
    setIsNicknameValid(!errors.nickname && values.nickname.length > 0);
  }, [errors.nickname, values.nickname]);

  const handleNicknameCheck = async () => {
    if (values.nickname.length > 0 && (!touched.nickname || !errors.nickname)) {
      try {
        await MemberAPI.checkDuplicatedNicknameAPI({
          nickname: formik.values.nickname,
        });
        setNicknameDisabled(true);
        setCheckTwo(true);

        setCheckTwo_2(false);
      } catch (error) {
        console.error(error);
        setCheckTwo_2(true);
        message.error({
          content: (
            <TextBox typography="body3" fontWeight={'400'}>
              중복된 닉네임 입니다.
            </TextBox>
          ),
          duration: 2,
          style: {
            width: '346px',
            height: '41px',
          },
        });
      }
    } else if (values.nickname.length === 0) {
      setNicknameError(true);
    }
  };

  // useEffect(() => {
  //   if (values.file !== undefined && values.file.size > 2 * 1024 * 1024) {
  //     setCheckOne(false);
  //   } else if (
  //     values.file !== undefined &&
  //     values.file.size <= 2 * 1024 * 1024
  //   ) {
  //     setCheckOne(true);
  //   } else if (values.file === undefined || values.file === null) {
  //     setCheckOne(false);
  //   }
  // }, [values.file]);

  // const handleFileChange = (event) => {
  //   const file = event.currentTarget.files[0];
  //   formik.setFieldValue('file', file);

  //   if (file && !errors.file) {
  //     // Check if the file type is supported (JPG, JPEG, GIF, PNG)
  //     if (
  //       ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'].includes(
  //         file.type,
  //       )
  //     ) {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         const url = URL.createObjectURL(file);
  //         console.log(url); // Log the URL when thumbnail is about to be displayed
  //         setThumbnail(reader.result); // Set thumbnail image to state
  //         setUploadedUrl(url); // Optionally store the URL in state
  //       };
  //       reader.readAsDataURL(file);
  //     } else {
  //       console.log(
  //         '지원하지 않는 파일 형식입니다. JPG, JPEG, GIF, PNG 파일을 업로드하세요.',
  //       ); // Log error message for unsupported file types
  //       // Optionally, provide user feedback or handle unsupported file types
  //     }
  //   }
  // };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChangeFile = ({ fileList }) => {
    const validFiles = [];
    const filePromises = fileList.map((file) =>
      yup
        .object()
        .shape({
          originFileObj: yup
            .mixed()
            .required('이미지를 업로드해주세요.')
            .test(
              'fileType',
              '지원하는 파일 형식은 JPG, JPEG, GIF, PNG 입니다.',
              (value) => {
                if (!value) return false; // Handle empty values
                const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
                return (
                  validTypes.includes(value.type) ||
                  value.name.match(/\.(jpg|jpeg|png|gif)$/i)
                );
              },
            ),
        })
        .validate({ originFileObj: file.originFileObj }, { abortEarly: false })
        .then(async () => {
          const blobUrl = await getBase64(file.originFileObj);
          validFiles.push({
            ...file,
            originFileObj: file.originFileObj,
            blobUrl,
          });
        })
        .catch((error) => {
          message.error(error.message);
        }),
    );

    Promise.all(filePromises).then(() => {
      formik.setFieldValue('files', validFiles);
    });
  };
  const handleRemove = (file) => {
    const updatedFiles = formik.values.files.filter((f) => f.uid !== file.uid);
    formik.setFieldValue('files', updatedFiles);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <>
      <StyledLayout>
        <StyledContent>
          <TitleContainer>
            <TextBox
              typography="h2"
              fontWeight={'700'}
              textAlign="center"
              cursor="default"
            >
              회원 정보 수정
            </TextBox>
          </TitleContainer>
          <FormContainer onSubmit={handleSubmit}>
            <TextBox variant="body2" fontWeight={'400'} cursor="default">
              프로필 사진
            </TextBox>

            <div>
              <div style={{ width: '50vw' }}>
                <Upload
                  name="files"
                  listType="picture-card"
                  fileList={formik.values.files}
                  onPreview={handlePreview}
                  onChange={handleChangeFile}
                  onBlur={formik.handleBlur}
                  onRemove={handleRemove}
                  beforeUpload={() => false}
                  style={{
                    margin: '0 auto',
                    display: 'flex',
                    flexWrap: 'wrap !important',
                  }}
                >
                  {formik.values.files.length > 0 ? null : uploadButton}
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterClose: () => setPreviewImage(''),
                    }}
                    src={previewImage}
                  />
                )}
              </div>
            </div>

            {/* Nickname */}
            <TextBox typography="body2" fontWeight={'400'} cursor="default">
              닉네임
            </TextBox>
            <EmailInner>
              <EmailInput>
                {/* Input for nickname */}
                <StyledInput
                  size="large"
                  placeholder="닉네임 입력"
                  type="text"
                  name="nickname"
                  value={values.nickname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={nicknameDisabled}
                  style={{
                    borderColor: checkTwo_1
                      ? `${colors.error}`
                      : checkTwo_2
                        ? `${colors.error}`
                        : nicknameError
                          ? `${colors.error}`
                          : values.nickname.length === 0
                            ? errors.nickname && touched.nickname
                              ? `${colors.error}`
                              : `${colors.black600}`
                            : nicknameError ||
                                (errors.nickname && touched.nickname)
                              ? `${colors.error}`
                              : `${colors.success}`,
                  }}
                />
                {nicknameError && (
                  <TextBox typography="body4" fontWeight={'400'} color="error">
                    닉네임은 최소 한 글자 이상이어야 합니다.
                  </TextBox>
                )}
                {nicknameError ||
                  (touched.nickname && errors.nickname && (
                    <TextBox
                      typography="body4"
                      fontWeight={'400'}
                      color="error"
                    >
                      {errors.nickname}
                    </TextBox>
                  ))}
                {checkTwo && (
                  <TextBox
                    typography="body4"
                    fontWeight={'400'}
                    color="success"
                    cursor="default"
                  >
                    사용 가능한 닉네임입니다.
                  </TextBox>
                )}
                {checkTwo_1 && (
                  <TextBox
                    typography="body4"
                    fontWeight={'400'}
                    color="error"
                    cursor="default"
                  >
                    닉네임은 최소 한 글자 이상이어야 합니다.
                  </TextBox>
                )}
                {checkTwo_2 && (
                  <TextBox
                    typography="body4"
                    fontWeight={'400'}
                    color="error"
                    cursor="default"
                  >
                    중복된 닉네임입니다.
                  </TextBox>
                )}
              </EmailInput>
              {/* Button to check nickname availability */}
              <ButtonInput>
                <StyledButton
                  disabled={nicknameDisabled}
                  onClick={handleNicknameCheck}
                >
                  <TextBox
                    typography="h5"
                    fontWeight={'500'}
                    textAlign="center"
                    color={nicknameDisabled ? 'white' : 'primary'}
                  >
                    중복확인
                  </TextBox>
                </StyledButton>
              </ButtonInput>
            </EmailInner>

            {/* Password */}
            <PasswordInput>
              <TextBox typography="body2" fontWeight={'400'} cursor="default">
                비밀번호
              </TextBox>
              <StyledInputPassword
                size="large"
                placeholder="비밀번호 입력"
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  borderColor:
                    values.password.length === 0
                      ? errors.password && touched.password
                        ? `${colors.error}`
                        : `${colors.black600}`
                      : errors.password && touched.password
                        ? `${colors.error}`
                        : `${colors.success}`,
                }}
              />
              {/* Error message for password */}
              {touched.password && errors.password && (
                <TextBox typography="body4" color="error">
                  {errors.password}
                </TextBox>
              )}
              {/* Password criteria message */}
              {errors.password === undefined && values.password.length > 0 && (
                <TextBox typography="body4" fontWeight={'400'} color="success">
                  8~20자 영문(대,소문자)/숫자 조합
                </TextBox>
              )}
            </PasswordInput>

            {/* Confirm Password */}
            <PasswordInput>
              <TextBox typography="body2" fontWeight={'400'} cursor="default">
                비밀번호 확인
              </TextBox>
              <StyledInputPassword
                size="large"
                placeholder="비밀번호 재입력"
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
                name="checkPassword"
                value={values.checkPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{
                  borderColor:
                    values.checkPassword.length === 0
                      ? errors.checkPassword && touched.checkPassword
                        ? colors.error
                        : colors.black600
                      : values.password !== values.checkPassword
                        ? colors.error
                        : colors.success,
                }}
              />
              {/* Error message for password confirmation */}
              {touched.checkPassword && errors.checkPassword && (
                <TextBox typography="body4" color="error">
                  {errors.checkPassword}
                </TextBox>
              )}
              {/* Success message for matching passwords */}
              {values.password === values.checkPassword &&
                values.checkPassword.length > 0 && (
                  <TextBox typography="body4" color="success">
                    비밀번호가 일치합니다.
                  </TextBox>
                )}
            </PasswordInput>

            {/* Buttons */}
            <ButtonContainer>
              {/* Previous button */}
              <StyledPrevButton
                onClick={() => {
                  handleChangeUrl('/signup/agreement');
                }}
              >
                <TextBox
                  typography="h5"
                  fontWeight={'700'}
                  textAlign="center"
                  color="primary"
                >
                  이전
                </TextBox>
              </StyledPrevButton>
              {/* Submit button */}
              <StyledDoneButton
                htmlType="submit"
                disabled={isDisabled}
                type="primary"
              >
                <TextBox
                  typography="h5"
                  fontWeight={'700'}
                  textAlign="center"
                  color="white"
                >
                  수정 완료
                </TextBox>
              </StyledDoneButton>
            </ButtonContainer>
          </FormContainer>
        </StyledContent>
      </StyledLayout>
      <CustomFooter />
    </>
  );
};

const StyledLayout = styled(Layout)`
  max-width: 100vw;
  background-color: white;
`;

const StyledContent = styled(Layout.Content)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 52px;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  padding-bottom: 10vh;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 390px;
`;

const StyledInput = styled(Input)`
  height: 54px;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
  &:read-only {
    border: 1px solid ${colors.success};
  }
`;

const StyledButton = styled(Button)`
  width: 112px;
  height: 54px;
  border: 1px solid ${colors.black900};
  &:disabled {
    background-color: ${colors.black600};
  }
  &:disabled:hover {
    background-color: ${colors.black900} !important;
  }
  &:hover {
    background-color: white !important;
    border-color: ${colors.black900} !important;
    color: ${colors.black900} !important;
  }
`;

const EmailInner = styled.div`
  display: flex;
  gap: 8px;
`;

const EmailInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 266px;
  gap: 8px;
`;

const ButtonInput = styled.div``;

const PasswordInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

const StyledInputPassword = styled(Input.Password)`
  height: 54px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const StyledPrevButton = styled(Button)`
  width: 150px;
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

const StyledDoneButton = styled(Button)`
  width: 300px;
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

const TitleContainer = styled.div``;
export default ModifyContainer;
