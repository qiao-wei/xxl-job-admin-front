import { PlusOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import { Button, message, FormInstance, Drawer } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormRadio, ProFormTextArea } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import type { QueryParam, JobGroup } from './data.d';
import { queryJobGroups, saveJobGroup, deleteJobGroup } from './service';

const JobGroupList: React.FC = () => {
  /** 国际化配置 */
  const intl = useIntl();

  /**
   * 删除执行器
   * @param jobGroup 执行器
   */
  const handleDelete = async (jobGroup: JobGroup) => {
    if (jobGroup.id) {
      await deleteJobGroup(jobGroup.id);
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

  /**
   * 新增或编辑执行
   *
   * @param fields
   */
  const handleFormSubmit = async (fields: JobGroup) => {
    /** 国际化配置 */
    const hide = message.loading(
      intl.formatMessage({
        id: 'pages.common.dealing',
        defaultMessage: '处理中...',
      }),
    );

    try {
      const { code, msg } = await saveJobGroup(fields);
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

  /** 新建以及编辑窗口的弹窗 */
  const [formModalVisible, handleFormModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<JobGroup>();

  /** 确认删除窗口 */
  const [delConfirmModalVisible, handleDelConfirmModalVisible] = useState<boolean>(false);

  const [addressListDisable, handleAddressListDisable] = useState<boolean>(true);

  const tableActionRef = useRef<ActionType>();
  const searchFormRef = useRef<FormInstance>();

  const [showRegistryList, setShowRegistryList] = useState<boolean>(false);

  const columns: ProColumns<JobGroup>[] = [
    {
      title: 'AppName',
      dataIndex: 'appname',
      // render: (dom, entity) => {
      //   return (
      //     <a
      //       onClick={() => { }}
      //     >
      //       {dom}
      //     </a>
      //   );
      // },
    },
    {
      title: <FormattedMessage id="pages.jobGroups.title" defaultMessage="名称" />,
      dataIndex: 'title',
    },
    {
      title: <FormattedMessage id="pages.jobGroups.address-type" defaultMessage="状态" />,
      dataIndex: 'addressType',
      valueEnum: {
        0: {
          text: (
            <FormattedMessage id="pages.jobGroups.address-type.auto" defaultMessage="自动注册" />
          ),
        },
        1: {
          text: (
            <FormattedMessage id="pages.jobGroups.address-type.manual" defaultMessage="手动注册" />
          ),
        },
      },
    },
    {
      title: <FormattedMessage id="pages.jobGroups.registry-list" defaultMessage="执行备注" />,
      width: 120,
      dataIndex: 'registryList',
      hideInSearch: true,
      render: (_, record) => [
        <a
          onClick={() => {
            setCurrentRow(record);
            setShowRegistryList(true);
          }}
        >
          <FormattedMessage id="pages.common.show" defaultMessage="查看" />({' '}
          {(record.registryList && record.registryList.length) || 0})
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
          key="config"
          onClick={() => {
            setCurrentRow(record);
            handleFormModalVisible(true);
          }}
        >
          <FormattedMessage id="pages.common.edit" defaultMessage="编辑" />
        </a>,
        <a
          onClick={() => {
            setCurrentRow(record);
            handleDelConfirmModalVisible(true);
          }}
        >
          <FormattedMessage id="pages.common.delete" defaultMessage="删除" />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<JobGroup, QueryParam>
        headerTitle={intl.formatMessage({
          id: 'pages.jobGroups.list',
          defaultMessage: '执行器列表',
        })}
        actionRef={tableActionRef}
        formRef={searchFormRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleFormModalVisible(true);
              setCurrentRow({} as JobGroup);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.common.new" defaultMessage="新建" />
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const result = await queryJobGroups({ ...params, sorter, filter });
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
            const success = handleDelete(currentRow as JobGroup);
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
      {formModalVisible && (
        <ModalForm
          title={intl.formatMessage({
            id: 'pages.common.new',
            defaultMessage: '新建',
          })}
          width="460px"
          visible={formModalVisible}
          onVisibleChange={handleFormModalVisible}
          onFinish={async (value) => {
            value = { ...currentRow, ...value };
            const success = await handleFormSubmit(value as JobGroup);
            if (success) {
              handleFormModalVisible(false);
              if (tableActionRef.current) {
                tableActionRef.current.reload();
              }
            }
          }}
        >
          <ProFormText
            label="AppName"
            initialValue={currentRow?.appname}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.jobGroups.form.appname.required"
                    defaultMessage="AppName必须填写"
                  />
                ),
              },
              {
                min: 4,
                max: 64,
                message: (
                  <FormattedMessage
                    id="pages.jobGroups.form.len.check"
                    defaultMessage="长度必须在[4-64]"
                  />
                ),
              },
            ]}
            width="md"
            name="appname"
          />
          <ProFormText
            label={intl.formatMessage({
              id: 'pages.jobGroups.title',
              defaultMessage: '名称',
            })}
            initialValue={currentRow?.title}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.jobGroups.form.title.required"
                    defaultMessage="名称必须填写"
                  />
                ),
              },
              {
                min: 4,
                max: 64,
                message: (
                  <FormattedMessage
                    id="pages.jobGroups.form.len.check"
                    defaultMessage="长度必须在[4-64]"
                  />
                ),
              },
            ]}
            width="md"
            name="title"
          />
          <ProFormRadio.Group
            name="addressType"
            label={intl.formatMessage({
              id: 'pages.jobGroups.address-type',
              defaultMessage: '注册方式',
            })}
            initialValue={currentRow?.addressType || 0}
            fieldProps={{
              onChange: ({ target: { value } }) => {
                if (value === 0) {
                  handleAddressListDisable(true);
                } else {
                  handleAddressListDisable(false);
                }
              },
            }}
            options={[
              {
                label: intl.formatMessage({
                  id: 'pages.jobGroups.address-type.auto',
                  defaultMessage: '自动注册',
                }),
                value: 0,
              },
              {
                label: intl.formatMessage({
                  id: 'pages.jobGroups.address-type.manual',
                  defaultMessage: '手动注册',
                }),
                value: 1,
              },
            ]}
          />
          <ProFormTextArea
            disabled={addressListDisable}
            name="addressList"
            label={intl.formatMessage({
              id: 'pages.jobGroups.address-list',
              defaultMessage: '注册方式',
            })}
            initialValue={currentRow?.addressList || 0}
          />
        </ModalForm>
      )}
      <Drawer
        width={460}
        visible={showRegistryList}
        onClose={() => {
          setCurrentRow(undefined);
          setShowRegistryList(false);
        }}
        closable={false}
      >
        <>
          <b>
            <FormattedMessage id="pages.jobGroups.registry-list" />
          </b>
          <br />
          {currentRow?.registryList &&
            currentRow?.registryList.map((host) => (
              <>
                {host} <br />
              </>
            ))}
        </>
      </Drawer>
    </PageContainer>
  );
};

export default JobGroupList;
