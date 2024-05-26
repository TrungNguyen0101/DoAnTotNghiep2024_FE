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
import ModalShowInfo from '@/components/management/tutor/ModalShowInfo';
import { FileCopyOutlined } from '@mui/icons-material';

function TutorProfile() {
  const [data, setData] = useState([]);
  const [showFormDetail, setShowFormDetail] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [dataSelected, setDataSelected] = useState<any>();

  useEffect(() => {
    fetchData();
    console.log(data);
    
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
      title: 'Tên gia sư',
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
      title: 'Môn dạy',
      width: 100,
      fixed: 'left',
      render: (_, row) => <p>{row.tutor_educations[0]?.favorite_subject}</p>
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
      title: 'Cv cá nhân',
      width: 100,
      fixed: 'left',
      render: (_, row) => row.user?.file_cv ? (<a href={row.user?.file_cv} target='_blank' rel="noopener noreferrer">
        <div style={{display: 'flex', alignItems: 'center'}}>
          <FileCopyOutlined />
          <p>Thông tin</p>
        </div>
      </a>) : ( <FileCopyOutlined />)
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
    api.get('tutor').then((res) => {
      setData([...res?.data?.data]);
    });
  };

  const handleDelete = () => {
    const tutor_id = dataSelected.tutor_profile_id;
    api.delete(`tutor/${tutor_id}`).then((res) => {
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

      <ModalShowInfo
        firstName={dataSelected?.user?.first_name}
        lastName={dataSelected?.user?.last_name}
        avatar={dataSelected?.user?.avatar_url}
        description={dataSelected?.description}
        gender={dataSelected?.user?.gender}
        phone={dataSelected?.user?.phone_number}
        email={dataSelected?.user?.email}
        company={dataSelected?.tutor_experiences[0]?.organization}
        subject={dataSelected?.tutor_educations[0]?.favorite_subject}
        setOpen={setShowFormDetail}
        open={showFormDetail}
      ></ModalShowInfo>

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

TutorProfile.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default TutorProfile;
