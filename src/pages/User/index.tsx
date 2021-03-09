import { PlusOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import { Button, message, FormInstance } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormRadio, ProFormSelect } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import type { QueryParam, User } from './data.d';
import { queryUsers, saveUser, deleteUser } from './service';

import { queryMyJobGroups } from '../JobGroup/service';
import { JobGroup } from '../JobGroup/data';

const UserList: React.FC = () => {
  /** 国际化配置 */
  const intl = useIntl();

  /**
   * 删除用户
   * @param fields 用户
   */
  const handleDelete = async (user: User) => {
    if (user.id) {
      await deleteUser(user.id);
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
   * 新增或编辑用户
   *
   * @param fields
   */
  const handleFormSubmit = async (fields: User) => {
    /** 国际化配置 */
    const hide = message.loading(
      intl.formatMessage({
        id: 'pages.common.dealing',
        defaultMessage: '处理中...',
      }),
    );

    try {
      const { code, msg } = await saveUser(fields);
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
  const [currentRow, setCurrentRow] = useState<User>();

  const [perEditVisible, setPerEditVisible] = useState<boolean>(true);

  /** 确认删除窗口 */
  const [delConfirmModalVisible, handleDelConfirmModalVisible] = useState<boolean>(false);

  const tableActionRef = useRef<ActionType>();
  const searchFormRef = useRef<FormInstance>();

  const columns: ProColumns<User>[] = [
    {
      title: <FormattedMessage id="pages.users.username" defaultMessage="帐户" />,
      dataIndex: 'username',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              // setCurrentRow(entity);
              // setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.users.role" defaultMessage="状态" />,
      dataIndex: 'role',
      // hideInSearch: true,
      valueEnum: {
        0: {
          text: <FormattedMessage id="pages.users.role.normal" defaultMessage="普通用户" />,
          status: '普通用户',
        },
        1: {
          text: <FormattedMessage id="pages.users.role.admin" defaultMessage="管理员" />,
          status: '管理员',
        },
      },
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
          style={{ display: record.username !== 'admin' ? '' : 'none' }}
          onClick={() => {
            setCurrentRow(record);
            handleFormModalVisible(true);
          }}
        >
          <FormattedMessage id="pages.common.edit" defaultMessage="编辑" />
        </a>,
        <a
          style={{ display: record.username !== 'admin' ? '' : 'none' }}
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
      <ProTable<User, QueryParam>
        headerTitle={intl.formatMessage({
          id: 'pages.users.list',
          defaultMessage: '用户列表',
        })}
        actionRef={tableActionRef}
        formRef={searchFormRef}
        rowKey="id"
        onLoad={() => {
          // searchFormRef.current?.setFieldsValue({
          //   username: 'admin'
          // })
        }}
        // params={{ username: 'admin' }}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleFormModalVisible(true);
              setCurrentRow({} as User);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.common.new" defaultMessage="新建" />
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const result = await queryUsers({ ...params, sorter, filter });
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
            const success = handleDelete(currentRow as User);
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
            id: 'pages.common.edit',
            defaultMessage: '编辑',
          })}
          width="460px"
          visible={formModalVisible}
          onVisibleChange={handleFormModalVisible}
          onFinish={async (value) => {
            value = { ...currentRow, ...value };
            const success = await handleFormSubmit(value as User);
            if (success) {
              handleFormModalVisible(false);
              if (tableActionRef.current) {
                tableActionRef.current.reload();
              }
            }
          }}
        >
          <ProFormText
            label={intl.formatMessage({
              id: 'pages.users.username',
              defaultMessage: '帐号'
            })}
            initialValue={currentRow?.username}
            readonly={currentRow?.id !== undefined}
            hidden={currentRow?.id !== undefined}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.users.form.username.required"
                    defaultMessage="帐户必须填写"
                  />
                ),
              },
              {
                min: 4,
                max: 64,
                message: (
                  <FormattedMessage
                    id="pages.users.form.len.check"
                    defaultMessage="长度必须在[4-64]"
                  />
                ),
              },
            ]}
            width="md"
            name="username"
          />
          <ProFormText.Password
            label={intl.formatMessage({
              id: 'pages.users.password',
              defaultMessage: '密码'
            })}
            rules={[
              {
                required: currentRow?.id ? false : true,
                message: (
                  <FormattedMessage
                    id="pages.users.form.password.required"
                    defaultMessage="密码必须填写"
                  />
                ),
              },
              {
                min: 4,
                max: 64,
                message: (
                  <FormattedMessage
                    id="pages.users.form.len.check"
                    defaultMessage="长度必须在[4-64]"
                  />
                ),
              },
            ]}
            width="md"
            name="password"
          />
          <ProFormRadio.Group
            name="role"
            label={intl.formatMessage({ id: 'pages.users.role', defaultMessage: '角色' })}
            initialValue={currentRow?.role || 0}
            fieldProps={{
              onChange: ({ target: { value } }) => {
                // console.log(value);
                if (value === 0)
                  setPerEditVisible(true);
                else
                  setPerEditVisible(false);
              }
            }}
            options={[
              {
                label: intl.formatMessage({
                  id: 'pages.users.role.normal',
                  defaultMessage: '普通用户',
                }),
                value: 0,
              },
              {
                label: intl.formatMessage({
                  id: 'pages.users.role.admin',
                  defaultMessage: '管理员',
                }),
                value: 1,
              },
            ]}
          />
          <ProFormSelect
            name="permission"
            label={intl.formatMessage({
              id: 'pages.users.permission',
              defaultMessage: '权限'
            })}
            hidden={!perEditVisible}
            initialValue={currentRow?.permission}
            // initialValue={[1, 2]}
            fieldProps={{
              mode: 'multiple',
              showSearch: true,
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
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default UserList;
