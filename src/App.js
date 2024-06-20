import React from 'react';
import { ROUTES } from './constants/routes';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import SignIn from './pages/sign-in';
import SignUpAgreement from './pages/sign-up-agreement';
import SignUp from './pages/sign-up';
import SignUpSuccess from './pages/sign-up-success';
import Detail from './pages/detail';
import AuthLayout from './authLayout';
import MainLayout from './mainLayout';
import Search from './pages/search';
import Style from './pages/style';
import Post from './pages/post';
import MyPage from './pages/my-page';
import Modify from './pages/modify';
import Edit from './pages/edit';
import Error404 from './pages/errors/error404';
import { getCookie } from './utils/cookie';
function App() {
  const accessToken = getCookie('accessToken');
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.EDIT.replace(':postId', ':postId')}
          element={
            !accessToken ? (
              <Navigate to="/" />
            ) : (
              <MainLayout>
                <Edit />
              </MainLayout>
            )
          }
        ></Route>
        <Route
          path={ROUTES.ERROR_404}
          element={
            <MainLayout>
              <Error404 />
            </MainLayout>
          }
        ></Route>
        <Route
          path={ROUTES.POST}
          element={
            !accessToken ? (
              <Navigate to="/" />
            ) : (
              <MainLayout>
                <Post />
              </MainLayout>
            )
          }
        ></Route>
        <Route path={ROUTES.MODIFY} element={<Modify />}></Route>
        <Route
          path={ROUTES.MYPAGE}
          element={
            !accessToken ? (
              <Navigate to="/" />
            ) : (
              <MainLayout>
                <MyPage />
              </MainLayout>
            )
          }
        ></Route>
        <Route
          path={ROUTES.HOME}
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path={`${ROUTES.SEARCH}/:query`}
          element={
            <MainLayout>
              <Search />
            </MainLayout>
          }
        ></Route>
        <Route
          path={ROUTES.SIGNIN}
          element={
            accessToken ? (
              <Navigate to="/" />
            ) : (
              <AuthLayout title="">
                <SignIn />
              </AuthLayout>
            )
          }
        />
        <Route
          path={ROUTES.SIGNUP_AGREEMENT}
          element={
            accessToken ? (
              <Navigate to="/" />
            ) : (
              <AuthLayout title="서비스 이용 동의">
                <SignUpAgreement />
              </AuthLayout>
            )
          }
        />
        <Route
          path={ROUTES.SIGNUP}
          element={
            accessToken ? (
              <Navigate to="/" />
            ) : (
              <AuthLayout title="회원 정보 입력">
                <SignUp />
              </AuthLayout>
            )
          }
        />
        <Route
          path={ROUTES.SIGNUP_SUCCESS}
          element={
            accessToken ? (
              <Navigate to="/" />
            ) : (
              <AuthLayout title="">
                <SignUpSuccess />
              </AuthLayout>
            )
          }
        />
        <Route
          path={ROUTES.DETAIL.replace(':postId', ':postId')} // ':postId'를 사용하는 동적 경로 설정
          element={
            <MainLayout>
              <Detail />
            </MainLayout>
          }
        />
        <Route
          path={ROUTES.STYLE}
          element={
            <MainLayout>
              <Style />
            </MainLayout>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
