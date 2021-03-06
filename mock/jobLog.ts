import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // GET POST 可省略
  'GET /rest/jobLogs':
  {
    "code": 200,
    "msg": null,
    "content": {
      "total": 1,
      "current": 1,
      "pageSize": 10,
      "data": [
        {
          "id": 1,
          "jobGroup": 1,
          "jobId": 1,
          "executorAddress": null,
          "executorHandler": "demoJobHandler",
          "executorParam": "",
          "executorShardingParam": null,
          "executorFailRetryCount": 0,
          "triggerTime": "2021-02-23 08:50:45",
          "triggerCode": 500,
          "triggerMsg": "任务触发类型：手动触发<br>调度机器：192.168.50.13<br>执行器-注册方式：自动注册<br>执行器-地址列表：null<br>路由策略：第一个<br>阻塞处理策略：单机串行<br>任务超时时间：0<br>失败重试次数：0<br><br><span style=\"color:#00c0ef;\" > >>>>>>>>>>>触发调度<<<<<<<<<<< </span><br>调度失败：执行器地址为空<br><br>",
          "handleTime": null,
          "handleCode": 0,
          "handleMsg": "dsfdsf",
          "alarmStatus": 1
        }
      ]
    }
  },
  'POST /rest/jobLogs': (req: Request, res: Response) => {
    res.send({ code: 200, msg: '', content: '' });
  },
  'PUT /rest/jobLogs/(.*)': (req: Request, res: Response) => {
    let id = parseInt(req.params[0], 10);
    res.send({ code: 500, msg: id + '保存失败', content: '' });
  },
  'DELETE /rest/jobLogs)': (req: Request, res: Response) => {
    res.send({ code: 200, msg: '删除成功', content: '' });
  },
};
