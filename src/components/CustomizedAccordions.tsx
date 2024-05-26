import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Box, Button, Stack } from '@mui/material';
import CourseProgramFormAdd from './management/course/CourseProgramFormAdd';
import CourseProgramFormEdit from './management/course/CourseProgramFormEdit';
import api from '@/api';
import { enqueueSnackbar } from 'notistack';
import CoursePhaseFormAdd from './management/course/CoursePhaseFormAdd';
import CoursePhaseFormEdit from './management/course/CoursePhaseFormEdit';
import PhaseCourse from './management/course/PhaseCourse';
import IconButton from '@mui/material/IconButton';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  }
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

interface ICustomizedAccordionsProps {
  keyExpand: string;
  title: string;
  childTitle: any[];
  setDataSelected: any;
  setShowForm?: any;
  setShowConfirmDelete: any;
  data: any;
  add?: boolean;
  control?: any;
  setCount?: number;
  setOpenEdit?: any;
}

function CustomizedAccordions({
  keyExpand,
  title,
  childTitle,
  data,
  add,
  setCount
}: ICustomizedAccordionsProps) {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openPhase, setOpenPhase] = React.useState(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const handleDelete = async (setCount) => {
    const res = await api.delete(`/course-program/${data.course_program_id}`);
    if (res.status === 200) {
      enqueueSnackbar({
        message: 'Xóa bài thành công',
        variant: 'success'
      });
    }
    setCount((prev) => prev + 1);
  };

  return (
    <div>
      <Accordion
        expanded={expanded === keyExpand}
        onChange={handleChange(keyExpand)}
        sx={{
          borderRadius: '8px'
        }}
      >
        <AccordionSummary>
          <Stack direction="row" justifyContent="space-between" width="100%">
            <Typography pt={1.3} pl={1.5} variant="h4">
              {title}
            </Typography>
            {add && (
              <Box>
                <IconButton
                  aria-label="delete"
                  color="primary"
                  onClick={() => {
                    setOpenPhase(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
                    />
                  </svg>
                </IconButton>

                <IconButton
                  sx={{
                    minHeight: '100%'
                  }}
                  color="secondary"
                  onClick={() => {
                    setOpenEdit(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="m12.9 6.855l4.242 4.242l-9.9 9.9H3v-4.243zm1.414-1.415l2.121-2.121a1 1 0 0 1 1.414 0l2.829 2.828a1 1 0 0 1 0 1.415l-2.122 2.121z"
                    />
                  </svg>
                </IconButton>

                <IconButton
                  sx={{
                    minHeight: '100%'
                  }}
                  color="error"
                  onClick={() => handleDelete(setCount)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 256 256"
                  >
                    <path
                      fill="currentColor"
                      d="M216 48h-36V36a28 28 0 0 0-28-28h-48a28 28 0 0 0-28 28v12H40a12 12 0 0 0 0 24h4v136a20 20 0 0 0 20 20h128a20 20 0 0 0 20-20V72h4a12 12 0 0 0 0-24M100 36a4 4 0 0 1 4-4h48a4 4 0 0 1 4 4v12h-56Zm88 168H68V72h120Zm-72-100v64a12 12 0 0 1-24 0v-64a12 12 0 0 1 24 0m48 0v64a12 12 0 0 1-24 0v-64a12 12 0 0 1 24 0"
                    />
                  </svg>{' '}
                </IconButton>
              </Box>
            )}
          </Stack>
        </AccordionSummary>
        {childTitle?.reverse().map((child, index) => {
          return (
            <AccordionDetails key={index}>
              <PhaseCourse
                add={add}
                child={child}
                number={index + 1}
                setCount={setCount}
              />
            </AccordionDetails>
          );
        })}
      </Accordion>

      <CourseProgramFormEdit
        data={data}
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        setCount={setCount}
      />

      <CoursePhaseFormAdd
        data={data}
        isOpen={openPhase}
        onClose={() => setOpenPhase(false)}
        setCount={setCount}
      />
    </div>
  );
}

export default CustomizedAccordions;
