import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography, Col, Row, Divider, Radio } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import styles from './Welcome.less';
import Icon, { FlagOutlined, FlagTwoTone } from '@ant-design/icons';
import { getChartInfo, getDashboardInfo } from '@/services/welcome';
import { DatePicker, Space } from 'antd';
import ReactECharts from 'echarts-for-react';
const { RangePicker } = DatePicker;

const moment = require('moment');

const JobInfoLabel: React.FC<{
  icon?: any,
  bg?: string,
  title?: string,
  count?: string,
  subTitle?: string,
}> = ({ children, bg = 'red', icon, title, count, subTitle }) => (
  <Row style={{ flex: 1, backgroundColor: bg, }}>
    <Col style={{ width: 100, alignItems: 'center', background: 'rgba(0, 0, 0, 0.2)' }}>
      {/* <Icon name='key' style={{ flex: 1 }} /> */}
      {icon}
    </Col>
    <Col flex={1} style={{ paddingLeft: 6 }}>
      <div style={{ color: 'white', marginTop: 10 }}>{title}</div>
      <div style={{ color: 'white' }}>{count}</div>
      <div style={{ backgroundColor: 'white', display: 'block', height: 3, marginTop: 10, marginBottom: 3 }} />
      <div style={{ color: 'white', borderTopColor: 'white', borderTopWidth: 2 }}>{subTitle}</div>
    </Col>
  </Row >
);


