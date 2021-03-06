import { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

async function getFakeCaptcha(req: Request, res: Response) {
  await waitTime(2000);
  return res.json('captcha-xxx');
}

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /rest/users/i': {
    code: 200,
    msg: '',
    content: {
      id: 1,
      username: 'admin',
      role: 1,
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      // notifyCount: 12,
      // unreadCount: 11,
      // country: 'China',
    }
  },
  // GET POST 可省略
  'GET /rest/users': {
    code: 200,
    msg: '',
    content:
    {
      total: 100,
      current: 1,
      pageSize: 10,
      data: [
        {
          id: 1,
          username: 'admin',
          avatar: '',
          role: 1,
          permission: '',
        },
        {
          id: 2,
          username: 'user',
          avatar: '',
          role: 0,
          permission: '',
        },
      ]
    }
  },
  'POST /rest/login': async (req: Request, res: Response) => {
    const { password, username } = req.body;
    await waitTime(2000);
    if (password === 'admin' && username === 'admin') {
      res.send({
        code: 200,
        msg: 'success',
        content: {
          "id": 1,
          "username": "admin",
          "password": null,
          "role": 1,
          "permission": null
        }
      });
      return;
    }

    res.send({
      code: 500,
      msg: 'error',
      content: null
    });
  },
  'POST /rest/users': (req: Request, res: Response) => {
    res.send({ code: 200, msg: '', content: '' });
  },
  'PUT /rest/users/(.*)': (req: Request, res: Response) => {
    let id = parseInt(req.params[0], 10);
    res.send({ code: 500, msg: id + '保存失败', content: '' });
  },
  'DELETE /rest/users/(.*)': (req: Request, res: Response) => {
    let id = parseInt(req.params[0], 10);
    res.send({ code: 200, msg: id + '删除成功', content: '' });
  },
  'GET /api/500': (req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req: Request, res: Response) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },

  'GET  /api/login/captcha': getFakeCaptcha,
};
