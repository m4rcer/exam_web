import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Avatar,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TableFooter,
  TablePagination,
  TextField,
  Divider,
  Input,
  Alert
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import UserListSkelet from '../../skeletons/UserListSkelet';
import { useDelete, useGet, usePost } from '../../API/request';
import { useConfirm } from '../../components/Confirm/index';
import { BallTriangle } from 'react-loader-spinner';
import '../../styles/All.css';
import TokenStorage from '../../API/TokenStorage';

const ProjectsList = () => {
  const confirm = useConfirm();
  const getU = useGet();
  const postU = usePost();
  const deleteU = useDelete();

  const [isLoaded, setIsLoaded] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);

  const [alert, setAlert] = useState({
    txt: '',
    isVisible: false,
    type: 'error'
  });

  const showAlert = (type, text) => {
    setAlert({
      txt: text,
      type,
      isVisible: true
    });

    setTimeout(() => {
      setAlert({
        txt: text,
        type,
        isVisible: false
      });
    }, 2500);
  };

  const loadProjects = () => {
    setIsDataLoading(true);
    setIsLoaded(true);

    let endpoint = `projects/?page=${page + 1}&limit=${limit}`;

    getU(endpoint)
      .then((resp) => {
        if (resp.status === 'success') {
          setProjects(resp.data.projects);
          setCount(resp.data.currentCount || 0);
        }
        setIsDataLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
        setProjects([]);
        setCount(0);
        setIsDataLoading(false);
      })
      .finally(() => {
        setIsLoaded(false);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeLimit = (event) => {
    setLimit(event.target.value);
    setPage(0);
  };

  const onDelete = (id) => {
    confirm({
      title: 'Удаление',
      content: 'Вы уверены, что хотите удалить проект?',
      onConfirm: () => {
        deleteU(`projects/${id}`)
          .then((resp) => {
            if (resp.status === 'success') {
              loadProjects();
            }
          })
          .catch((e) => {});
      }
    });
  };

  useEffect(() => {
    loadProjects();
  }, [page, limit]);

  if (isLoaded) {
    return (
      <div className="loader">
        <BallTriangle
          height="100"
          width="100"
          color="grey"
          ariaLabel="loading"
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Проекты</title>
      </Helmet>
      <Box className="headerWrapper">
        <Box className="headerTitle">Проекты</Box>
      </Box>
      <Box
        sx={{ backgroundColor: 'background.default', minHeight: '100%', py: 3 }}
      >
        <Container maxWidth={false}>
          <Alert
            severity={alert.type}
            style={{
              display: alert.isVisible ? 'flex' : 'none',
              marginBottom: 10
            }}
          >
            {alert.txt}
          </Alert>
          {isDataLoading ? (
            <UserListSkelet />
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {TokenStorage.getUser().role == 'admin' && (
                  <Box sx={{ marginLeft: 2 }}>
                    <Link to="/app/projects/add">
                      <Button color="primary" variant="contained">
                        Добавить проект
                      </Button>
                    </Link>
                  </Box>
                )}
              </Box>
              <Box sx={{ pt: 3 }}>
                <Card>
                  <PerfectScrollbar>
                    <Box sx={{ minWidth: 400 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ width: 120 }}>Id</TableCell>
                            <TableCell sx={{ width: 350 }}>Name</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {projects?.map((project) => (
                            <TableRow hover key={project.id}>
                              <TableCell sx={{ width: 80 }}>
                                {project?.id}
                              </TableCell>
                              <TableCell>{project?.name || '---'}</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex' }}>
                                  {TokenStorage.getUser().role == 'admin' && (
                                    <>
                                      <Box sx={{ ml: 2 }}>
                                        <Link
                                          to={`/app/projects/edit/${project.id}`}
                                        >
                                          <Button
                                            color="primary"
                                            variant="contained"
                                          >
                                            Редакт.
                                          </Button>
                                        </Link>
                                      </Box>
                                      <Box sx={{ ml: 2 }}>
                                        <Button
                                          color="error"
                                          variant="contained"
                                          onClick={() => onDelete(project.id)}
                                        >
                                          Удалить
                                        </Button>
                                      </Box>
                                    </>
                                  )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              labelRowsPerPage={
                                <span>Кол-во строк на странице:</span>
                              }
                              rowsPerPageOptions={[10, 20, 30, 40, 50]}
                              colSpan={7}
                              count={count}
                              rowsPerPage={limit}
                              page={page}
                              onPageChange={handleChangePage}
                              onRowsPerPageChange={handleChangeLimit}
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </Box>
                  </PerfectScrollbar>
                </Card>
              </Box>
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

export default ProjectsList;