export default (): React.ReactNode => {
  const intl = useIntl();

  const [dashboardInfo, setDashboardInfo] = useState<any>({});
  const [chartInfo, setChartInfo] = useState<any>({});
  const [queryDateRange, setQueryDateRange] = useState<any>([moment('2021-01-01'), moment('2021-01-03')]);

  const handleChangeQueryDateRange = async (queryDateRange: any) => {
    setQueryDateRange(queryDateRange);
    const [startDate, endDate] = queryDateRange;
    const chartInfo = await getChartInfo(startDate.format('yyyy-MM-DD 00:00:00'), endDate.format('yyyy-MM-DD 23:59:59'));
    setChartInfo(chartInfo.content);
  }

  useEffect(() => {
    const tmp = async () => {
      const dashboardInfo = await getDashboardInfo();
      setDashboardInfo(dashboardInfo.content);
      const nearWeek = [moment().subtract(7, 'd'), moment()];
      handleChangeQueryDateRange(nearWeek);
    }
    tmp();
  }, [])

  const successLabel = intl.formatMessage({
    id: 'pages.welcome.success',
    defaultMessage: '成功'
  });
  const failLabel = intl.formatMessage({
    id: 'pages.welcome.fail',
    defaultMessage: '失败'
  });
  const runningLabel = intl.formatMessage({
    id: 'pages.welcome.running',
    defaultMessage: '进行中'
  })

  const options = {
    title: {
      text: intl.formatMessage({
        id: 'pages.welcome.date.report',
        defaultMessage: '日期分布图'
      })
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: [successLabel, failLabel, runningLabel]
    },
    toolbox: {
      feature: {
        /*saveAsImage: {}*/
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: chartInfo.triggerDayList
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: successLabel,
        type: 'line',
        stack: 'Total',
        areaStyle: { normal: {} },
        data: chartInfo.triggerDayCountSucList
      },
      {
        name: failLabel,
        type: 'line',
        stack: 'Total',
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        areaStyle: { normal: {} },
        data: chartInfo.triggerDayCountFailList
      },
      {
        name: runningLabel,
        type: 'line',
        stack: 'Total',
        areaStyle: { normal: {} },
        data: chartInfo.triggerDayCountRunningList
      }
    ],
    color: ['#00A65A', '#c23632', '#F39C12']
  };


  var options1 = {
    title: {
      text: intl.formatMessage({
        id: 'pages.welcome.success-rate.report',
        defaultMessage: '成功比例图'
      }),
      /*subtext: 'subtext',*/
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: "{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: [successLabel, failLabel, runningLabel]
    },
    series: [
      {
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          {
            name: successLabel,
            value: chartInfo.triggerCountSucTotal
          },
          {
            name: failLabel,
            value: chartInfo.triggerCountFailTotal
          },
          {
            name: runningLabel,
            value: chartInfo.triggerCountRunningTotal
          }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ],
    color: ['#00A65A', '#c23632', '#F39C12']
  };


  return (
    <PageContainer title={false}>
      <Row>
        <Col flex={1} style={{ padding: 10, paddingLeft: 0, height: 30 }}>
          <JobInfoLabel
            icon={
              <FlagOutlined style={{ color: 'white', fontSize: 60, margin: 20 }} />
            }
            bg='#00c0ef'
            title={intl.formatMessage({
              id: 'pages.welcome.job-count.title',
              defaultMessage: '任务数量'
            })}
            count={dashboardInfo.jobInfoCount || 0}
            subTitle={intl.formatMessage({
              id: 'pages.welcome.job-count.sub-title',
              defaultMessage: '调度中心运行的任务数量'
            })}
          />
        </Col>
        <Col flex={1} style={{ padding: 10 }}>
          <JobInfoLabel
            icon={
              <FlagOutlined style={{ color: 'white', fontSize: 60, margin: 20 }} />
            }
            bg='#f39412'
            title={intl.formatMessage({
              id: 'pages.welcome.log-count.title',
              defaultMessage: '调度次数'
            })}
            count={dashboardInfo.jobLogCount || 0}
            subTitle={intl.formatMessage({
              id: 'pages.welcome.log-count.sub-title',
              defaultMessage: '调度中心触发的调度次数'
            })}
          />
        </Col>
        <Col flex={1} style={{ padding: 10 }}>
          <JobInfoLabel
            icon={
              <FlagOutlined style={{ color: 'white', fontSize: 60, margin: 20 }} />
            }
            bg='#00c0ef'
            title={intl.formatMessage({
              id: 'pages.welcome.executor-count.title',
              defaultMessage: '执行器数量'
            })}
            count={dashboardInfo.executorCount || 0}
            subTitle={intl.formatMessage({
              id: 'pages.welcome.executor-count.sub-title',
              defaultMessage: '调度中心在线的执行器机器数量'
            })}
          />
        </Col>
      </Row>
      <Row justify='end'>
        <Col style={{ marginRight: 10 }}>
          <RangePicker
            value={queryDateRange}
            onChange={(e) => {
              // console.log(e);
              // setQueryDateRange(e);
              handleChangeQueryDateRange(e);
            }}
            renderExtraFooter={() =>
            (
              <div>
                <Radio.Group onChange={({ target: { value } }) => {
                  // console.log(value);
                  let range: any = [];
                  if (value === 'today') {
                    range = [moment(), moment()];
                  } else if (value === 'yesteday') {
                    range = [moment().subtract(1, 'd'), moment().subtract(1, 'd')];
                  } else if (value === 'month') {
                    range = [moment(moment().format('yyyy-MM-01')), moment()];
                  } else if (value === 'pre-month') {
                    range = [
                      moment(moment().subtract(1, 'months').format('yyyy-MM-01')),
                      moment(moment().format('yyyy-MM-01')).subtract(1, 'd'),
                    ];
                  } else if (value === 'near-week') {
                    range = [moment().subtract(7, 'd'), moment()];
                  } else if (value === 'near-month') {
                    range = [moment().subtract(1, 'months'), moment()];
                  }
                  handleChangeQueryDateRange(range);
                }}>
                  <Radio.Button value='today'>
                    <FormattedMessage id='pages.dr.today' defaultMessage='今日' />
                  </Radio.Button>
                  <Radio.Button value='yesteday'>
                    <FormattedMessage id='pages.dr.yesteday' defaultMessage='昨日' />
                  </Radio.Button>
                  <Radio.Button value='month'>
                    <FormattedMessage id='pages.dr.month' defaultMessage='本月' />
                  </Radio.Button>
                  <Radio.Button value='pre-month'>
                    <FormattedMessage id='pages.dr.pre-month' defaultMessage='上月' />
                  </Radio.Button>
                  <Radio.Button value='near-week'>
                    <FormattedMessage id='pages.dr.near-week' defaultMessage='最近一周' />
                  </Radio.Button>
                  <Radio.Button value='near-month'>
                    <FormattedMessage id='pages.dr.near-month' defaultMessage='最近一月' />
                  </Radio.Button>
                </Radio.Group>
              </div>
            )
            }
          // showTime
          />
        </Col>
      </Row>
      <Row>
        <Col xs={24} xl={18}>
          <ReactECharts option={options} />
        </Col>
        <Col xs={24} xl={6}>
          <ReactECharts option={options1} />
        </Col>
      </Row>

    </PageContainer>
  );
};
