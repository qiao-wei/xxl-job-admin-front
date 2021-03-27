import { ConsoleSqlOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState, useRef, useEffect } from 'react';
import { Button, message, FormInstance, Drawer, Row, Col, Spin } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormSelect, ProFormText, ProFormRadio } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import type { QueryParam, JobLog } from './data.d';
import { queryLogs, clearLogs, logCat } from './service';
import { queryMyJobGroups } from '../JobGroup/service';
// import { Select, DatePicker } from 'antd';
import { JobGroup } from '../JobGroup/data';
import { queryJobsByGroup } from '../Job/service';
import { Job } from '../Job/data';

const moment = require('moment');

// const RangePicker = DatePicker.RangePicker;
// const Option = Select.Option;

let logCatTimer: any = 0;

const JobLogList: React.FC = (props) => {
  /** 国际化配置 */
  const intl = useIntl();

  /**
   * 清理日志
   *
   * @param fields
   */
  const handleFormSubmit = async (type?: number) => {
    /** 国际化配置 */
    const hide = message.loading(
      intl.formatMessage({
        id: 'pages.common.dealing',
        defaultMessage: '处理中...',
      }),
    );

    try {
      const { code, msg } = await clearLogs(0, 0, type);
      hide();
      if (code === 200) {
        message.success(
          intl.formatMessage({
            id: 'pages.common.delete-success',
            defaultMessage: '删除成功',
          }),
        );
        return true;
      } else {
        message.error(msg);
        return false;
      }
    } catch (error) {
      hide();
      message.error(
        intl.formatMessage({
          id: 'pages.common.delete-fail',
          defaultMessage: '删除失败,请重试',
        }),
      );
      return false;
    }
  };

  /** 清理窗口的弹窗 */
  const [clearModalVisible, handleClearModalVisible] = useState<boolean>(false);
  /** 执行日志的弹窗 */
  const [logModalVisible, handleLogModalVisible] = useState<boolean>(false);
  const [jobDetailVisible, handleJobDetailVisible] = useState<boolean>(false);
  const [triggerMsgVisible, handleTriggerMsgVisible] = useState<boolean>(false);
  const [handleMsgVisible, handleHandleMsgVisible] = useState<boolean>(false);

  const [logCatPinVisible, handleLogCatPinVisible] = useState<boolean>(true);

  const [currentRow, setCurrentRow] = useState<JobLog>();

  const [logContent, setLogContent] = useState<string>('');

  const [jobSelItems, setJobItems] = useState<any[]>();

  const tableActionRef = useRef<ActionType>();
  const searchFormRef = useRef<FormInstance>();

  useEffect(() => {
    if (logModalVisible) {
      if (currentRow) {
      }
    }
  })

  const {
    location: {
      query: { jobId = 0 },
    },
  } = props;

  const params: any = {};
  if (jobId > 0) {
    params.jobId = jobId;
  }

  const columns: ProColumns<JobLog>[] = [
    {
      title: <FormattedMessage id="pages.logs.job-id" defaultMessage="任务Id" />,
      hideInSearch: true,
      dataIndex: 'jobId',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              handleJobDetailVisible(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.logs.trigger-time" defaultMessage="调度时间" />,
      hideInSearch: true,
      dataIndex: 'triggerTime',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.logs.trigger-code" defaultMessage="调度结果" />,
      dataIndex: 'triggerCode',
      hideInSearch: true,
      valueEnum: {
        200: {
          text: (
            <div style={{ color: 'green' }}>
              <FormattedMessage id="pages.logs.success" defaultMessage="成功" />
            </div>
          ),
        },
        500: {
          text: (
            <div style={{ color: 'red' }}>
              <FormattedMessage id="pages.logs.fail" defaultMessage="失败" />
            </div>
          ),
        },
      },
    },
    {
      title: <FormattedMessage id="pages.logs.trigger-msg" defaultMessage="调度备注" />,
      width: 120,
      dataIndex: 'triggerMsg',
      hideInSearch: true,
      hideInForm: true,
      render: (dom, record) => [
        <a
          onClick={() => {
            setCurrentRow(record);
            handleTriggerMsgVisible(true);
          }}
        >
          <FormattedMessage id="pages.common.show" defaultMessage="查看" />
        </a>,
      ],
    },
    {
      title: <FormattedMessage id="pages.logs.handle-time" defaultMessage="执行时间" />,
      hideInSearch: true,
      dataIndex: 'handleTime',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.logs.handle-code" defaultMessage="执行结果" />,
      dataIndex: 'handleCode',
      hideInSearch: true,
      valueEnum: {
        0: {
          text: <div />,
        },
        200: {
          text: (
            <div style={{ color: 'green' }}>
              <FormattedMessage id="pages.logs.success" defaultMessage="成功" />
            </div>
          ),
        },
        500: {
          text: (
            <div style={{ color: 'red' }}>
              <FormattedMessage id="pages.logs.fail" defaultMessage="失败" />
            </div>
          ),
        },
      },
    },
    {
      title: <FormattedMessage id="pages.logs.handle-msg" defaultMessage="执行备注" />,
      width: 120,
      dataIndex: 'handleMsg',
      hideInSearch: true,
      render: (_, record) => [
        <a
          onClick={() => {
            setCurrentRow(record);
            handleHandleMsgVisible(true);
          }}
          style={{ display: record.handleCode === 200 ? '' : 'none' }}
        >
          <FormattedMessage id="pages.common.show" defaultMessage="查看" />
        </a>,
      ],
    },
    {
      title: <FormattedMessage id="pages.common.operation" defaultMessage="操作" />,
      width: 120,
      dataIndex: 'option',
      valueType: 'option',
      hideInForm: true,
      render: (_, record) => [
        <a
          // href={'joblog/logDetailPage?id=' + currentRow?.id}
          // target="blank"
          style={{ display: record.handleCode === 200 ? '' : 'none' }}
          onClick={() => {
            setCurrentRow(record);
            handleLogModalVisible(true);
            setLogContent('');

            // 清除之前的定时器
            if (logCatTimer !== 0) {
              clearTimeout(logCatTimer);
            }

            let fromLineNum = 1;
            // 明天改成定时器  
            const loadLogContent = async () => {
              const { id, executorAddress, triggerTime } = record;
              // console.log(id);
              // console.log(currentRow?.id)
              // if (id !== currentRow?.id) {
              //   return;
              // }
              const tt = new Date(triggerTime).getTime();
              handleLogCatPinVisible(true);
              const result = await logCat(id, tt, executorAddress || '', fromLineNum);
              handleLogCatPinVisible(false);
              // console.log(result);
              if (result === undefined || result === null) {
                return;
              }

              const { code, msg, content } = result;
              if (code !== 200) {
                message.error(msg);
                return;
              }
              const { toLineNum, logContent: lc } = content;
              setLogContent(logContent + lc);
              // console.log(fromLineNum)
              // console.log(toLineNum)
              if (fromLineNum > toLineNum) {
                console.log('exit')
                clearTimeout(logCatTimer);
                return;
              } else {
                fromLineNum = toLineNum + 1;
              }
            }

            logCatTimer = setTimeout(loadLogContent, 1000)
          }}
        >
          <FormattedMessage id="pages.logs.executor-log" defaultMessage="执行日志" />
        </a>,
      ],
    },
    // -------------------- 搜索专用的部分 -----------------
    {
      title: '执行器',
      key: 'jobGroup',
      hideInTable: true,
      hideInSearch: jobId > 0,
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        return (
          <ProFormSelect
            label=""
            fieldProps={{
              onChange: async (value) => {
                // console.log(value);
                if (value === undefined) {
                  setJobItems([]);
                  return;
                }
                const { content } = await queryJobsByGroup(value);
                const jobs: Job[] = content;
                const ret = [];
                for (let index = 0; index < jobs.length; index++) {
                  const job = jobs[index];
                  ret.push({
                    label: job.jobDesc,
                    value: job.id,
                  });
                }
                setJobItems(ret);
              },
            }}
            request={async () => {
              const { content } = await queryMyJobGroups();
              const jobGroups: JobGroup[] = content;
              const ret = [];
              for (let index = 0; index < jobGroups.length; index++) {
                const jobGroup = jobGroups[index];
                ret.push({
                  label: jobGroup.appname,
                  value: jobGroup.id,
                });
              }

              return ret;
            }}
          />
        );
      },
    },
    {
      title: '任务',
      key: 'jobId',
      hideInTable: true,
      hideInSearch: jobId > 0,
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        // const jobGroup = form.getFieldValue('jobGroup');
        // if (jobGroup === undefined) {
        //   return;
        // }
        // console.log(jobGroup);
        return (
          <ProFormSelect
            label=""
            options={jobSelItems}
          // request={async (ob) => {
          //   console.log(ob);
          //   const jobGroup = form.getFieldValue('jobGroup');
          //   console.log(jobGroup);
          //   const { content } = await queryJobsByGroup(jobGroup);
          //   const jobs: Job[] = content;
          //   const ret = [];
          //   for (let index = 0; index < jobs.length; index++) {
          //     const job = jobs[index];
          //     ret.push({
          //       label: job.jobDesc,
          //       value: job.id,
          //     })
          //   }
          //   return ret;

          // }}
          />
        );
      },
    },
    {
      title: '状态',
      key: 'logStatus',
      hideInTable: true,
      valueEnum: {
        // '-1': '全部',
        '1': '成功',
        '2': '失败',
        '3': '进行中',
      },
    },
    {
      title: '日期',
      key: 'filterTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
      colSize: 1.5,

      initialValue: [
        moment(moment().format('yyyy-MM-DD 00:00:00')),
        moment(moment().format('yyyy-MM-DD 23:59:59')),
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<JobLog, QueryParam>
        headerTitle={intl.formatMessage({
          id: 'pages.logs.list',
          defaultMessage: '日志列表',
        })}
        actionRef={tableActionRef}
        formRef={searchFormRef}
        rowKey={'id'}
        onLoad={() => {
          // searchFormRef.current?.setFieldsValue({
          //   jobGroup: 1
          // })
        }}
        params={params}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow({} as JobLog);
              handleClearModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.logs.clear" defaultMessage="清理" />
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const result = await queryLogs({ ...params, sorter, filter });
          // console.log(result);
          const { code, content } = result;
          if (code === 200) {
            const { data, total } = content;
            return {
              success: true,
              data,
              total,
            };
          } else {
            return {
              success: false,
            };
          }
        }}
        columns={columns}
      />
      {/* 任务信息 */}
      <Drawer
        width={460}
        visible={jobDetailVisible}
        onClose={() => {
          setCurrentRow(undefined);
          handleJobDetailVisible(false);
        }}
        closable={false}
      >
        <Row>
          <Col span="10">
            <FormattedMessage id="pages.logs.executor-address" defaultMessage="执行器地址" />:
          </Col>
          <Col>{currentRow?.executorAddress}</Col>
        </Row>
        <Row>
          <Col span="10">JobHandler:</Col>
          <Col>{currentRow?.executorHandler}</Col>
        </Row>
        <Row>
          <Col span="10">
            <FormattedMessage id="pages.logs.executor-param" defaultMessage="任务参数" />:
          </Col>
          <Col>{currentRow?.executorParam}</Col>
        </Row>
      </Drawer>
      {clearModalVisible && (
        <ModalForm
          title={intl.formatMessage({
            id: 'pages.common.clear',
            defaultMessage: '清理',
          })}
          width="460px"
          visible={clearModalVisible}
          onVisibleChange={handleClearModalVisible}
          onFinish={async ({ type }) => {
            const success = await handleFormSubmit(type);
            if (success) {
              handleClearModalVisible(false);
              if (tableActionRef.current) {
                tableActionRef.current.reload();
              }
            }
          }}
        >
          <ProFormSelect
            label={intl.formatMessage({ id: 'pages.logs.clear.type', defaultMessage: '清理方式' })}
            initialValue={'1'}
            name="type"
            request={async () => {
              return [
                {
                  label: <FormattedMessage id="pages.logs.clear.all" defaultMessage="全部" />,
                  value: '9',
                },
                {
                  label: (
                    <FormattedMessage
                      id="pages.logs.clear.month"
                      defaultMessage="清理一个月之前的"
                    />
                  ),
                  value: '1',
                },
                {
                  label: (
                    <FormattedMessage
                      id="pages.logs.clear.3month"
                      defaultMessage="清理三个月之前的"
                    />
                  ),
                  value: '2',
                },
                {
                  label: (
                    <FormattedMessage
                      id="pages.logs.clear.6month"
                      defaultMessage="清理六个月之前的"
                    />
                  ),
                  value: '3',
                },
                {
                  label: (
                    <FormattedMessage id="pages.logs.clear.year" defaultMessage="清理一年之前的" />
                  ),
                  value: '4',
                },
                {
                  label: (
                    <FormattedMessage
                      id="pages.logs.clear.1000r"
                      defaultMessage="清理一千条以前的"
                    />
                  ),
                  value: '5',
                },
                {
                  label: (
                    <FormattedMessage
                      id="pages.logs.clear.10000r"
                      defaultMessage="清理一万条之前的"
                    />
                  ),
                  value: '6',
                },
                {
                  label: (
                    <FormattedMessage
                      id="pages.logs.clear.30000r"
                      defaultMessage="清理三万条之前的"
                    />
                  ),
                  value: '7',
                },
                {
                  label: (
                    <FormattedMessage
                      id="pages.logs.clear.100000r"
                      defaultMessage="清理十万条之前的"
                    />
                  ),
                  value: '8',
                },
              ];
            }}
          />
        </ModalForm>
      )}
      {logModalVisible && (
        <ModalForm
          title={intl.formatMessage({
            id: 'pages.logs.executor-log',
            defaultMessage: '执行日志',
          })}
          width="860px"
          visible={logModalVisible}
          onVisibleChange={handleLogModalVisible}
          submitter={{
            submitButtonProps: {
              style: {
                display: 'none'
              }
            }
          }}
        // onLoadedData={() => {
        //   console.log('onLoad')
        // }}
        // modalProps={{
        // }}

        // onFinish={async ({ type }) => {
        //   const success = await handleFormSubmit(type);
        //   if (success) {
        //     handleClearModalVisible(false);
        //     if (tableActionRef.current) {
        //       tableActionRef.current.reload();
        //     }
        //   }
        // }}
        >
          <p dangerouslySetInnerHTML={{ __html: logContent }} />
          {logCatPinVisible &&
            <Spin />
          }
        </ModalForm>
      )}
      {/* 调度备注 */}
      <Drawer
        width={460}
        visible={triggerMsgVisible}
        onClose={() => {
          setCurrentRow(undefined);
          handleTriggerMsgVisible(false);
        }}
        closable={false}
      >
        <p dangerouslySetInnerHTML={{ __html: currentRow?.triggerMsg }} />
      </Drawer>
      {/* 执行备注 */}
      <Drawer
        width={460}
        visible={handleMsgVisible}
        onClose={() => {
          setCurrentRow(undefined);
          handleHandleMsgVisible(false);
        }}
        closable={false}
      >
        <p dangerouslySetInnerHTML={{ __html: currentRow?.handleMsg }} />
      </Drawer>
    </PageContainer>
  );
};

export default JobLogList;
