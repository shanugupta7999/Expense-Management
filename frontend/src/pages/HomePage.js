import './HomePage.css';
import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { Modal, Input, Select, Button, Form, message, Table, DatePicker } from 'antd';
import axios from 'axios';
import moment from "moment";
import Spinner from './../components/Spinner';
import { UnorderedListOutlined,TableOutlined,DollarOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import Analytics from "../components/Analytics";
import UploadBill from "../pages/UploadBill/UploadBill"; // Import the new component
import SetBudget from './SetBudget/SetBudget';
import Dashboard from './Dashboard/dashboard';
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [alltransection, setAllTransection] = useState([]);
  const [frequency, setFrequency] = useState('7');
  const [selectedDate, setSelectedate] = useState([]);
  const [type, setType] = useState('all');
  const [viewData, setViewData] = useState('table');
  const [editable, setEditable] = useState(null);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
    },
    // {
    //   title: 'Description',
    //   dataIndex: 'description',
    // },
    {
      title: 'Actions',
      render: (text, record) => (
        <div>
          <EditOutlined onClick={() => {
            setEditable(record);
            setShowModal(true);
          }} />
          <DeleteOutlined className="mx-2" onClick={() => handleDelete(record)} />
        </div>
      ),
    },
  ];


  // const getAllTransections = async () => {
  //   try {
  //     const user = JSON.parse(localStorage.getItem('user'));
  //     setLoading(true);
  //     const res = await axios.post('/transections/get-transection', { userid: user._id, frequency });
      
  //     setLoading(false);
  //     setAllTransection(res.data);
  //     console.log(res.data);
  //   } catch (error) {
  //     console.log(error);
  //     message.error("Fetch Issue With Transection...");
  //   }
  // };

  useEffect(() => {
    const getAllTransections = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        setLoading(true);
        const res = await axios.post('/transections/get-transection', { userid: user._id, frequency, selectedDate, type });
        setLoading(false);
        setAllTransection(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        message.error("Fetch Issue With Transection...");
      }
    };
    getAllTransections();
  }, [frequency, selectedDate, type]);

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("/transections/delete-transection", { transactionId: record._id });
      setLoading(false);
      message.success("Transection Delete Successfully");
    } catch {
      setLoading(false);
      message.error("Unable To Delete");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);

      if (editable) {
        await axios.post('/transections/edit-transection',
          {
            payload: { ...values, userid: user._id },
            transacationId: editable._id,
          }
        );
        setLoading(false);
        message.success("Transection Updated Successfully");
      } else {
        await axios.post('/transections/add-transection', { ...values, userid: user._id });
      }

      setLoading(false);
      message.success("Transaction Added Successfully...");
      setShowModal(false);
      setEditable(null);
      form.resetFields(); 
    } catch (error) {
      setLoading(false);
      message.error("Failed To Add Transaction...");
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
      
      <div className="main-container">
        {/* Sidebar */}
        <div className="sidebar">
          <h3>View Options</h3>
          <div className="sidebar-options">
            <Button
              icon={<UnorderedListOutlined />}
              onClick={() => setViewData('dashboard')}
              className={viewData === 'dashboard' ? 'active-btn' : ''}
              >
              Dashboard
            </Button>
            <Button
              icon={<TableOutlined />}
              onClick={() => setViewData('table')}
              className={viewData === 'table' ? 'active-btn' : ''}
            >
              Table View
            </Button>
            <Button
              icon={<AreaChartOutlined />}
              onClick={() => setViewData('analytics')}
              className={viewData === 'analytics' ? 'active-btn' : ''}
            >
              Analytics View
            </Button>

            <Button
              icon={<UploadOutlined />}
              onClick={() => setViewData('uploadBill')}
              className={viewData === 'uploadBill' ? 'active-btn' : ''}
            >
              Upload Bills
            </Button>
            <Button
              icon={<DollarOutlined />}
              onClick={() => setViewData('setBudget')}
              className={viewData === 'setBudget' ? 'active-btn' : ''}
            >
              Set Budget
            </Button>
            
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Filters */}
          {(viewData === 'table' || viewData === 'analytics') && (
          <div className="filters">
            <div>
              <h6 className='Freq'>Select Frequency</h6>
              <Select value={frequency} onChange={(values) => setFrequency(values)}>
                <Select.Option value="7">Last One Week</Select.Option>
                <Select.Option value="30">Last one Month</Select.Option>
                <Select.Option value="365">Last One Year</Select.Option>
                <Select.Option value="custom"> Custom</Select.Option>
              </Select>
              {frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values) => setSelectedate(values)} />}
            </div>

            <div>
              <h6 className='type'>Select Type</h6>
              <Select value={type} onChange={(values) => setType(values)}>
                <Select.Option value="all">All</Select.Option>
                <Select.Option value="income">Income</Select.Option>
                <Select.Option value="expense">Expense</Select.Option>
              </Select>
            </div>

            <div>
              <button className="btn btn-primary btn-navy" onClick={() => setShowModal(true)}>Add New</button>
            </div>
          </div>
          )}
          {/* Table or Analytics View */}
          <div className="content">
          {viewData === 'table' && <Table columns={columns} dataSource={alltransection} />}
          {viewData === 'analytics' && <Analytics allTransection={alltransection} />}
          {viewData === 'uploadBill' && <UploadBill />} 
          {viewData === 'setBudget' && <SetBudget />} 
          {viewData === 'dashboard' && <Dashboard />} 
          {/* Rendering UploadBill component */}
         </div>
        </div>
      </div>
      {/* Modal */}
      <Modal
        title={editable ? 'Edit Transection' : 'Add Transection'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={editable}
        >
          <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please enter the amount!' }]}>
            <Input type="text" />
          </Form.Item>

          <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Please select a type!' }]}>
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select a category!' }]}>
            <Select>
              <Select.Option value="Salary">Salary</Select.Option>
              <Select.Option value="Tip">Tip</Select.Option>
              <Select.Option value="Project">Project</Select.Option>
              <Select.Option value="Food">Food</Select.Option>
              <Select.Option value="Movie">Movie</Select.Option>
              <Select.Option value="Fee">Fee</Select.Option>
              <Select.Option value="Tax">Tax</Select.Option>
              <Select.Option value="Medical">Medical</Select.Option>
              <Select.Option value="Bills">Bills</Select.Option>
              <Select.Option value="miscellaneous">Miscellaneous</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>

          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>

          {/* <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit">Save</Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Add Upload Bill section */}
      {/* <div className="upload-bill-section">
        <h2>Upload Your Bill</h2>
        <UploadBill />
      </div> */}
    </Layout>
  );
};

export default HomePage;




