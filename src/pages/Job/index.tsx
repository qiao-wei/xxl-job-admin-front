import { PlusOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import { Button, message, FormInstance, Row, Col, Divider, Menu, Dropdown } from 'antd';
import { useIntl, FormattedMessage, history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { ProColumns, ActionType, TableDropdown } from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormTextArea,
  ProFormDigit,
} from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import type { QueryParam, Job } from './data.d';
import {
  queryJobs,
  saveJob,
  deleteJob,
  startJob,
  stopJob,
  triggerJob,
  queryNextTriggerTimes,
} from './service';
import { queryMyJobGroups } from '../JobGroup/service';
import { JobGroup } from '../JobGroup/data';

const JobList: React.FC = () => {
  /** 国际化配置 */
  const intl = useIntl();

  /**
   * 删除
   * @param fields
   */
  const handleDelete = async (job: Job) => {
    if (job.id && job.id > 0) {
      await deleteJob(job.id);
      message.success(
        intl.formatMessage({
          id: 'pages.common.del-success',
          defaultMessage: '删除成功',
        }),
      );
    } else {
      message.error(
        intl.formatMessage({
          id: 'pages.common.del-fail',
          defaultMessage: '删除失败',
        }),
      );
    }

    return true;
  };

  const glueSources = new Map([
    ["GLUE_PYTHON", `#!/usr/bin/python
# -*- coding: UTF-8 -*-
import time
import sys
    
print "xxl-job: hello python"
    
print "脚本位置：", sys.argv[0]
print "任务参数：", sys.argv[1]
print "分片序号：", sys.argv[2]
print "分片总数：", sys.argv[3]
    
print "Good bye!"
exit(0)`],

    ["GLUE_SHELL",
      `#!/bin/bash
echo "xxl-job: hello shell"
    
echo "脚本位置：$0"
echo "任务参数：$1"
echo "分片序号 = $2"
echo "分片总数 = $3"
    
echo "Good bye!"
exit 0`],

    ["GLUE_GROOVY", `package com.xxl.job.service.handler;

  import com.xxl.job.core.context.XxlJobHelper;
  import com.xxl.job.core.handler.IJobHandler;

  public class DemoGlueJobHandler extends IJobHandler {

  @Override
  public void execute() throws Exception {
	  XxlJobHelper.log("XXL-JOB, Hello World.");
  }

}`],

    ["GLUE_PHP", `<?php

echo "xxl-job: hello php  \\n";

echo "脚本位置：$argv[0]  \\n";
echo "任务参数：$argv[1]  \\n";
echo "分片序号 = $argv[2]  \\n";
echo "分片总数 = $argv[3]  \\n";

echo "Good bye!  \\n";
exit(0);

?>`],

    ["GLUE_NODEJS", `#!/usr/bin/env node
console.log("xxl-job: hello nodejs")
    
var arguments = process.argv
    
console.log("脚本位置: " + arguments[1])
console.log("任务参数: " + arguments[2])
console.log("分片序号: " + arguments[3])
console.log("分片总数: " + arguments[4])
    
console.log("Good bye!")
process.exit(0)`],
    ["GLUE_POWERSHELL", `Write-Host "xxl-job: hello powershell"

Write-Host "脚本位置: " $MyInvocation.MyCommand.Definition
Write-Host "任务参数: "
  if ($args.Count -gt 2) { $args[0..($args.Count-3)] }
Write-Host "分片序号: " $args[$args.Count-2]
Write-Host "分片总数: " $args[$args.Count-1]
    
Write-Host "Good bye!"
exit 0`],
  ])
  /**
   * 新增或编辑
   *
   * @param fields
   */
  const handleFormSubmit = async (fields: Job) => {
    /** 国际化配置 */
    const hide = message.loading(
      intl.formatMessage({
        id: 'pages.common.dealing',
        defaultMessage: '处理中...',
      }),
    );

    try {
      const { glueType } = fields;
      if (fields?.id && fields.id > 0) { } else {
        // console.log('abc')
        if (glueType !== 'BEAN') {
          fields.glueSource = (glueSources.get(glueType) || '')
          fields.glueRemark = 'glue代码初始化';
        }
      }

      if (fields.scheduleConf === null) {
        fields.scheduleConf = '';
      }

      // console.log(fields);
      const { code, msg } = await saveJob(fields);
      hide();
      if (code === 200) {
        message.success(
          intl.formatMessage({
            id: 'pages.common.save-success',
            defaultMessage: '保存成功',
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
          id: 'pages.common.save-fail',
          defaultMessage: '保存失败,请重试',
        }),
      );
      return false;
    }
  };

  /**
   * 执行一次
   *
   * @param fields
   */
  const handleRunOnceSubmit = async (jobId: number, fields?: any) => {
    /** 国际化配置 */
    const hide = message.loading(
      intl.formatMessage({
        id: 'pages.common.dealing',
        defaultMessage: '处理中...',
      }),
    );

    try {
      const { code, msg } = await triggerJob(jobId, fields);
      hide();
      if (code === 200) {
        message.success(
          intl.formatMessage({
            id: 'pages.common.exe-success',
            defaultMessage: '执行成功',
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
          id: 'pages.common.exe-fail',
          defaultMessage: '执行失败,请重试',
        }),
      );
      return false;
    }
  };

  /** 新建以及编辑窗口的弹窗 */
  const [formModalVisible, handleFormModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<Job>();

  /** 确认删除窗口 */
  const [delConfirmModalVisible, handleDelConfirmModalVisible] = useState<boolean>(false);

  /** 执行一次 */
  const [runOnceModalVisible, handleRunOnceModalVisible] = useState<boolean>(false);

  /** 下一次执行时间  */
  const [nextTriggerModalVisible, handleNextTriggerModalVisible] = useState<boolean>(false);
  const [nextTriggerTimes, setNextTriggerTimes] = useState<string[]>([]);

  const tableActionRef = useRef<ActionType>();
  const searchFormRef = useRef<FormInstance>();

  const [scheduleType, setScheduleType] = useState<String>('NONE');
  const [glueType, setGlueType] = useState<String>();
  const columns: ProColumns<Job>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="pages.jobs.job-desc" defaultMessage="任务描述" />,
      order: 14,
      dataIndex: 'jobDesc',
    },
    {
      title: <FormattedMessage id="pages.jobs.schedule-type" defaultMessage="调度类型" />,
      render: (_, entity) => {
        const { scheduleType, scheduleConf } = entity;
        return (
          <div>
            {scheduleType} {scheduleType !== 'NONE' &&
              <>: {scheduleConf}</>
            }
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.jobs.glue-type" defaultMessage="运行模式" />,
      render: (_, entity) => {
        const { glueType, executorHandler } = entity;
        return (
          <div>
            { glueType === 'BEAN' &&
              <>{glueType} : {executorHandler}</>
            }
            { glueType !== 'BEAN' &&
              <>{glueType} {executorHandler}</>
            }
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.jobs.author" defaultMessage="负责人" />,
      dataIndex: 'author',
    },
    {
      title: <FormattedMessage id="pages.jobs.trigger-status" defaultMessage="状态" />,
      dataIndex: 'triggerStatus',
      hideInSearch: true,
      render: (triggerStatus, _) => {
        // return (
        //   <Button>{triggerStatus === 0 ? 'Stop' : 'Running'}</Button>
        // )
        if (triggerStatus === 0) {
          // return (
          //   <Button >Stop</Button>
          // )
          return (
            <div
              style={{
                width: 60,
                backgroundColor: 'gray',
                color: 'white', textAlign: 'center',
                // alignContent: 'center',
                // alignItems: 'center',
                flex: 1,
                borderRadius: 3,
              }}
            >
              Stop
            </div>
          );
        } else {
          return (
            <div
              style={{
                width: 60,
                backgroundColor: 'green',
                color: 'white',
                textAlign: 'center',
                // alignContent: 'center',
                // alignItems: 'center',
                flex: 1,
                borderRadius: 3,
              }}
            >
              Running
            </div>
          );
        }
      },
    },
    {
      title: <FormattedMessage id="pages.common.operation" defaultMessage="操作" />,
      width: 231,
      dataIndex: 'option',
      valueType: 'option',
      hideInForm: true,
      render: (_, record) => {
        const menus =
          [
            {
              key: 'log',
              name: <FormattedMessage id="pages.jobs.ope.log" defaultMessage="查询日志" />,
            },
            {
              key: 'next',
              name: <FormattedMessage id="pages.jobs.ope.next" defaultMessage="下次执行时间" />,
            },
            {
              key: 'copy',
              name: <FormattedMessage id="pages.jobs.ope.copy" defaultMessage="复制" />,
            },
            {
              key: 'delete',
              name: <FormattedMessage id="pages.common.delete" defaultMessage="删除" />,
            },
          ];

        if (record.glueType !== 'BEAN') {
          menus.push({
            key: 'glue-ide',
            name: <FormattedMessage id="pages.jobs.glue-ide" defaultMessage="Glue IDE" />,
          });
        }

        return [
          <a
            onClick={() => {
              setCurrentRow(record);
              setGlueType(record.glueType);
              setScheduleType(record.scheduleType);
              handleFormModalVisible(true);
            }}
          >
            <FormattedMessage id="pages.common.edit" defaultMessage="编辑" />
          </a>,
          <a
            onClick={async () => {
              // setCurrentRow(record);
              const { triggerStatus } = record;

              let result: any;
              if (triggerStatus === 0) {
                if (record.id === undefined) return;
                result = await startJob(record.id);
              } else {
                if (record.id === undefined) return;
                result = await stopJob(record.id);
              }

              const { code, msg } = result;
              if (code === 200) {
                if (tableActionRef.current) {
                  tableActionRef.current.reload();
                }
              } else {
                message.error(msg);
              }
            }}
          >
            {record.triggerStatus === 0 && (
              <FormattedMessage id="pages.common.start" defaultMessage="启动" />
            )}
            {record.triggerStatus === 1 && (
              <FormattedMessage id="pages.common.stop" defaultMessage="停止" />
            )}
          </a>,
          <a
            onClick={() => {
              setCurrentRow(record);
              handleRunOnceModalVisible(true);
            }}
          >
            <FormattedMessage id="pages.jobs.run-once" defaultMessage="执行一次" />
          </a>,
          // <a
          //   onClick={() => {
          //     setCurrentRow(record);
          //     handleDelConfirmModalVisible(true);
          //   }}>
          //   <FormattedMessage id="pages.common.delete" defaultMessage="删除" />
          // </a>,
          <TableDropdown
            onSelect={async (value) => {
              // console.log(value)
              if (value === 'log') {
                setCurrentRow(record);
                handleDelConfirmModalVisible(true);
                history.push('jobLogs?jobId=' + record.id);
              } else if (value === 'next') {
                const result = await queryNextTriggerTimes(record.scheduleType, record.scheduleConf);
                const { content } = result;
                setNextTriggerTimes(content);
                handleNextTriggerModalVisible(true);
              } else if (value === 'copy') {
                const newRecord = { ...record };
                delete newRecord.id;
                setCurrentRow(newRecord);
                handleFormModalVisible(true);
              } else if (value === 'glue-ide') {
                window.open('jobcode?jobId=' + record.id)
              } else {
                setCurrentRow(record);
                handleDelConfirmModalVisible(true);
              }
            }}
            menus={menus}
          />,
        ];
      }
    },
    // --------------------- 只和搜索有关的 ----------------
    {
      title: <FormattedMessage id="pages.jobs.job-group" defaultMessage="执行器" />,
      key: 'jobGroup',
      order: 16,
      hideInTable: true,
      renderFormItem: (_, record) => {
        return (
          <ProFormSelect
            label=""
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
      title: <FormattedMessage id="pages.jobs.status" defaultMessage="状态" />,
      key: 'triggerStatus',
      order: 16,
      hideInTable: true,
      renderFormItem: (_, record) => {
        return (
          <ProFormSelect
            label=""
            request={async () => [
              { label: '全部', value: '-1' },
              { label: '停止', value: '0' },
              { label: '启动', value: '1' },
            ]}
          />
        );
      },
    },
    {
      title: 'JobHandler',
      key: 'executorHandler',
      hideInTable: true,
      order: 13,
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<Job, QueryParam>
        headerTitle={intl.formatMessage({
          id: 'pages.jobs.list',
          defaultMessage: '任务列表',
        })}
        actionRef={tableActionRef}
        formRef={searchFormRef}
        // onLoad={() => {
        //   searchFormRef.current?.setFieldsValue({
        //     username: 'admin'
        //   })
        // }}
        // params={{ username: 'admin' }}
        rowKey={'id'}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow({
                scheduleType: 'NONE',
                glueType: 'BEAN',
                executorRouteStrategy: 'ROUND',
                misfireStrategy: 'DO_NOTHING',
                executorBlockStrategy: 'SERIAL_EXECUTION',

              } as Job);
              setGlueType('BEAN');
              setScheduleType('NONE');
              handleFormModalVisible(true);
            }}
          >
            <PlusOutlined />
            <FormattedMessage id="pages.common.new" defaultMessage="新建" />
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const result = await queryJobs({ ...params, sorter, filter });
          const { code, content } = result;
          if (code === 200) {
            const { data, total } = content;
            // for (const ele of data) {
            //   ele.key = ele.id;
            // }
            // console.log(data);
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

      {delConfirmModalVisible && (
        <ModalForm
          title={intl.formatMessage({
            id: 'pages.common.delete',
            defaultMessage: '删除',
          })}
          width="300px"
          visible={delConfirmModalVisible}
          onVisibleChange={handleDelConfirmModalVisible}
          onFinish={async () => {
            const success = handleDelete(currentRow as Job);
            if (success) {
              handleDelConfirmModalVisible(false);
              if (tableActionRef.current) {
                tableActionRef.current.reload();
              }
            }
          }}
        >
          <FormattedMessage id="pages.common.del-confirm" defaultMessage="确认删除?" />
        </ModalForm>
      )}

      {runOnceModalVisible && (
        <ModalForm
          title={intl.formatMessage({
            id: 'pages.jobs.run-once',
            defaultMessage: '执行一次',
          })}
          width="460px"
          visible={runOnceModalVisible}
          onVisibleChange={handleRunOnceModalVisible}
          onFinish={async (value) => {
            if (!currentRow || currentRow.id === undefined) return;
            const success = await handleRunOnceSubmit(currentRow.id, value);
            if (success) {
              handleRunOnceModalVisible(false);
              if (tableActionRef.current) {
                tableActionRef.current.reload();
              }
            }
          }}
        >
          <ProFormTextArea
            name="executorParam"
            label={intl.formatMessage({
              id: 'pages.jobs.executor-param',
              defaultMessage: '任务参数',
            })}
          />
          <ProFormTextArea
            name="executorParamexecutorParam"
            label={intl.formatMessage({
              id: 'pages.jobs.epp',
              defaultMessage: '机器地址',
            })}
            fieldProps={{
              placeholder: intl.formatMessage({
                id: 'pages.jobs.epp.ph',
                defaultMessage: '请输入本次执行的机器地址，为空则从执行器获取',
              }),
            }}
          />
        </ModalForm>
      )}

      {nextTriggerModalVisible && (
        <ModalForm
          title={intl.formatMessage({
            id: 'pages.jobs.ope.next',
            defaultMessage: '下次执行时间',
          })}
          width="460px"
          visible={nextTriggerModalVisible}
          onVisibleChange={handleNextTriggerModalVisible}
        >
          {nextTriggerTimes.map((item) => (
            <>
              {item} <br />
            </>
          ))}
        </ModalForm>
      )}

      {formModalVisible && (
        <ModalForm
          title={intl.formatMessage({
            id: 'pages.common.edit',
            defaultMessage: '编辑',
          })}
          width="860px"
          visible={formModalVisible}
          onVisibleChange={handleFormModalVisible}
          onFinish={async (value: Job) => {
            // console.log(value);
            const { executorTimeout = 0, executorFailRetryCount = 0 } = value;
            value.executorTimeout = executorTimeout;
            value.executorFailRetryCount = executorFailRetryCount;
            value = {
              ...currentRow,
              ...value,
            };

            const success = await handleFormSubmit(value);
            if (success) {
              handleFormModalVisible(false);
              if (tableActionRef.current) {
                tableActionRef.current.reload();
              }
            }
          }}
        >
          <Divider orientation="left" plain={true} style={{ marginTop: -5 }}>
            <FormattedMessage id="pages.jobs.basic-set" defaultMessage="基础配置" />
          </Divider>
          <Row>
            <Col xl={3} md={3} xs={6} style={{ lineHeight: 2, paddingLeft: 10 }}>
              <FormattedMessage id="pages.jobs.job-group" defaultMessage="执行器" /> *
            </Col>
            <Col xl={9} md={9} xs={18}>
              <ProFormSelect
                name="jobGroup"
                label=""
                fieldProps={{
                  allowClear: false,
                }}
                initialValue={currentRow?.jobGroup}
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
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.jobs.form.job-group.required"
                        defaultMessage="执行器必须选择"
                      />
                    ),
                  },
                ]}
              />
            </Col>
            <Col xl={3} md={3} xs={6} style={{ lineHeight: 2, paddingLeft: 10 }}>
              <FormattedMessage id="pages.jobs.job-desc" defaultMessage="任务描述" /> *
            </Col>
            <Col xl={9} md={9} xs={18}>
              <ProFormText
                name="jobDesc"
                label=""
                initialValue={currentRow?.jobDesc}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.jobs.form.job-desc.required"
                        defaultMessage="任务描述必须填写"
                      />
                    ),
                  },
                ]}
              />
            </Col>
          </Row>
          <Row>
            <Col xl={3} md={3} xs={6} style={{ lineHeight: 2, paddingLeft: 10 }}>
              <FormattedMessage id="pages.jobs.author" defaultMessage="负责人" /> *
            </Col>
            <Col xl={9} md={9} xs={18}>
              <ProFormText
                name="author"
                label=""
                initialValue={currentRow?.author}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.jobs.form.author.required"
                        defaultMessage="负责人必须填写"
                      />
                    ),
                  },
                ]}
              />
            </Col>
            <Col xl={3} md={3} xs={6} style={{ lineHeight: 2, paddingLeft: 10 }}>
              <FormattedMessage id="pages.jobs.alarm-email" defaultMessage="报警邮件" />
            </Col>
            <Col xl={9} md={9} xs={18}>
              <ProFormText
                name="alarmEmail"
                initialValue={currentRow?.alarmEmail}
                fieldProps={{
                  placeholder: intl.formatMessage({
                    id: 'pages.jobs.form.alarm-email-ph',
                    defaultMessage: '请输入报警邮件，多个邮件地址则逗号分隔',
                  }),
                }}
              />
            </Col>
          </Row>
          <Divider orientation="left" plain={true} style={{ marginTop: -5 }}>
            <FormattedMessage id="pages.jobs.schedule-set" defaultMessage="调度配置" />
          </Divider>
          <Row>
            <Col xl={3} md={3} xs={6} style={{ lineHeight: 2, paddingLeft: 10 }}>
              <FormattedMessage id="pages.jobs.schedule-type" defaultMessage="调度类型" /> *
            </Col>
            <Col xl={9} md={9} xs={18}>
              <ProFormSelect
                name="scheduleType"
                label=""
                initialValue={currentRow?.scheduleType}
                valueEnum={{
                  NONE: intl.formatMessage({
                    id: 'pages.jobs.schedule-type.none',
                    defaultMessage: '无',
                  }),
                  CRON: 'CRON',
                  FIX_RATE: intl.formatMessage({
                    id: 'pages.jobs.schedule-type.fix-rate',
                    defaultMessage: '固定速度',
                  }),
                }}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.jobs.form.schedule-type.required"
                        defaultMessage="调度类型必须填写"
                      />
                    ),
                  },
                ]}
                fieldProps={{
                  onChange: (value) => {
                    setScheduleType(value);
                  },
                  allowClear: false,
                }}
              />
            </Col>
            <Col xl={3} md={3} xs={6} style={{ lineHeight: 2, paddingLeft: 10 }}>
              {scheduleType === 'CRON' && <div>CRON *</div>}
              {scheduleType === 'FIX_RATE' && (
                <div>
                  <FormattedMessage
                    id="pages.jobs.schedule-type.fix-rate"
                    defaultMessage="固定速度"
                  />{' '}
                  *
                </div>
              )}
            </Col>
            <Col xl={9} md={9} xs={18}>
              {scheduleType === 'CRON' && (
                <ProFormText
                  name="scheduleConf"
                  label=""
                  initialValue={currentRow?.scheduleConf || ''}
                  fieldProps={{
                    placeholder: intl.formatMessage({
                      id: 'pages.jobs.form.cron.ph',
                      defaultMessage: 'cron表达式',
                    }),
                  }}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.jobs.form.cron.required"
                          defaultMessage="cron不能为空"
                        />
                      ),
                    },
                  ]}
                />
              )}
              {scheduleType === 'FIX_RATE' && (
                <ProFormText
                  name="scheduleConf"
                  label=""
                  fieldProps={{
                    placeholder: intl.formatMessage({
                      id: 'pages.jobs.form.fix-rate.ph',
                      defaultMessage: 'Second',
                    }),
                  }}
                  initialValue={currentRow?.scheduleConf || ''}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.jobs.form.fix-rate.required"
                          defaultMessage="固定速度必须填写"
                        />
                      ),
                    },
                  ]}
                />
              )}
            </Col>
          </Row>
          <Divider orientation="left" plain={true} style={{ marginTop: -5 }}>
            <FormattedMessage id="pages.jobs.job-set" defaultMessage="任务设置" />
          </Divider>

          <Row>
            <Col xl={3} md={3} xs={6} style={{ lineHeight: 2, paddingLeft: 10 }}>
              <FormattedMessage id="pages.jobs.glue-type" defaultMessage="运行模式" /> *
            </Col>
            <Col xl={9} md={9} xs={18}>
              <ProFormSelect
                name="glueType"
                label=""
                initialValue={currentRow?.glueType}
                // readonly={true}
                disabled={currentRow?.id && currentRow.id > 0 || false}
                valueEnum={{
                  'BEAN': 'BEAN',
                  'GLUE_GROOVY': 'GLUE(Java)',
                  'GLUE_SHELL': 'GLUE(Shell)',
                  'GLUE_PYTHON': 'GLUE(Python)',
                  'GLUE_PHP': 'GLUE(PHP)',
                  'GLUE_NODEJS': 'GLUE(NodeJs)',
                  'GLUE_POWERSHELL': 'GLUE(PowerShell)',
                }}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.jobs.form.glue-type.required"
                        defaultMessage="运行模式必须填写"
                      />
                    ),
                  },
                ]}
                fieldProps={{
                  onChange: (value) => {
                    setGlueType(value);
                  },
                  allowClear: false,
                }}
              />
            </Col>
            <Col xl={3} md={3} xs={6} style={{ lineHeight: 2, paddingLeft: 10 }}>
              {glueType === 'BEAN' && <div>JobHandler * </div>}
            </Col>
            <Col xl={9} md={9} xs={18}>
              {/* {!currentRow?.id && glueType === 'GLUE_PYTHON' && (
                <ProFormTextArea initialValue={
                  `#!/usr/bin/python
# -*- coding: UTF-8 -*-
import time
import sys

print "xxl-job: hello python"

print "脚本位置：", sys.argv[0]
print "任务参数：", sys.argv[1]
print "分片序号：", sys.argv[2]
print "分片总数：", sys.argv[3]

print "Good bye!"
exit(0)
`
                } name='glueSource'>
                </ProFormTextArea>
              )} */}
              {glueType === 'BEAN' && (
                <ProFormText
                  name="executorHandler"
                  label=""
                  initialValue={currentRow?.executorHandler}
                  rules={[
                    {
                      required: glueType === 'BEAN',
                      message: (
                        <FormattedMessage
                          id="pages.jobs.form.executor-handler.required"
                          defaultMessage="JobHandler不能为空"
                        />
                      ),
                    },
                  ]}
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col xl={3} md={3} xs={6} style={{ lineHeight: 2, paddingLeft: 10 }}>
              <FormattedMessage id="pages.jobs.executor-param" defaultMessage="任务参数" />
            </Col>
            <Col xl={21} md={21} xs={18}>
              <ProFormTextArea
                name="executorParam"
                label=""
                initialValue={currentRow?.executorParam}
              />
            </Col>
          </Row>
          <Divider orientation="left" plain={true} style={{ marginTop: -5 }}>
            <FormattedMessage id="pages.jobs.senior-set" defaultMessage="高级配置" />
          </Divider>
          <Row>
            <Col xl={3} md={3} xs={6} style={{ lineHeight: 2, paddingLeft: 10 }}>
              <FormattedMessage id="pages.jobs.executor-route-strategy" defaultMessage="路由策略" />{' '}
              *
            </Col>
            <Col xl={9} md={9} xs={18}>
              <ProFormSelect
                name="executorRouteStrategy"
                label=""
                initialValue={currentRow?.executorRouteStrategy}
                fieldProps={{
                  allowClear: false,
                }}
                valueEnum={{
                  FIRST: '第一个',
                  LAST: '最后一个',
                  ROUND: '轮询',
                  RANDOM: '随机',
                  CONSISTENT_HASH: '一致性HASH',
                  LEAST_FREQUENTLY_USED: '最不经常使用',
                  LEAST_RECENTLY_USED: '最近最久未使用',
                  FAILOVER: '故障转移',
                  BUSYOVER: '忙碌转移',
                  SHARDING_BROADCAST: '分片广播',
                }}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.jobs.form.executor-route-strategy.required"
                        defaultMessage="路由策略必须填写"
                      />
                    ),
                  },
                ]}
              />
            </Col>
            <Col xl={3} md={3} xs={6} style={{ lineHeight: 2, paddingLeft: 10 }}>
              <FormattedMessage id="pages.jobs.child-job-id" defaultMessage="子任务Id" />
            </Col>
            <Col xl={9} md={9} xs={18}>
              <ProFormText name="childJobId" label="" initialValue={currentRow?.childJobId} />
            </Col>
          </Row>
          <Row>
            <Col xl={3} md={3} xs={6} style={{ lineHeight: 2, paddingLeft: 10 }}>
              <FormattedMessage id="pages.jobs.misfire-strategy" defaultMessage="过期策略" /> *
            </Col>
            <Col xl={9} md={9} xs={18}>
              <ProFormSelect
                name="misfireStrategy"
                label=""
                initialValue={currentRow?.misfireStrategy}
                fieldProps={{
                  allowClear: false,
                }}
                valueEnum={{
                  DO_NOTHING: '忽略',
                  FIRE_ONCE_NOW: '立即执行一次',
                }}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.jobs.form.misfire-strategy.required"
                        defaultMessage="调度过期策略必须填写"
                      />
                    ),
                  },
                ]}
              />
            </Col>
            <Col xl={3} md={3} xs={6} style={{ lineHeight: 2, paddingLeft: 10 }}>
              <FormattedMessage id="pages.jobs.executor-block-strategy" defaultMessage="阻塞策略" />{' '}
              *
            </Col>
            <Col xl={9} md={9} xs={18}>
              <ProFormSelect
                name="executorBlockStrategy"
                label=""
                initialValue={currentRow?.executorBlockStrategy}
                fieldProps={{
                  allowClear: false,
                }}
                valueEnum={{
                  SERIAL_EXECUTION: '单机串行',
                  DISCARD_LATER: '丢弃后续调度',
                  COVER_EARLY: '覆盖之前调度',
                }}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.jobs.form.executor-block-strategy.required"
                        defaultMessage="阻塞处理策略必须填写"
                      />
                    ),
                  },
                ]}
              />
            </Col>
          </Row>
          <Row>
            <Col xl={3} md={3} xs={6} style={{ lineHeight: 2, paddingLeft: 10 }}>
              <FormattedMessage id="pages.jobs.executor-timeout" defaultMessage="超时时间" />
            </Col>
            <Col xl={9} md={9} xs={18}>
              <ProFormDigit
                name="executorTimeout"
                label=""
                initialValue={currentRow?.executorTimeout || ''}
                fieldProps={{
                  placeholder: '>0 Second',
                }}
              />
            </Col>
            <Col xl={3} md={3} xs={6} style={{ lineHeight: 2, paddingLeft: 10 }}>
              <FormattedMessage
                id="pages.jobs.executor-fail-retry-count"
                defaultMessage="重试次数"
              />
            </Col>
            <Col xl={9} md={9} xs={18}>
              <ProFormDigit
                name="executorFailRetryCount"
                label=""
                initialValue={currentRow?.executorFailRetryCount || ''}
                fieldProps={{
                  placeholder: '>0',
                }}
              />
            </Col>
          </Row>
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default JobList;
