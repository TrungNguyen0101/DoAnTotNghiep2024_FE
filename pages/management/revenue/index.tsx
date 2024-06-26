import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Card, Space, Statistic } from 'antd';
import { useEffect, useState } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Container, Grid, MenuItem, Select } from '@mui/material';
import api from '@/api';
import Item from 'antd/es/list/Item';
import { fontSize } from '@mui/system';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import { ROLE_ADMIN_ID, ROLE_TEACHER_ID } from '@/const';
// import TableOrder from '../TableOrder';
// import useQueryConfig from 'src/hooks/useQueryConfig';
// import { useQuery } from 'react-query';
// import adminApi from 'src/apis/admin.api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

function Revenue() {
  const [lengthAccount, setLengthAccount] = useState(0);
  const [lengthProduct, setLengthProduct] = useState(0);
  const [lengthOrder, setLengthOrder] = useState(0);
  const [isStatus, setIsStatus] = useState(false);
  const options = [
    'Tổng thu nhập theo tháng',
    'Lợi nhuận theo tháng',
    'Lợi nhuận theo ngày',
    'Top 10 doanh thu gia sư'
  ];
  const [selectedValue, setSelectedValue] = useState(options[0]);

  const [paymentStatus, setPaymentData] = useState<any>();
  const [totalMonth, setTotalMonth] = useState<any>(0);
  const [profitMonth, setProfitMonth] = useState<any>(0);
  const [profitTutor, setProfitTutor] = useState<any>(0);
  const [totalMoney, setTotalMoney] = useState<any>(0);

  useEffect(() => {
    const handleGetAllPayment = async () => {
      api.get('/payment').then((res) => {
        setPaymentData(res?.data?.data?.rows);
        const totalAmount = res?.data?.data?.rows.reduce((total, payment) => {
          return total + parseInt(payment.amount);
        }, 0);

        setTotalMoney(totalAmount);
      });
    };
    handleGetAllPayment();
  }, []);

  const [sortedMonths, setSortedMonths] = useState([]);
  const [sortedMonthsTotal, setSortedMonthsTotal] = useState([]);
  const [total, setTotal] = useState<any>(0);
  const [tutorRanking, setTutorRanking] = useState<any>([]);

  const router = useRouter();
  const getInfoUser = async () => {
    const token = localStorage?.getItem('access_token');
    if (token) {
      const decoded = jwtDecode<any>(token);
      try {
        const res = await api.get(`/user/get-user-info/${decoded?.user_id}`);
        if (res.status === 200) {
          const user = res.data.data;
          if (user.role_id !== ROLE_ADMIN_ID) {
            router.push('/');
          }
        }
      } catch (error) {
        router.push('/');
      }
    } else {
      router.push('/auth/login');
    }
  };
  useEffect(() => {
    getInfoUser();
  }, []);

  useEffect(() => {
    const handleData = () => {
      const newData =
        paymentStatus?.length > 0 &&
        paymentStatus.map((item) => {
          // Convert the time string into a Date object
          const timeString = item.time;
          const year = parseInt(timeString.substring(0, 4), 10);
          const month = parseInt(timeString.substring(4, 6), 10) - 1; // Month in JavaScript Date starts from 0
          const day = parseInt(timeString.substring(6, 8), 10);
          const hour = parseInt(timeString.substring(8, 10), 10);
          const minute = parseInt(timeString.substring(10, 12), 10);
          const second = parseInt(timeString.substring(12, 14), 10);
          const date = new Date(year, month, day, hour, minute, second);

          // Format month name
          const monthName = new Intl.DateTimeFormat('en-US', {
            month: 'long'
          }).format(date);

          // todo
          return {
            createdAt: monthName,
            totalmoney: item.amount * 0.3,
            year: year
          };
        });

      const newData1 =
        newData &&
        newData?.reduce((acc, item) => {
          const existingMonthIndex = acc.findIndex(
            (entry) => entry.createdAt === item.createdAt
          );

          if (existingMonthIndex !== -1) {
            acc[existingMonthIndex].totalmoney = (
              parseInt(acc[existingMonthIndex].totalmoney) +
              parseInt(item.totalmoney)
            ).toString();
          } else {
            acc.push({
              createdAt: item.createdAt,
              totalmoney: item.totalmoney,
              year: item.year
            });
          }

          return acc;
        }, []);

      const totalAmount = newData1
        ? newData1.reduce((acc, item) => acc + parseFloat(item.totalmoney), 0)
        : 0;

      setProfitMonth(totalAmount);

      const currentYear = new Date().getFullYear();
      const recentMonths = [];

      // Lặp qua tất cả 12 tháng trong năm
      for (let i = 0; i < 12; i++) {
        const month = new Date(currentYear, i, 1).toLocaleString('default', {
          month: 'long'
        });
        recentMonths.push(month);
      }

      // Map qua mảng dữ liệu và trả về kết quả
      const newData123 = recentMonths.map((month, index) => {
        const dataForMonth =
          newData1 && newData1?.find((item) => item.createdAt === month);
        return {
          createdAt: `Tháng ${index + 1}`, // Thay thế nhãn thành Tháng 1, Tháng 2, ...
          totalmoney: dataForMonth ? dataForMonth.totalmoney : '0',
          year: dataForMonth ? dataForMonth.year : currentYear
        };
      });

      // Không cần sắp xếp mảng vì chúng ta đã lặp qua tất cả các tháng trong năm

      setSortedMonths(newData123);
    };

    handleData();
  }, [paymentStatus]);

  useEffect(() => {
    const handleData = () => {
      const newData =
        paymentStatus?.length > 0 &&
        paymentStatus.map((item) => {
          // Convert the time string into a Date object
          const timeString = item.time;
          const year = parseInt(timeString.substring(0, 4), 10);
          const month = parseInt(timeString.substring(4, 6), 10) - 1; // Month in JavaScript Date starts from 0
          const day = parseInt(timeString.substring(6, 8), 10);
          const hour = parseInt(timeString.substring(8, 10), 10);
          const minute = parseInt(timeString.substring(10, 12), 10);
          const second = parseInt(timeString.substring(12, 14), 10);
          const date = new Date(year, month, day, hour, minute, second);

          // Format month name
          const monthName = new Intl.DateTimeFormat('en-US', {
            month: 'long'
          }).format(date);

          // todo
          return {
            createdAt: monthName,
            totalmoney: item.amount,
            year: year
          };
        });

      const newData1 =
        newData &&
        newData?.reduce((acc, item) => {
          const existingMonthIndex = acc.findIndex(
            (entry) => entry.createdAt === item.createdAt
          );

          if (existingMonthIndex !== -1) {
            acc[existingMonthIndex].totalmoney = (
              parseInt(acc[existingMonthIndex].totalmoney) +
              parseInt(item.totalmoney)
            ).toString();
          } else {
            acc.push({
              createdAt: item.createdAt,
              totalmoney: item.totalmoney,
              year: item.year
            });
          }

          return acc;
        }, []);

      const totalAmount = newData1
        ? newData1.reduce((acc, item) => acc + parseFloat(item.totalmoney), 0)
        : 0;

      setTotalMonth(totalAmount);

      const currentYear = new Date().getFullYear();
      const recentMonths = [];

      // Lặp qua tất cả 12 tháng trong năm
      for (let i = 0; i < 12; i++) {
        const month = new Date(currentYear, i, 1).toLocaleString('default', {
          month: 'long'
        });
        recentMonths.push(month);
      }

      // Map qua mảng dữ liệu và trả về kết quả
      const newData123 = recentMonths.map((month, index) => {
        const dataForMonth =
          newData1 && newData1?.find((item) => item.createdAt === month);
        return {
          createdAt: `Tháng ${index + 1}`, // Thay thế nhãn thành Tháng 1, Tháng 2, ...
          totalmoney: dataForMonth ? dataForMonth.totalmoney : '0',
          year: dataForMonth ? dataForMonth.year : currentYear
        };
      });

      // Không cần sắp xếp mảng vì chúng ta đã lặp qua tất cả các tháng trong năm

      setSortedMonthsTotal(newData123);
    };

    handleData();
  }, [paymentStatus]);

  useEffect(() => {
    const handleData = () => {
      // Tính tổng số tiền cho mỗi tutor
      const tutorTotals = {};

      paymentStatus?.length > 0 &&
        paymentStatus.forEach((payment) => {
          const tutorProfileId = payment.course_payment.tutor_profile_id;
          const amount = parseInt(payment.amount) * 0.7;

          if (tutorTotals[tutorProfileId]) {
            tutorTotals[tutorProfileId] += amount;
          } else {
            tutorTotals[tutorProfileId] = amount;
          }
        });

      // Sắp xếp tutor theo tổng số tiền giảm dần
      const sortedTutors = Object.entries(tutorTotals).sort(
        (a: any, b: any) => b[1] - a[1]
      );

      // Lấy 5 tutor có tổng số tiền cao nhất
      const top5Tutors = sortedTutors.slice(0, 10);

      // Trả về kết quả
      const result = top5Tutors.map(([tutorProfileId, totalAmount]) => ({
        tutor_profile_id: tutorProfileId,
        total_amount: totalAmount
      }));

      const totalAmount = result.reduce(
        (acc: any, item: any) => acc + item.total_amount,
        0
      );
      setProfitTutor(totalAmount);

      const fetchUserName = async (tutor_profile_id) => {
        const response = await api.get(
          `/tutor/get-user-by-id/${tutor_profile_id}`
        );
        const { first_name, last_name } = response.data.data.user;
        return `${first_name} ${last_name}`;
      };

      const updateResultWithUserNames = async () => {
        try {
          // Tạo mảng các promise để lấy tên user
          const promises = result.map(async (item) => {
            const userName = await fetchUserName(item.tutor_profile_id);
            return {
              total_amount: item.total_amount,
              user_name: userName
            };
          });

          // Chờ tất cả các promise hoàn thành
          const updatedResult = await Promise.all(promises);

          setTutorRanking(updatedResult);
          return updatedResult;
        } catch (error) {
          console.error('Error fetching user names:', error);
        }
      };
      updateResultWithUserNames();
    };

    handleData();
  }, [paymentStatus]);

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;

    let currentData = null;
    let lastData = null;

    sortedMonths?.forEach((item) => {
      const month = parseInt(item.createdAt.split(' ')[1]);
      if (month === currentMonth) {
        currentData = item;
      } else if (month === lastMonth) {
        lastData = item;
      }
    });
    if (currentData && lastData) {
      const currentRevenue = parseInt(currentData.totalmoney);
      const lastRevenue = parseInt(lastData.totalmoney);

      const revenueDiff = currentRevenue - lastRevenue;
      const revenueChangePercentage = (
        (revenueDiff / lastRevenue) *
        100
      ).toFixed(2);

      setTotal(revenueChangePercentage);
    } else {
    }
  }, [sortedMonths]);

  const data = {
    labels: sortedMonths.map((month) => month.createdAt),
    datasets: [
      {
        label: 'Doanh thu mỗi tháng trong năm',
        data: sortedMonths.map((month) => month.totalmoney),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Màu cho nhãn "Doanh thu trong 12 tháng"
          'rgba(255, 206, 86, 0.6)', // Màu cho dữ liệu trong 12 tháng
          'rgba(153, 102, 255, 0.6)',
          'rgba(52, 162, 235, 0.6)'
        ]
      }
    ]
  };
  const options1 = {
    plugins: {
      title: {
        display: true,
        text: `Tổng tiền trong biểu đồ: ${profitMonth?.toLocaleString('it-IT', {
          style: 'currency',
          currency: 'VND'
        })}`,
        padding: {
          bottom: 10
        },
        font: {
          size: 18 // Chỉnh font-size tại đây
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = parseFloat(context.raw).toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND'
            }); // Làm tròn giá trị đến 2 chữ số thập phân
            return `Tiền: ${value}  VNĐ`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Thời gian (Tháng)'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'VNĐ (đ)'
        }
      }
    }
  };

  const dataTotal = {
    labels: sortedMonthsTotal.map((month) => month.createdAt),
    datasets: [
      {
        label: `Tổng thu nhập mỗi tháng trong năm`,
        data: sortedMonthsTotal.map((month) => month.totalmoney),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Màu cho nhãn "Doanh thu trong 12 tháng"
          'rgba(255, 206, 86, 0.6)', // Màu cho dữ liệu trong 12 tháng
          'rgba(153, 102, 255, 0.6)',
          'rgba(52, 162, 235, 0.6)'
        ]
      }
    ]
  };
  const options1Total = {
    type: 'line',
    plugins: {
      title: {
        display: true,
        text: `Tổng tiền trong biểu đồ: ${totalMonth?.toLocaleString('it-IT', {
          style: 'currency',
          currency: 'VND'
        })}`,
        padding: {
          bottom: 10
        },
        font: {
          size: 18 // Chỉnh font-size tại đây
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = parseFloat(context.raw).toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND'
            }); // Làm tròn giá trị đến 2 chữ số thập phân
            return `Tiền: ${value}  VNĐ`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Thời gian (Tháng)'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'VNĐ (đ)'
        }
      }
    }
  };

  // =================================================================
  const chartDataTutor = {
    labels: tutorRanking?.map((item) => item.user_name),
    datasets: [
      {
        label: 'Biểu đồ doanh thu gia sư',
        data: tutorRanking?.map((item) => item.total_amount),
        backgroundColor: tutorRanking?.map(
          (_, index) => `rgba(${75 + index * 100}, 100, 192, 0.6)`
        ), // Màu khác nhau cho mỗi thanh
        borderColor: tutorRanking?.map(
          (_, index) => `rgba(${75 + index * 100}, 100, 192, 1)`
        ),
        borderWidth: 1
      }
    ]
  };
  // Tùy chọn cho biểu đồ
  const optionsTutor = {
    plugins: {
      title: {
        display: true,
        text: `Tổng tiền của tất cả gia sư: ${profitTutor?.toLocaleString(
          'it-IT',
          {
            style: 'currency',
            currency: 'VND'
          }
        )}`,
        padding: {
          bottom: 10
        },
        font: {
          size: 18 // Chỉnh font-size tại đây
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = parseFloat(context.raw).toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND'
            });
            return `Tiền: ${value} VNĐ`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Gia sư'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Số tiền (VNĐ)'
        }
      }
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  useEffect(() => {
    const handleGetAllCourse = async () => {
      api.get('/course').then((res) => {
        setLengthProduct(res?.data?.data.length);
      });
    };
    const handleGetAllAccount = async () => {
      api.get('/user').then((res) => {
        console.log('api.get ~ res:', res?.data?.data.count);
        setLengthAccount(res?.data?.data.count);
      });
    };
    const handleGetAllPayment = async () => {
      api.get('/payment').then((res) => {
        setLengthOrder(res?.data?.data.count);
      });
    };
    handleGetAllPayment();
    handleGetAllAccount();
    handleGetAllCourse();
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 5
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
        style={{
          paddingLeft: '30px',
          paddingRight: '30px'
        }}
      >
        <Space
          direction="horizontal"
          className="flex items-start gap-5"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <DashboardCard
            // icon={
            //   <ShoppingCartOutlined
            //     style={{
            //       color: 'green',
            //       backgroundColor: 'rgba(0,255,0,0.25)',
            //       borderRadius: 20,
            //       fontSize: 24,
            //       padding: 8
            //     }}
            //   />
            // }
            title={'Tổng số giao dịch thành công'}
            value={lengthOrder}
          />
          <DashboardCard
            // icon={
            //   <ShoppingOutlined
            //     style={{
            //       color: 'blue',
            //       backgroundColor: 'rgba(0,0,255,0.25)',
            //       borderRadius: 20,
            //       fontSize: 24,
            //       padding: 8
            //     }}
            //   />
            // }
            title={'Tổng số Khóa học'}
            value={lengthProduct}
          />
          <DashboardCard
            // icon={
            //   <UserOutlined
            //     style={{
            //       color: 'purple',
            //       backgroundColor: 'rgba(0,255,255,0.25)',
            //       borderRadius: 20,
            //       fontSize: 24,
            //       padding: 8
            //     }}
            //   />
            // }
            title={'Tổng số Người dùng'}
            value={lengthAccount}
          />
          <DashboardCard
            // icon={
            //   <UserOutlined
            //     style={{
            //       color: 'purple',
            //       backgroundColor: 'rgba(0,255,255,0.25)',
            //       borderRadius: 20,
            //       fontSize: 24,
            //       padding: 8
            //     }}
            //   />
            // }
            title={'Tổng thu nhập'}
            value={totalMoney.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND'
            })}
          />
          <DashboardCard
            // icon={
            //   <DollarCircleOutlined
            //     style={{
            //       color: 'red',
            //       backgroundColor: 'rgba(255,0,0,0.25)',
            //       borderRadius: 20,
            //       fontSize: 24,
            //       padding: 8
            //     }}
            //   />
            // }
            styled={{
              color: total < 0 ? 'red' : 'green'
            }}
            title={'Tổng thu nhập với tháng trước'}
            value={total + '%'}
          />
        </Space>

        {/* <div className="w-full">
          <span className="font text-[16px] p-3">Đơn hàng mới nhất</span>
          <TableOrder />
        </div> */}
        <Select
          labelId="select-label"
          id="select"
          value={selectedValue}
          onChange={handleChange}
          style={{
            width: '230px',
            height: '40px',
            marginTop: '10px'
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <Space
          style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* <DashboardChartDay /> */}

          {selectedValue === 'Tổng thu nhập theo tháng' && (
            <Card style={{ width: 850, height: 430 }}>
              <Line data={dataTotal} options={options1Total} />
            </Card>
          )}
          {selectedValue === 'Lợi nhuận theo tháng' && (
            <Card style={{ width: 850, height: 430 }}>
              <Bar data={data} options={options1} />
            </Card>
          )}
          {selectedValue === 'Lợi nhuận theo ngày' && <DashboardChart />}
          {selectedValue === 'Top 10 doanh thu gia sư' && (
            <Card style={{ width: 850, height: 430 }}>
              <Bar data={chartDataTutor} options={optionsTutor} />
            </Card>
          )}
        </Space>
      </Grid>
    </Container>
  );
}

