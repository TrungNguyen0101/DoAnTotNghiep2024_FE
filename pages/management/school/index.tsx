import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Grid, Container, Box, IconButton, Avatar } from '@mui/material';

import { ProColumns } from '@ant-design/pro-table';
import MyTable from '@/components/base/table';
import React, { useCallback, useEffect, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ConfirmDeleteModal from '@/components/base/modal/ConfirmDeleteModal';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import api from '@/api';
import ModalInfoSchool from '@/components/management/school/ModalInfoSchool';

function ScoolManage() {
  const [data, setData] = useState([]);
  const [showFormDetail, setShowFormDetail] = useState(false);
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
      render: (_, row) => (
        <IconButton
          color="secondary"
          size="small"
          onClick={() => {
            setDataSelected(row);
            setShowFormDetail(true);
          }}
        >
          <RemoveRedEyeIcon fontSize="small" />
        </IconButton>
      )
    },
    {
      title: 'Tên trường học',
      width: 150,
      fixed: 'left',
      render: (_, row) => <p>{row.name}</p>
    },
    {
      title: 'Địa chỉ',
      width: 100,
      fixed: 'left',
      render: (_, row) => <p>{row.location}</p>
    },
    {
      title: 'Miêu tả',
      width: 200,
      fixed: 'left',
      render: (_, row) => <p>{row.description}</p>
    },
    {
      title: 'Năm thành lập',
      width: 100,
      fixed: 'left',
      render: (_, row) => <p>{row.established_date}</p>
    },
    {
      width: 100,
      title: 'Action',
      align: 'center',
      dataIndex: 'Action',
      fixed: 'right',
      render: (_, row) => (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
    api.get('school').then((res) => {
      setData([...res?.data?.data]);
    });
  };

  const handleDelete = () => {
    const school_id = dataSelected.school_id;
    api.delete(`school/${school_id}`).then((res) => {
      fetchData();
      setShowConfirmDelete(false);
    });
  };

  return (
    <>
      <Head>
        <title>Quản lý Thông tin trường học</title>
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
              title={'Danh sách trường học'}
              rowKey="school_id"
              dataRows={data}
              columns={columns}
            />
          </Grid>
        </Grid>
      </Container>

      <ModalInfoSchool
        description={dataSelected?.description}
        name={dataSelected?.name}
        location={dataSelected?.location}
        established_date={dataSelected?.established_date}
        setOpen={setShowFormDetail}
        open={showFormDetail}
      ></ModalInfoSchool>

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

ScoolManage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ScoolManage;
