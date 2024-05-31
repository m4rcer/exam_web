import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import UserListSkelet from '../../skeletons/UserListSkelet';
import { useDelete, useGet, usePost } from '../../API/request';
import { useConfirm } from '../../components/Confirm/index';
import { BallTriangle } from 'react-loader-spinner';
import '../../styles/All.css';
import { ChevronLeft } from 'react-feather';

const DeletedLinksList = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const getU = useGet();
  const postU = usePost();
  const deleteU = useDelete();

  const [isLoaded, setIsLoaded] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams({
    isPublished: 'Да'
  });
  const [queryParams, setQueryParams] = useState({
    isModerationPassed: searchParams.get('isModerationPassed') || '',
    projectId: searchParams.get('projectId') || '',
    userId: searchParams.get('userId') || '',
    isPublished: searchParams.get('isPublished') || 'Да',
    isNoFollow: searchParams.get('isNoFollow') || '',
    linkWherePublished: searchParams.get('linkWherePublished') || '',
    page: searchParams.get('page') || 0,
    limit: searchParams.get('limit') || 10
  });

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

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

  const loadLinks = () => {
    setIsDataLoading(true);
    setIsLoaded(true);

    let endpoint = `links/?page=${
      Number(searchParams.get('page')) + 1
    }&limit=${Number(
      searchParams.get('limit')
    )}&isModerationPassed=1&isPublished=0&sort=lastUnPublishDate`;

    if (queryParams.projectId && searchParams.get('projectId') !== null) {
      endpoint += `&projectId=${searchParams.get('projectId')}`;
    } else {
      setQueryParams({
        ...queryParams,
        projectId: ''
      });
    }

    if (queryParams.userId && searchParams.get('userId') !== null) {
      endpoint += `&userId=${searchParams.get('userId')}`;
    } else {
      setQueryParams({
        ...queryParams,
        userId: ''
      });
    }

    if (queryParams.isNoFollow && searchParams.get('isNoFollow') !== null) {
      endpoint += `&isNoFollow=${
        searchParams.get('isNoFollow') == 'Да' ? 1 : 0
      }`;
    } else {
      setQueryParams({
        ...queryParams,
        isNoFollow: ''
      });
    }

    if (
      queryParams.linkWherePublished &&
      searchParams.get('linkWherePublished') !== null
    ) {
      endpoint += `&linkWherePublished=${
        searchParams.get('linkWherePublished')
      }`;
    } else {
      setQueryParams({
        ...queryParams,
        linkWherePublished: ''
      });
    }

    getU(endpoint)
      .then((resp) => {
        if (resp.status === 'success') {
          setLinks(resp.data.links);
          setCount(resp.data.currentCount || 0);
        }
        setIsDataLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
        setLinks([]);
        setCount(0);
        setIsDataLoading(false);
      })
      .finally(() => {
        setIsLoaded(false);
      });
  };

  const loadProjects = () => {
    setIsDataLoading(true);
    setIsLoaded(true);

    let endpoint = `projects?limit=all`;

    getU(endpoint)
      .then((resp) => {
        if (resp.status === 'success') {
          setProjects(resp.data.projects);
        }
        setIsDataLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
        setProjects([]);
        setIsDataLoading(false);
      })
      .finally(() => {
        setIsLoaded(false);
      });
  };

  const loadUsers = () => {
    setIsDataLoading(true);
    setIsLoaded(true);

    let endpoint = `admin/users?limit=all`;

    getU(endpoint)
      .then((resp) => {
        if (resp.status === 'success') {
          setUsers(resp.data.users);
        }
        setIsDataLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
        setUsers([]);
        setIsDataLoading(false);
      })
      .finally(() => {
        setIsLoaded(false);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (queryParams.projectId !== '') {
      setSearchParams({
        projectId: queryParams.projectId,
        page: newPage,
        limit:
          Number(searchParams.get('limit')) === 0
            ? 10
            : Number(searchParams.get('limit'))
      });
    } else if (queryParams.userId !== '') {
      setSearchParams({
        userId: queryParams.userId,
        page: newPage,
        limit:
          Number(searchParams.get('limit')) === 0
            ? 10
            : Number(searchParams.get('limit'))
      });
    } else if (queryParams.isModerationPassed !== '') {
      setSearchParams({
        isModerationPassed: queryParams.isModerationPassed,
        page: newPage,
        limit:
          Number(searchParams.get('limit')) === 0
            ? 10
            : Number(searchParams.get('limit'))
      });
    } else if (queryParams.isPublished !== '') {
      setSearchParams({
        isPublished: queryParams.isPublished,
        page: newPage,
        limit:
          Number(searchParams.get('limit')) === 0
            ? 10
            : Number(searchParams.get('limit'))
      });
    } else if (queryParams.isNoFollow !== '') {
      setSearchParams({
        isNoFollow: queryParams.isNoFollow,
        page: newPage,
        limit:
          Number(searchParams.get('limit')) === 0
            ? 10
            : Number(searchParams.get('limit'))
      });
    } else if (queryParams.linkWherePublished !== '') {
      setSearchParams({
        linkWherePublished: queryParams.linkWherePublished,
        page: newPage,
        limit:
          Number(searchParams.get('limit')) === 0
            ? 10
            : Number(searchParams.get('limit'))
      });
    } else {
      setSearchParams({
        page: newPage,
        limit:
          Number(searchParams.get('limit')) === 0
            ? 10
            : Number(searchParams.get('limit'))
      });
    }
  };

  const handleChangeLimit = (event) => {
    setLimit(event.target.value);
    setPage(0);
    if (queryParams.projectId !== '') {
      setSearchParams({
        projectId: queryParams.projectId,
        page: 0,
        limit: event.target.value
      });
    } else if (queryParams.userId !== '') {
      setSearchParams({
        userId: queryParams.userId,
        page: 0,
        limit: event.target.value
      });
    } else if (queryParams.isModerationPassed !== '') {
      setSearchParams({
        isModerationPassed: queryParams.isModerationPassed,
        page: 0,
        limit: event.target.value
      });
    } else if (queryParams.isPublished !== '') {
      setSearchParams({
        isPublished: queryParams.isPublished,
        page: 0,
        limit: event.target.value
      });
    } else if (queryParams.isNoFollow !== '') {
      setSearchParams({
        isNoFollow: queryParams.isNoFollow,
        page: 0,
        limit: event.target.value
      });
    } else if (queryParams.linkWherePublished !== '') {
      setSearchParams({
        linkWherePublished: queryParams.linkWherePublished,
        page: 0,
        limit: event.target.value
      });
    } else {
      setSearchParams({
        page: 0,
        limit: event.target.value
      });
    }
  };

  const handleChangeQueryParams = (event) => {
    setQueryParams({
      ...queryParams,
      [event.target.name]: event.target.value
    });
  };

  const handleFilterQueryParams = () => {
    const params = {};
    if (queryParams.isModerationPassed !== '') {
      params.isModerationPassed = queryParams.isModerationPassed;
    }
    if (queryParams.projectId !== '') {
      params.projectId = queryParams.projectId;
    }
    if (queryParams.userId !== '') {
      params.userId = queryParams.userId;
    }
    if (queryParams.isPublished !== '') {
      params.isPublished = queryParams.isPublished;
    }
    if (queryParams.isNoFollow !== '') {
      params.isNoFollow = queryParams.isNoFollow;
    }
    if (queryParams.linkWherePublished !== '') {
      params.linkWherePublished = queryParams.linkWherePublished;
    }

    if (Object.keys(params).length !== 0) {
      // setSearchParams(params);
      setSearchParams({
        ...params,
        page: 0,
        limit: 10
      });
      setPage(0);
      setLimit(10);
    }
  };

  const onDelete = (id) => {
    confirm({
      title: 'Удаление',
      content: 'Вы уверены, что хотите удалить ссылку?',
      onConfirm: () => {
        deleteU(`links/${id}`)
          .then((resp) => {
            if (resp.status === 'success') {
              loadLinks();
            }
          })
          .catch((e) => {});
      }
    });
  };

  useEffect(() => {
    loadLinks();
  }, [searchParams]);

  useEffect(() => {
    loadProjects();
    loadUsers();
  }, []);

  useEffect(() => {
    if (queryParams.projectId === '') {
      searchParams.delete('projectId');
      setSearchParams(searchParams);
    }
    if (queryParams.userId === '') {
      searchParams.delete('userId');
      setSearchParams(searchParams);
    }
    if (queryParams.isModerationPassed === '') {
      searchParams.delete('isModerationPassed');
      setSearchParams(searchParams);
    }
    if (queryParams.isPublished === '') {
      searchParams.delete('isPublished');
      setSearchParams(searchParams);
    }
    if (queryParams.isNoFollow === '') {
      searchParams.delete('isNoFollow');
      setSearchParams(searchParams);
    }
    if (queryParams.linkWherePublished === '') {
      searchParams.delete('linkWherePublished');
      setSearchParams(searchParams);
    }
  }, [queryParams]);

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
        <title>Ссылки</title>
      </Helmet>
      <Box
        className="headerWrapper"
        sx={{
          display: 'flex'
        }}
      >
        <Box
          sx={{
            display: 'flex'
          }}
        >
          
          <Box className="headerTitle">Неопубликованные ссылки</Box>
        </Box>
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
              <Box sx={{ pt: 3 }}>
                <Card>
                  <PerfectScrollbar>
                    <Box sx={{ minWidth: 1600 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mx: 2,
                          mb: 1,
                          width: '100%'
                        }}
                      >
                        <TextField
                          sx={{ mt: 2, mb: 1 }}
                          style={{ marginRight: 10 }}
                          fullWidth
                          label="Где размещено"
                          margin="normal"
                          name="linkWherePublished"
                          onChange={handleChangeQueryParams}
                          type="text"
                          value={queryParams.linkWherePublished}
                          variant="outlined"
                        />
                        <FormControl
                          fullWidth
                          sx={{ mt: 2, mb: 1 }}
                          style={{ marginRight: 10 }}
                        >
                          <InputLabel id="projectId">Проект</InputLabel>
                          <Select
                            labelId="projectId"
                            name="projectId"
                            value={queryParams.projectId}
                            label="Проект"
                            onChange={handleChangeQueryParams}
                          >
                            {[
                              <MenuItem value={''}>Все</MenuItem>,
                              ...projects.map((project) => {
                                return (
                                  <MenuItem value={project.id}>
                                    {project.name}
                                  </MenuItem>
                                );
                              })
                            ]}
                          </Select>
                        </FormControl>
                        <FormControl
                          fullWidth
                          sx={{ mt: 2, mb: 1 }}
                          style={{ marginRight: 10 }}
                        >
                          <InputLabel id="userId">Пользователь</InputLabel>
                          <Select
                            labelId="userId"
                            name="userId"
                            value={queryParams.userId}
                            label="Пользователь"
                            onChange={handleChangeQueryParams}
                          >
                            {[
                              <MenuItem value={''}>Все</MenuItem>,
                              ...users.map((user) => {
                                return (
                                  <MenuItem value={user.id}>
                                    {user.email}
                                  </MenuItem>
                                );
                              })
                            ]}
                          </Select>
                        </FormControl>
                        <FormControl
                          fullWidth
                          sx={{ mt: 2, mb: 1 }}
                          style={{ marginRight: 10 }}
                        >
                          <InputLabel id="isNoFollow">NoFollow</InputLabel>
                          <Select
                            labelId="isNoFollow"
                            name="isNoFollow"
                            value={queryParams.isNoFollow}
                            label="NoFollow"
                            onChange={handleChangeQueryParams}
                          >
                            <MenuItem value={''}>Все</MenuItem>,
                            <MenuItem value={'Да'}>Есть</MenuItem>
                            <MenuItem value={'Нет'}>Нет</MenuItem>
                          </Select>
                        </FormControl>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={handleFilterQueryParams}
                          sx={{ mt: 2, mb: 1 }}
                          style={{ minWidth: 120 }}
                        >
                          Применить
                        </Button>
                      </Box>
                      <Divider />
                      <Table>
                        <TableHead sx={{ width: '100%' }}>
                          <TableRow>
                            <TableCell sx={{ width: 120 }}>Id</TableCell>
                            <TableCell sx={{ width: 350 }}>Ссылка</TableCell>
                            <TableCell sx={{ width: 350 }}>
                              Где размещено
                            </TableCell>
                            <TableCell sx={{ width: 350 }}>
                              На модерации?
                            </TableCell>
                            <TableCell sx={{ width: 350 }}>7 дней</TableCell>
                            <TableCell sx={{ width: 350 }}>30 дней</TableCell>
                            <TableCell sx={{ width: 350 }}>Проект</TableCell>
                            <TableCell sx={{ width: 350 }}>
                              Пользователь
                            </TableCell>
                            <TableCell sx={{ width: 350 }}>
                              Опубликовано
                            </TableCell>
                            <TableCell sx={{ width: 350 }}>NoFollow</TableCell>
                            <TableCell sx={{ width: 350 }}>Ручная проверка</TableCell>
                            <TableCell sx={{ width: 350 }}>
                              Снято с публикации
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {links?.map((link) => (
                            <TableRow hover key={link.id}>
                              <TableCell sx={{ width: 80 }}>
                                {link?.id}
                              </TableCell>
                              <TableCell>
                                {(link?.linkToPublish && (
                                  <a
                                    href={link.linkToPublish}
                                    target="_blank"
                                    style={
                                      link.isPublished
                                        ? link.is7DaysPublished
                                          ? {
                                              fontWeight: 'bold',
                                              color: 'green'
                                            }
                                          : {}
                                        : {
                                            fontWeight: 'bold',
                                            color: 'red'
                                          }
                                    }
                                  >
                                    {link.linkToPublish}
                                  </a>
                                )) ||
                                  '---'}
                              </TableCell>
                              <TableCell>
                                {(link?.linkWherePublished && (
                                  <a
                                    href={link.linkWherePublished}
                                    target="_blank"
                                  >
                                    {link.linkWherePublished}
                                  </a>
                                )) ||
                                  '---'}
                              </TableCell>
                              <TableCell sx={{ minWidth: 140 }}>
                                {link?.isModerationPassed ? 'Нет' : 'Да'}
                              </TableCell>
                              <TableCell sx={{ minWidth: 90 }}>
                                {link?.is7DaysPublished ? 'Да' : 'Нет'}
                              </TableCell>
                              <TableCell sx={{ minWidth: 90 }}>
                                {link?.is30DaysPublished ? 'Да' : 'Нет'}
                              </TableCell>
                              <TableCell>
                                {(link?.project && (
                                  <Link
                                    to={`/app/projects/${link.project.id}`}
                                    target="_blank"
                                  >
                                    {link?.project.name}
                                  </Link>
                                )) ||
                                  '---'}
                              </TableCell>
                              <TableCell>
                                {(link?.user && (
                                  <Link
                                    to={`/app/user/${link.user.id}`}
                                    target="_blank"
                                  >
                                    {link?.user.email}
                                  </Link>
                                )) ||
                                  '---'}
                              </TableCell>
                              <TableCell>
                                {link.isPublished ? 'Да' : 'Нет'}
                              </TableCell>
                              <TableCell>
                                {link.isNoFollow ? 'Да' : 'Нет'}
                              </TableCell>
                              <TableCell>
                                {link.isManual ? 'Да' : 'Нет'}
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  link?.lastUnPublishDate
                                ).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex' }}>
                                  <Box sx={{ ml: 2 }}>
                                    <Link to={`/app/links/${link.id}`}>
                                      <Button
                                        color="primary"
                                        variant="contained"
                                      >
                                        Инфо.
                                      </Button>
                                    </Link>
                                  </Box>
                                  <Box sx={{ ml: 2 }}>
                                    <Link to={`/app/links/edit/${link.id}`}>
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
                                      onClick={() => onDelete(link.id)}
                                    >
                                      Удалить
                                    </Button>
                                  </Box>
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
                              page={Number(searchParams.get('page'))}
                              rowsPerPage={
                                Number(searchParams.get('limit')) === 0
                                  ? 10
                                  : Number(searchParams.get('limit'))
                              }
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

export default DeletedLinksList;
