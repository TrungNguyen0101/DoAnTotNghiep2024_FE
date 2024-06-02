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
  const options = ['Doanh thu theo tháng', 'Doanh thu theo ngày'];
  const [selectedValue, setSelectedValue] = useState(options[0]);

  const [paymentStatus, setPaymentData] = useState<any>();

  useEffect(() => {
    const handleGetAllPayment = async () => {
      api.get('/payment').then((res) => {
        setPaymentData(res?.data?.data?.rows);
      });
    };
    handleGetAllPayment();
  }, []);

  const [sortedMonths, setSortedMonths] = useState([]);
  const [total, setTotal] = useState<any>(0);

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
        label: 'Doanh thu trong 12 tháng',
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
            title={'Tổng số giao dịch'}
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
            title={'Doanh thu so với tháng trước'}
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
            width: '200px',
            height: '40px',
            marginTop: '20px'
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
          {selectedValue === 'Doanh thu theo tháng' ? (
            <Card style={{ width: 800, height: 400 }}>
              <Bar data={data} options={options1} />
            </Card>
          ) : (
            <DashboardChart />
          )}
        </Space>
      </Grid>
    </Container>
  );
}

function DashboardCard({ title, value, icon, styled }: any) {
  return (
    <Card
      style={{
        width: '270px',
        height: '100px'
      }}
    >
      <Space direction="horizontal">
        {icon}
        <Statistic valueStyle={styled} title={title} value={value} />
      </Space>
    </Card>
  );
}

function DashboardChartDay() {
  const [paymentData, setPaymentData] = useState<any>();

  useEffect(() => {
    const handleGetAllPayment = async () => {
      api.get('/payment').then((res) => {
        setPaymentData(res?.data?.data?.rows);
      });
    };
    handleGetAllPayment();
  }, []);

  const [revenueData, setRevenueData] = useState({
    labels: [
      'Ngày 1',
      'Ngày 2',
      'Ngày 3',
      'Ngày 4',
      'Ngày 5',
      'Ngày 6',
      'Ngày 7'
    ],
    datasets: [
      {
        label: 'Weekly Revenue',
        data: [0, 0, 0, 0, 0, 0, 0], // Initialize with zeros
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(105, 135, 196, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(144, 166, 211)'
        ],
        borderWidth: 1
      }
    ]
  });

  useEffect(() => {
    if (paymentData) {
      const payments = paymentData;

      // Get today's date and the dates for the past 6 days
      const today = new Date();
      const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }).reverse();

      const revenueByDay = days.map((day) => {
        const filteredPayments = payments.filter((payment) => {
          const createdAt = payment.time;
          const formattedDate = `${createdAt.substring(
            0,
            4
          )}-${createdAt.substring(4, 6)}-${createdAt.substring(6, 8)}`;
          return formattedDate === day;
        });

        const totalRevenue = filteredPayments.reduce(
          (sum, payment) => parseInt(sum) + parseInt(payment.amount),
          0
        ); // Sum only the totalMoney of filtered payments

        return totalRevenue;
      });

      setRevenueData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: revenueByDay
          }
        ]
      }));
    }
  }, [paymentData]);

  return (
    <Card style={{ width: 800, height: 400 }}>
      <Bar data={revenueData} />
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

  useEffect(() => {
    if (paymentData) {
      const payments = paymentData;
      const currentDate = new Date(); // Get the current date

      // Get 7 days prior to the current date
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentDate);
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
          (sum, payment) => parseInt(sum) + parseInt(payment.amount),
          0
        ); // Sum only the totalMoney of filtered payments

        return totalRevenue;
      });

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
    <Card style={{ width: 800, height: 400 }}>
      <Line data={revenueData} />
    </Card>
  );
}

function DashboardChart1() {
  const [paymentStatus, setPaymentData] = useState<any>();

  useEffect(() => {
    const handleGetAllPayment = async () => {
      api.get('/payment').then((res) => {
        setPaymentData(res?.data?.data?.rows);
      });
    };
    handleGetAllPayment();
  }, []);

  const [sortedMonths, setSortedMonths] = useState([]);
  const [total, setTotal] = useState<any>(0);

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
        label: 'Doanh thu trong 12 tháng',
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

  const options = {
    plugins: {
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

  return (
    <Card style={{ width: 800, height: 400 }}>
      <Bar data={data} options={options} />
    </Card>
  );
}

Revenue.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Revenue;
