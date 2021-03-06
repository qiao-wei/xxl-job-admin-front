export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/welcome',
              },
              {
                path: '/welcome',
                name: 'welcome',
                icon: 'smile',
                component: './Welcome',
              },
              // {
              //   name: 'list.table-list',
              //   icon: 'table',
              //   path: '/list',
              //   component: './TableList',
              // },
              {
                name: 'jobs',
                icon: 'table',
                path: '/jobs',
                component: './Job',
              },
              {
                name: 'job-logs',
                icon: 'group',
                path: '/jobLogs',
                component: './JobLog',
              },
              {
                name: 'job-groups',
                icon: 'setting',
                path: '/jobGroups',
                component: './JobGroup',
                authority: ['admin'],
              },
              {
                name: 'users',
                icon: 'user',
                path: '/users',
                component: './User',
                authority: ['admin'],
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
