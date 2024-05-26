import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Grid, Container, Box, IconButton } from '@mui/material';

import { ProColumns } from '@ant-design/pro-table';
import MyTable from '@/components/base/table';
import React, { useEffect, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ConfirmDeleteModal from '@/components/base/modal/ConfirmDeleteModal';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import api from '@/api';
import Image from 'next/image';
import ModalInfoCourse from '../../../src/components/management/course/ModalInfoCourse';

function CourseManage() {
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
      title: 'Tên khoá học',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
      sorter: true,
      render: (dom) => {
        return <a style={{ fontWeight: '500' }}>{dom}</a>;
      }
    },
    {
      width: 150,
      title: 'Hình ảnh',
      render: (_, row) =>
        row.user?.avatar_url ? (
          <Image width={50} height={50} src={row.user?.avatar_url}></Image>
        ) : (
          <></>
        ),
      fixed: 'left'
    },
    {
      title: 'Học phí',
      width: 200,
      fixed: 'left',
      render: (_, row) => <p>{row.price}</p>
    },
    {
      title: 'Mô tả',
      width: 200,
      fixed: 'left',
      render: (_, row) => <p>{row.description}</p>
    },
    {
      title: 'Người học',
      width: 200,
      fixed: 'left',
      render: (_, row) => <p>{row.category?.name}</p>
    },
    {
      title: 'Gia sư',
      width: 200,
      fixed: 'left',
      render: (_, row) => <p>{row.tutor_profile?.user?.first_name}</p>
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
    api.get('course').then((res) => {
      setData([...res?.data?.data]);
    });
  };

  const handleDelete = () => {
    const courseId = dataSelected.course_id;
    api.delete(`course/${courseId}`).then((res) => {
      fetchData();
      setShowConfirmDelete(false);
    });
  };

  return (
    <>
      <Head>
        <title>Quản lý Profile gia sư</title>
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
              title={'Danh sách gia sư'}
              rowKey="tutor_profile_id"
              dataRows={data}
              columns={columns}
            />
          </Grid>
        </Grid>
      </Container>

      <ModalInfoCourse
        name={dataSelected?.name}
        avatar={dataSelected?.image_url}
        description={dataSelected?.description}
        ratting={dataSelected?.ratting}
        price={dataSelected?.price}
        tutor={dataSelected?.tutor_profile?.user?.last_name}
        spendTime={dataSelected?.spend_time}
        setOpen={setShowFormDetail}
        open={showFormDetail}
      ></ModalInfoCourse>

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

CourseManage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default CourseManage;
