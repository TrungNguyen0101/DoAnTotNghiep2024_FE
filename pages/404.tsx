import {
  Box,
  Card,
  Typography,
  Divider,
  Button,
  FormControl,
  OutlinedInput,
  InputAdornment,
  styled,
  Container
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import type { ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';

// const MainContent = styled(Box)(
//   () => `
//     height: 100%;
//     display: flex;
//     flex: 1;
//     flex-direction: column;
// `
// );

// const TopWrapper = styled(Box)(
//   ({ theme }) => `
//   display: flex;
//   width: 100%;
//   flex: 1;
//   align-items: center;
//   justify-content: center;
//   padding: ${theme.spacing(6)};
// `
// );

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
`
);

const ButtonSearch = styled(Button)(
  ({ theme }) => `
    margin-right: -${theme.spacing(1)};
`
);

function Status404() {
  return (
    <>
      <title>Status - 404</title>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flex: 1,
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px'
          }}
        >
          <Container maxWidth="md">
            <Box textAlign="center">
              <img alt="404" height={180} src="/static/images/status/404.svg" />
              <Typography variant="h2" sx={{ my: 2 }}>
                The page you were looking for doesn't exist.
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 4 }}
              >
                It's on us, we moved the content to a different page. The search
                below should help!
              </Typography>
            </Box>
            <Container maxWidth="sm">
              <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
                <FormControl variant="outlined" fullWidth>
                  <OutlinedInputWrapper
                    type="text"
                    placeholder="Search terms here..."
                    endAdornment={
                      <InputAdornment position="end">
                        <ButtonSearch variant="contained" size="small">
                          Search
                        </ButtonSearch>
                      </InputAdornment>
                    }
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchTwoToneIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Divider sx={{ my: 4 }}>OR</Divider>
                <Button href="/" variant="outlined">
                  Go to homepage
                </Button>
              </Card>
            </Container>
          </Container>
        </div>
      </div>
    </>
  );
}

export default Status404;

Status404.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
