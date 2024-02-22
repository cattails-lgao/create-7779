import { Form, Table } from 'antd';
import PropTypes from 'prop-types';

export default function BasicTable({
  formList,
  columns,
  data,
  rules,
  onFormSubmit,
}) {
  return (
    <>
      <Form
        name="BasicTable"
        className="mb-4"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        initialValues={{ remember: true }}
        onFinish={onFormSubmit}
        autoComplete="off"
      >
        {formList &&
          formList.map((item) => {
            <Form.Item label={item.label} name={item.name} rules={rules.name}>
              {/* 输入框 */}
            </Form.Item>;
          })}
      </Form>
      <Table columns={columns} dataSource={data} />
    </>
  );
}

BasicTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  formList: PropTypes.array,
  rules: PropTypes.object,
  onFormSubmit: PropTypes.func,
};

BasicTable.defaultProps = {
  formList: [],
  columns: [],
  data: [],
  rules: {},
};
