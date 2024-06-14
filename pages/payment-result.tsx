import api from '@/api';
import Text from '@/components/Text';
import { ROOT_PATH } from '@/const';
import BaseLayout from '@/layouts/BaseLayout';
import { Button, Container } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

const Payment = () => {
  const router = useRouter();
  const params = router.query;

  const [result, setResult] = useState<any>({});
  const [check, setCheck] = useState(true);
  const [loading, setLoading] = useState(false);
  const { vnp_ResponseCode } = router.query;

  useEffect(() => {
    const isEmpty = (obj) => {
      return Object.keys(obj).length === 0;
    };
    if (check && !isEmpty(params)) {
      const haha = async () => {
        setLoading(false);
        const res = await api.get('/payment/checksum-payment', {
          params
        });
        console.log('haha ~ res:', res);
        if (res.status === 200) {
          setResult(res.data.data);
          if (res.data.data.code === '00') {
            enqueueSnackbar({
              message: 'Thanh toán thành công!',
              variant: 'success',
              autoHideDuration: 1500
            });
          } else {
            enqueueSnackbar({
              message: 'Thanh toán thất bại!',
              variant: 'error',
              autoHideDuration: 1500
            });
          }
        }
        setLoading(true);
        setCheck(false);
      };
      haha();
    }
  }, [params]);

  return (
    <Container
      sx={{ height: '50vh' }}
      style={{
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      {loading ? (
        <>
          {result?.code === '00' ? (
            <Text color="success">
              <b>
                Mua khóa học thành công , thời gian học khóa học sẽ bất đầu từ
                bây giờ
              </b>
            </Text>
          ) : (
            <Text color="error">
              <b>Mua khóa học thất bại</b>
            </Text>
          )}
          <Button variant="contained" size="medium" style={{ marginTop: 20 }}>
            <Link href={`/course/${result?.course?.courseManage?.course_id}`}>
              Quay lại khóa học
            </Link>
          </Button>
        </>
      ) : (
        <div>loading</div>
      )}
    </Container>
  );
};

export default Payment;

Payment.getLayout = function getLayout(page) {
  return <BaseLayout>{page}</BaseLayout>;
};

const getMessageError = (haha) => {
  switch (haha) {
    case '07':
      return 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).';

    case '09':
      return 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.';

    case '10':
      return 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần';

    case '11':
      return 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.';

    case '12':
      return 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.';

    case '13':
      return 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.';

    case '24':
      return 'Giao dịch không thành công do: Khách hàng hủy giao dịch';

    case '51':
      return 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.';

    case '65':
      return 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.';

    case '75':
      return 'Ngân hàng thanh toán đang bảo trì.';

    case '79':
      return 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch';

    default:
      return 'Lỗi không xác định';
  }
};
