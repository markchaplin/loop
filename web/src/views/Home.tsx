import React from 'react';
import { Button } from '@mui/material';

type HomeViewProps = {
  onLogin: () => void;
  onSignin: () => void;
};

const HomeView: React.FC<HomeViewProps> = ({ onLogin, onSignin }) => {
  return (
    <div className="flex flex-col justify-between h-1/2 w-1/2 items-center">
      <div className="text-base">Get started</div>
      <div className='flex flex-row justify-between w-full items-center'>
        <Button  size="large" onClick={onLogin}>
          Log In
        </Button>
        <Button  size="large" onClick={onSignin}>
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default HomeView;
