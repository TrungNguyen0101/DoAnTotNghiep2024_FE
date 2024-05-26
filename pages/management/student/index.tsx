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
import ModalnfoStudent from '@/components/management/student/ModalnfoStudent';

function StudentProfile() {
  const [data, setData] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [dataSelected, setDataSelected] = useState<any>();
  const [showFormDetail, setShowFormDetail] = useState(false);

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
      title: 'Ảnh đại diện',
      fixed: 'left',
      render: (_, row) =>
        row.user?.avatar_url ? (
          <Image width={50} height={50} src={row.user?.avatar_url}></Image>
        ) : (
          <Avatar></Avatar>
        )
    },
    {
      title: 'Email',
      width: 200,
      fixed: 'left',
      render: (_, row) => <p>{row.user?.email}</p>
    },
    {
      title: 'Sđt',
      width: 200,
      fixed: 'left',
      render: (_, row) => <p>{row.user?.phone_number}</p>
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
  console.log(dataSelected);

  const fetchData = () => {
    api.get('student').then((res) => {
      setData([...res?.data?.data]);
    });
  };

  const handleDelete = () => {
    const student_id = dataSelected.student_profile_id;
    api.delete(`student/${student_id}`).then((res) => {
      fetchData();
      setShowConfirmDelete(false);
    });
  };

  return (
    <>
      <Head>
        <title>Quản lý Profile Học sinh</title>
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

      <ModalnfoStudent
        firstName={dataSelected?.user?.first_name}
        lastName={dataSelected?.user?.last_name}
        avatar={dataSelected?.user?.avatar_url}
        school={dataSelected?.student_educations?.[0]?.school?.name}
        startSchool={dataSelected?.student_educations?.[0]?.from_year}
        endSchool={dataSelected?.student_educations?.[0]?.to_year}
        gender={dataSelected?.user?.gender}
        phone={dataSelected?.user?.phone_number}
        email={dataSelected?.user?.email}
        setOpen={setShowFormDetail}
        open={showFormDetail}
      />

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

StudentProfile.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default StudentProfile;
