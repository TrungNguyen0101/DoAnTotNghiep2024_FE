import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import {
  Grid,
  Container,
  Box,
  IconButton,
  Checkbox,
  Typography
} from '@mui/material';

import { ProColumns } from '@ant-design/pro-table';
import MyTable from '@/components/base/table';
import React, { useEffect, useState } from 'react';
import CategoryForm from '@/components/management/category/CategoryForm';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmDeleteModal from '@/components/base/modal/ConfirmDeleteModal';
import api from '@/api';

function Payment() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [dataSelected, setDataSelected] = useState<any>();

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ProColumns<any>[] = [
    {
      width: 15,
      fixed: 'left',
      align: 'center',
      render: (_) => <Checkbox size="small" />
    },
    {
      title: 'Khóa học',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
      sorter: true,
      render: (_, dom) => {
        // dom là field name (dataIndex), entity là cả row
        return (
          <div>
            <Typography variant="h5" style={{ fontWeight: '600' }}>
              {dom?.course?.name}
            </Typography>
            <Typography variant="subtitle1">{dom?.tutor?.email}</Typography>
          </div>
        );
      }
    },
    {
      width: 150,
      title: 'Học sinh',
      dataIndex: 'student.student_id',
      fixed: 'left',
      render: (_, dom) => {
        // dom là field name (dataIndex), entity là cả row
        return (
          <div>
            <Typography variant="h5" style={{ fontWeight: '500' }}>
              {dom?.student?.first_name ||
                '' + ' ' + dom?.student?.last_name ||
                ''}
            </Typography>
            <Typography variant="subtitle1">{dom?.student?.email}</Typography>
          </div>
        );
      }
    },
    {
      width: 200,
      title: 'Giá khóa học',
      dataIndex: 'price',
      sorter: true
    },
    {
      width: 200,
      title: 'Trạng thái',
      dataIndex: 'status',
      sorter: true
    }
  ];

  const fetchData = () => {
    api.get('booked-session').then((res) => {
      setData([...res?.data?.data]);
    });
  };

  const handleDelete = () => {
    const { category_id } = dataSelected;
    api.delete(`booked-session/${category_id}`).then(() => {
      fetchData();
      setShowConfirmDelete(false);
    });
  };

  const handleSaveData = (body) => {
    const request = !body?.category_id
      ? api.post('booked-session', body)
      : api.put(`booked-session/${body.category_id}`, body);

    request
      .then((res) => {
        console.log(res);
        fetchData();
        setShowForm(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Head>
        <title>Quản lý tài chính</title>
      </Head>
      <Container
        maxWidth="lg"
        sx={{
          mt: 3
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <MyTable
              title={'Danh sách mua khóa học'}
              rowKey="booked-session_id"
              dataRows={data}
              columns={columns}
              onCreateData={() => {
                setDataSelected({});
                setShowForm(true);
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

Payment.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Payment;
