import * as yup from 'yup';
/** When we sign in to our web site, we use this validation schema.*/
/** This schema used with formik library. */
const ValidateSchema = yup.object({
  email: yup
    .string()
    .matches(/^[^@\s]+@[^\s]+\.[^@\s]+$/, '유효한 이메일 주소를 입력하세요.')
    .required('이메일을 입력하세요.'),
  password: yup.string().required('비밀번호를 입력하세요.'),
});

export default ValidateSchema;
