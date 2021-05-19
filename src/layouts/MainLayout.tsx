import { FC } from 'react';

import cx from 'classnames';

import NaviBar from 'components/Navibar/NaviBar';

export interface MainLayoutProps {
  className?: string;
}

const MainLayout: FC<MainLayoutProps> = ({ children, className }) => {
  return (
    <div className={cx('main-layout flex-column d-flex', className)}>
      <NaviBar />
      <div className="main-layout-content flex-grow-1 position-relative mt-navbar">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
