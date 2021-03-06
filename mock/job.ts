import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略
  'GET /rest/jobs':
  {
    "code": 200,
    "msg": null,
    "content": {
      "total": 1,
      "current": 1,
      "pageSize": 10,
      "data": [{
        "id": 1,
        "jobGroup": 1,
        "jobDesc": "测试任务1",
        "addTime": "2018-11-03T14:21:31.000+00:00",
        "updateTime": "2018-11-03T14:21:31.000+00:00",
        "author": "XXL",
        "alarmEmail": "",
        "scheduleType": "CRON",
        "scheduleConf": "0 0 0 * * ? *",
        "misfireStrategy": "DO_NOTHING",
        "executorRouteStrategy": "FIRST",
        "executorHandler": "demoJobHandler",
        "executorParam": "",
        "executorBlockStrategy": "SERIAL_EXECUTION",
        "executorTimeout": 0,
        "executorFailRetryCount": 0,
        "glueType": "BEAN",
        "glueSource": "",
        "glueRemark": "GLUE代码初始化",
        "glueUpdatetime": "2018-11-03T14:21:31.000+00:00",
        "childJobId": "",
        "triggerStatus": 0,
        "triggerLastTime": 0,
        "triggerNextTime": 0
      }]
    }
  },
  'GET /rest/jobs/all':
  {
    "code": 200,
    "msg": null,
    "content":
      [{
        "id": 1,
        "jobGroup": 1,
        "jobDesc": "测试任务1",
        "addTime": "2018-11-03T14:21:31.000+00:00",
        "updateTime": "2018-11-03T14:21:31.000+00:00",
        "author": "XXL",
        "alarmEmail": "",
        "scheduleType": "CRON",
        "scheduleConf": "0 0 0 * * ? *",
        "misfireStrategy": "DO_NOTHING",
        "executorRouteStrategy": "FIRST",
        "executorHandler": "demoJobHandler",
        "executorParam": "",
        "executorBlockStrategy": "SERIAL_EXECUTION",
        "executorTimeout": 0,
        "executorFailRetryCount": 0,
        "glueType": "BEAN",
        "glueSource": "",
        "glueRemark": "GLUE代码初始化",
        "glueUpdatetime": "2018-11-03T14:21:31.000+00:00",
        "childJobId": "",
        "triggerStatus": 0,
        "triggerLastTime": 0,
        "triggerNextTime": 0
      }]
  },
  'POST /rest/jobs': (req: Request, res: Response) => {
    res.send({ code: 200, msg: '', content: '' });
  },
  'POST /rest/jobs/(.*)/start': (req: Request, res: Response) => {
    res.send({ code: 200, msg: '启动成功', content: '' });
  },
  'POST /rest/jobs/(.*)/stop': (req: Request, res: Response) => {
    res.send({ code: 200, msg: '停止成功', content: '' });
  },
  'POST /rest/jobs/(.*)/trigger': (req: Request, res: Response) => {
    res.send({ code: 200, msg: '执行成功', content: '' });
  },
  'GET /rest/jobs/nextTriggerTimes': (req: Request, res: Response) => {
    res.send({ code: 200, msg: '执行成功', content: ['2020-01-01 00:00:01', '2020-01-01 00:00:02', '2020-01-01 00:00:03'] });
  },
  'PUT /rest/jobs/(.*)': (req: Request, res: Response) => {
    let id = parseInt(req.params[0], 10);
    res.send({ code: 500, msg: id + '保存失败', content: '' });
  },
  'DELETE /rest/jobs/(.*)': (req: Request, res: Response) => {
    let id = parseInt(req.params[0], 10);
    res.send({ code: 200, msg: id + '删除成功', content: '' });
  },
};
