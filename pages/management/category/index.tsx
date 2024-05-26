import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Grid, Container, Box, IconButton, Checkbox } from '@mui/material';

import { ProColumns } from '@ant-design/pro-table';
import MyTable from '@/components/base/table';
import React, { useEffect, useState } from 'react';
import CategoryForm from '@/components/management/category/CategoryForm';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmDeleteModal from '@/components/base/modal/ConfirmDeleteModal';
import api from '@/api';

function ApplicationsTransactions() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [dataSelected, setDataSelected] = useState<any>();

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ProColumns<any>[] = [
    {
      title: 'Danh mục',
      tooltip: false,
      dataIndex: 'name',
      width: 100,
      fixed: 'left',
      sorter: false,
      render: (dom) => {
        // dom là field name (dataIndex), entity là cả row
        return <a style={{ fontWeight: '500' }}>{dom}</a>;
      }
    },
    {
      width: 150,
      title: 'Hình ảnh',
      dataIndex: 'image_url',
      fixed: 'left',
      render: (dom: any) => {
        return (
          <img
            src={dom}
            alt="Uploaded"
            style={{ maxWidth: '100%', marginTop: '10px' }}
          />
        );
      }
    },
    {
      width: 350,
      title: 'Mô tả',
      dataIndex: 'description',
      sorter: false
    },
    {
      width: 60,
      title: 'Action',
      align: 'center',
      dataIndex: 'Action',
      fixed: 'right',
      render: (_, row) => (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton
              aria-label="delete"
              color="secondary"
              size="small"
              onClick={() => {
                setDataSelected(row);
                setShowForm(true);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
              aria-label="delete"
              color="error"
              size="small"
              onClick={() => {
                setDataSelected(row);
                setShowConfirmDelete(true);
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        </>
      )
    }
  ];

  const fetchData = () => {
    api.get('category').then((res) => {
      setData([...res?.data?.data]);
    });
  };

  const handleDelete = () => {
    const { category_id } = dataSelected;
    api.delete(`category/${category_id}`).then(() => {
      fetchData();
      setShowConfirmDelete(false);
    });
  };

  const handleSaveData = (body) => {
    const formData = new FormData();
    formData.append('name', body.name);
    formData.append('description', body.description);
    formData.append('image_url', body.image_url);
    const request = !body?.category_id
      ? api.post('category', formData)
      : api.put(`category/${body.category_id}`, formData);

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
        <title>Quản lý danh mục</title>
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
              title={'Danh sách danh mục'}
              rowKey="category_id"
              dataRows={data}
              columns={columns}
              createText={'Thêm mới'}
              onCreateData={() => {
                setDataSelected({});
                setShowForm(true);
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {showForm && (
        <CategoryForm
          data={dataSelected}
          isOpen={showForm}
          onSave={handleSaveData}
          onClose={() => setShowForm(false)}
          key={''}
        />
      )}

      {showConfirmDelete && (
        <ConfirmDeleteModal
          open={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}

ApplicationsTransactions.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ApplicationsTransactions;
