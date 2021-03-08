import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略
  'GET /rest/jobGroups': {
    "code": 200,
    "msg": null,
    "content": {
      "total": 2,
      "current": 1,
      "pageSize": 10,
      "data": [
        {
          "id": 1,
          "appname": "xxl-job-executor-sample",
          "title": "示例执行器",
          "addressType": 0,
          "addressList": null,
          "updateTime": "2021-02-26T01:27:29.000+00:00",
          "registryList": ['http://127.0.0.1']
        },
        {
          "id": 2,
          "appname": "xxl-job-executor-test",
          "title": "测试执行器",
          "addressType": 0,
          "addressList": null,
          "updateTime": "2021-02-26T01:27:31.000+00:00",
          "registryList": null
        }
      ]
    }
  },
  'GET /rest/jobGroups/i': {
    "code": 200,
    "msg": null,
    "content":
      [
        {
          "id": 1,
          "appname": "xxl-job-executor-sample",
          "title": "示例执行器",
          "addressType": 0,
          "addressList": null,
          "updateTime": "2021-02-26T01:27:29.000+00:00",
          "registryList": null
        },
        {
          "id": 2,
          "appname": "xxl-job-executor-test",
          "title": "测试执行器",
          "addressType": 0,
          "addressList": null,
          "updateTime": "2021-02-26T01:27:31.000+00:00",
          "registryList": null
        }
      ]
  },
  'POST /rest/jobGroups': (req: Request, res: Response) => {
    res.send({ code: 200, msg: '', content: '' });
  },
  'PUT /rest/jobGroups/(.*)': (req: Request, res: Response) => {
    let id = parseInt(req.params[0], 10);
    res.send({ code: 500, msg: id + '保存失败', content: '' });
  },
  'DELETE /rest/jobGroups/(.*)': (req: Request, res: Response) => {
    let id = parseInt(req.params[0], 10);
    res.send({ code: 200, msg: id + '删除成功', content: '' });
  },
};