function DashboardCard({ title, value, icon, styled }: any) {
  return (
    <Card
      style={
        {
          // width: '200px',
          // height: '150px'
        }
      }
    >
      <Space direction="horizontal">
        {icon}
        <Statistic valueStyle={styled} title={title} value={value} />
      </Space>
    </Card>
  );
}

interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  fill: boolean;
}

interface RevenueData {
  labels: string[];
  datasets: Dataset[];
}
function DashboardChart() {
  const [paymentData, setPaymentData] = useState<any>();
  const [totalDay, setTotalDay] = useState<any>(0);

  useEffect(() => {
    const handleGetAllPayment = async () => {
      api.get('/payment').then((res) => {
        setPaymentData(res?.data?.data?.rows);
      });
    };
    handleGetAllPayment();
  }, []);

  const [revenueData, setRevenueData] = useState<RevenueData>({
    labels: [],
    datasets: [
      {
        label: 'Daily Revenue',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        fill: false // Ensure the line chart is not filled
      }
    ]
  });
  const options = {
    plugins: {
      title: {
        display: true,
        text: `Tổng tiền trong biểu đồ: ${totalDay?.toLocaleString('it-IT', {
          style: 'currency',
          currency: 'VND'
        })}`,
        padding: {
          bottom: 10
        },
        font: {
          size: 18 // Chỉnh font-size tại đây
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = parseFloat(context.raw).toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND'
            }); // Làm tròn giá trị đến 2 chữ số thập phân
            return `Tiền: ${value}  VNĐ`;
          }
        }
      }
    }
  };

  useEffect(() => {
    if (paymentData) {
      const payments = paymentData;
      const currentDate = new Date(); // Get the current date
      currentDate.setHours(currentDate.getHours() + 7);

      // Get 7 days prior to the current date
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentDate);
        console.log('dates ~ date:', date);
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }).reverse(); // Reverse the array to ensure the dates are in ascending order

      const labels = dates.map((date) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}`;
      });

      const revenueByDay = dates.map((date) => {
        const filteredPayments = payments.filter((payment) => {
          const createdAt = payment.time.substring(0, 8); // Extract date from payment time
          return createdAt === date.replace(/-/g, ''); // Format as YYYYMMDD
        });

        const totalRevenue = filteredPayments.reduce(
          (sum, payment) => parseInt(sum) + parseInt(payment.amount) * 0.3,
          0
        ); // Sum only the totalMoney of filtered payments

        return totalRevenue;
      });
      const totalRevenue = revenueByDay.reduce(
        (acc, revenue) => acc + revenue,
        0
      );
      setTotalDay(totalRevenue);

      setRevenueData({
        labels: labels,
        datasets: [
          {
            label: 'Doanh thu trong 7 ngày gần nhất',
            data: revenueByDay,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            fill: false
          }
        ]
      });
    }
  }, [paymentData]);

  return (
    <Card style={{ width: 850, height: 430 }}>
      <Bar data={revenueData} options={options} />
    </Card>
  );
}

Revenue.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Revenue;
