import { Card, CardContent, CardHeader, Paper } from '@mui/material';
import React, { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
  title: string;
};

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center bg-gray-100">
      <div className="flex flex-col max-w-xl h-full justify-center items-center">
        <Card variant="outlined" className="w-[600px] h-[600px] flex flex-col justify-center items-center">
          <CardHeader title={title} />
          <CardContent className="flex flex-col h-[400px] w-full my-10 justify-center items-center">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Layout;
