import type { MenuDataItem } from '@ant-design/pro-layout';
import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import type { ConnectProps } from 'umi';
import { Link, SelectLang, useIntl, connect, FormattedMessage } from 'umi';
import React from 'react';
import type { ConnectState } from '@/models/connect';
import logo from '../assets/logo.svg';
/* import logo from '../assets/logo.png'; */
import styles from './UserLayout.less';
import { GithubOutlined } from '@ant-design/icons';

export type UserLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
} & Partial<ConnectProps>;

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                {/* <span className={styles.title}>XXL job</span> */}
                <span className={styles.title}>
                  <FormattedMessage id="pages.layouts.userLayout.title" defaultMessage="任务调度平台" />
                </span>
              </Link>
            </div>
            <div className={styles.desc}>
              <FormattedMessage id="pages.layouts.userLayout.sub-title" defaultMessage="任务调度平台" />
            </div>
          </div>
          {children}
        </div>
        {/* <DefaultFooter /> */}

        <DefaultFooter
          copyright={`${new Date().getFullYear()} Xxl Job`}
          links={[
            {
              key: 'Xxl Job',
              title: 'Xxl Job',
              href: 'https://www.xuxueli.com/xxl-job/',
              blankTarget: true,
            },
            {
              key: 'github',
              title: <GithubOutlined />,
              href: 'https://github.com/xuxueli/xxl-job/',
              blankTarget: true,
            },
            {
              key: 'Ant Design Pro',
              title: 'Ant Design Pro',
              href: 'https://pro.ant.design',
              blankTarget: true,
            },
          ]}
        />
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
