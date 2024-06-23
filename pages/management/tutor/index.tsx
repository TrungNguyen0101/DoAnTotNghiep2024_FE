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
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { enqueueSnackbar } from 'notistack';
function TutorProfile() {
  const [data, setData] = useState([]);
  const [showFormDetail, setShowFormDetail] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [dataSelected, setDataSelected] = useState<any>();

  const fetchData = () => {
    api.get('tutor').then((res) => {
      setData([...res?.data?.data]);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveTutor = async (id, payload) => {
    const res = await api.put(`/tutor/${id}`, payload);
    if (res?.status === 200) {
      fetchData();
      enqueueSnackbar({
        message: 'Thao tác thành công',
        variant: 'success',
        autoHideDuration: 1500
      });
    } else {
      enqueueSnackbar({
        message: 'Thao tác thất bại',
        variant: 'error',
        autoHideDuration: 1500
      });
    }
  };

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
          {row.user?.last_name} {row.user?.first_name}
        </p>
      )
    },
    {
      width: 100,
      title: 'Ảnh đại diện',
      fixed: 'left',
      render: (_, row) =>
        row.user?.avatar_url ? (
          <Image
            width={80}
            height={60}
            src={row.user?.avatar_url}
            objectFit="cover"
          ></Image>
        ) : (
          <Avatar></Avatar>
        )
    },
    {
      title: 'Môn dạy',
      width: 100,
      fixed: 'left',
      render: (_, row) => (
        <p>{row.tutor_educations[0]?.favorite_subject || 'chưa có'}</p>
      )
    },
    {
      title: 'Email',
      width: 200,
      fixed: 'left',
      render: (_, row) => <p>{row.user?.email}</p>
    },
    {
      title: 'Điện thoại',
      width: 150,
      fixed: 'left',
      render: (_, row) => <p>{row.user?.phone_number}</p>
    },
    {
      title: 'Trạng thái',
      width: 100,
      fixed: 'left',
      render: (_, row) => {
        console.log('TutorProfile ~ row:', row);
        return !!row.approve ? (
          <>{row.check_approve ? <p>Đã được duyệt</p> : <p>Đã từ chối</p>}</>
        ) : (
          <div
            style={{
              display: 'flex',
              gap: '15px'
            }}
          >
            <CheckIcon
              style={{ cursor: 'pointer' }}
              onClick={() => {
                handleApproveTutor(row?.tutor_profile_id, {
                  check_approve: true,
                  approve: true
                });
              }}
            />
            <ClearIcon
              style={{ cursor: 'pointer' }}
              onClick={() => {
                handleApproveTutor(row?.tutor_profile_id, {
                  check_approve: false,
                  approve: true
                });
              }}
            />
          </div>
        );
      }
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
                // handleApproveTutor(row?.tutor_profile_id, {
                //   check_approve: false,
                //   approve: true
                // });
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

  const handleDelete = () => {
    const tutor_id = dataSelected.tutor_profile_id;

    handleApproveTutor(tutor_id, {
      check_approve: false,
      approve: true
    });
    fetchData();
    setShowConfirmDelete(false);
    // api.delete(`tutor/${tutor_id}`).then((res) => {
    //   fetchData();
    //   setShowConfirmDelete(false);
    // });
  };

  return (
    <>
      <>
        <title>Quản lý Profile gia sư</title>
      </>
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
        // company={dataSelected?.tutor_experiences[0]?.organization}
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
