import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Grid, Container, Box, IconButton, Avatar } from '@mui/material';

import { ProColumns } from '@ant-design/pro-table';
import MyTable from '@/components/base/table';
import React, { useEffect, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ConfirmDeleteModal from '@/components/base/modal/ConfirmDeleteModal';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import api from '@/api';
import Image from 'next/image';

function RatingPage() {
  const [data, setData] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [dataSelected, setDataSelected] = useState<any>();
  const [showFormDetail, setShowFormDetail] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ProColumns<any>[] = [
    {
      title: 'Tên người học',
      width: 150,
      fixed: 'left',
      render: (_, row) => (
        <p>
          {row.user?.first_name} {row.user?.last_name}
        </p>
      )
    },
    {
      width: 100,
      title: 'Khóa học',
      fixed: 'left',
      render: (_, row) =>
        row.user?.avatar_url ? (
          <Image width={50} height={50} src={row.user?.avatar_url}></Image>
        ) : (
          <Avatar></Avatar>
        )
    },
    {
      title: 'Feedback',
      width: 200,
      fixed: 'left',
      render: (_, row) => <p>{row.message}</p>
    },
    {
      title: 'Rating',
      width: 200,
      fixed: 'left',
      render: (_, row) => <p>{row.rate}</p>
    }
  ];

  const fetchData = () => {
    api.get('tutoring-feedback').then((res) => {
      setData([...res?.data?.data]);
    });
  };

  const handleDelete = () => {
    const rating_id = dataSelected.student_profile_id;
    api.delete(`tutoring-feedback/${rating_id}`).then((res) => {
      fetchData();
      setShowConfirmDelete(false);
    });
  };

  return (
    <>
      <Head>
        <title>Quản lý đánh giá gia sư</title>
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
              title={'Danh sách học sinh'}
              rowKey="student_profile_id"
              dataRows={data}
              columns={columns}
            />
          </Grid>
        </Grid>
      </Container>

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

RatingPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default RatingPage;
