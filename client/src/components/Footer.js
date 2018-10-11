import React from 'react';
import { USER_NAME } from '../constants';

export default () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
      Hello *{localStorage.getItem(USER_NAME)}* , Welcome to Resource Links! [ © {new Date().getFullYear()}]
    </footer>
  );
};
