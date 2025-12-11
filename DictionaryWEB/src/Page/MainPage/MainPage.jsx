import style from './style.module.css';
import { useEffect } from 'react';

import Header from './Header/Header.jsx';
import LessonNotExist from './LessonNotExist/LessonNotExist.jsx';
import AddLesson from './AddLesson/AddLesson.jsx';
import LessonExist from './LessonExist/LessonExist.jsx';
import Lesson from './Lesson/Lesson.jsx';
import FullScreenLoadingAnimation from '@components/fullScreenLoadingAnimation.jsx';

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useIsAnyLesson } from '@hooks/LessonHooks/useIsAnyLesson.js';

function MainPage() {
  const location = useLocation();
  const { isHaveLesson, isLoad, UpdateIsHaveLesson } = useIsAnyLesson();

  useEffect(() => {
    UpdateIsHaveLesson();
  }, [location]);

  return (
    <div className={style.mainPage}>
      <Header className={style.header} />
      <div className={style.body}>
        <div className={style.headerSpace}></div>
        <Routes>
          <Route path="/" element={isHaveLesson ? <LessonExist /> : <LessonNotExist />} />
          <Route path="/AddLesson" element={<AddLesson />} />
          <Route path="/Lesson/:lessonName" element={<Lesson />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {isLoad && <FullScreenLoadingAnimation backgroundStyle={{ backdropFilter: 'blur(0.6vh)', background: '#0a112873' }} />}
    </div>
  );
}

export default MainPage;