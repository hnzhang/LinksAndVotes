import React from 'react';
import { USER_NAME } from '../constants';

export default () => {
  return (
    <footer className="flex pal justify-between nowrap orange">
      Hello *{localStorage.getItem(USER_NAME)}* , Welcome to   with the News Links in {new Date().getFullYear()} !
    </footer>
  );
};
