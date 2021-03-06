
export default {
  'GET /rest/dashboardInfo':
  {
    code: 200,
    msg: null,
    content: {
      "jobInfoCount": 1,
      "jobLogCount": 2,
      "executorCount": 0,
      "jobLogSuccessCount": 0
    }
  },
  'GET /rest/chartInfo':
  {
    code: 200,
    msg: null,
    content: {
      "triggerCountFailTotal": 0,
      "triggerCountSucTotal": 0,
      "triggerCountRunningTotal": 0,
      "triggerDayList": ["2021-02-25", "2021-02-26", "2021-02-27", "2021-02-28", "2021-03-01", "2021-03-02", "2021-03-03"],
      "triggerDayCountRunningList": [0, 0, 0, 0, 0, 0, 0],
      "triggerDayCountFailList": [0, 0, 0, 0, 0, 0, 0],
      "triggerDayCountSucList": [0, 0, 0, 0, 0, 0, 0]
    }
  }
};
