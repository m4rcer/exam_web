import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Button,
  Card,
  CardHeader,
  Divider,
  CardContent,
  CircularProgress,
  TextField,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { useParams, useNavigate } from 'react-router-dom';
import { useGet, usePut } from '../../API/request';
import { BallTriangle } from 'react-loader-spinner';
import '../../styles/Avatar/style.css';
import TokenStorage from '../../API/TokenStorage';

const LinkEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const getU = useGet();
  const putU = usePut();

  const [isLoaded, setIsLoaded] = useState(true);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [nothingChanged, setNothingChanged] = useState(true);

  const [values, setValues] = useState({
    linkToPublish: '',
    linkWherePublished: '',
    phrase: '',
    projectId: '',
    isModerationPassed: false,
    isManual: false,
    isPublished: false,
    isNoFollow: false
  });
  const [errors, setErrors] = useState({
    name: false,
    linkWherePublished: false,
    phrase: false,
    projectId: false,
    isModerationPassed: false,
    isManual: false,
    isPublished: false,
    isNoFollow: false
  });

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState({});

  const [alert, setAlert] = useState({
    txt: '',
    isVisible: false,
    type: 'error'
  });

  const handleChange = (event) => {
    setNothingChanged(false);

    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
    setErrors({
      ...errors,
      [event.target.name]: false
    });
  };

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

      setSubmitDisabled(false);
    }, 2500);
  };

  const validateInfo = () => {
    let validComplete = true;
    let formErrors = { ...errors };

    if (values.linkToPublish === '') {
      validComplete = false;
      formErrors.linkToPublish = false;
      showAlert('error', 'Поле "Ссылка" не должно быть пустым');
    }
    if (values.linkWherePublished === '') {
      validComplete = false;
      formErrors.linkWherePublished = false;
      showAlert('error', 'Поле "Где размещено" не должно быть пустым');
    }
    if (values.phrase === '') {
      validComplete = false;
      formErrors.phrase = false;
      showAlert('error', 'Поле "Фраза" не должно быть пустым');
    }

    setErrors(formErrors);
    return validComplete;
  };

  const submitInfo = async () => {
    if (nothingChanged) {
      showAlert('error', 'Нет изменений');
      return;
    }

    if (validateInfo()) {
      setSubmitDisabled(true);

      const data = {
        ...values,
        projectId: selectedProjectId
      };

      if (!data.isManual) {
        delete data['isPublished'];
        delete data['isNoFollow'];
      }

      putU(`links/${id}`, data)
        .then((resp) => {
          if (resp.status === 'success') {
            showAlert('success', 'Данные успешно обновлены');
          } else {
            showAlert('error', 'Ошибка');
          }
        })
        .catch((err) => {
          showAlert('error', err.response.data.message);
        })
        .finally(() => {
          setSubmitDisabled(false);
        });
    }
  };

  const getProjects = () => {
    setIsLoaded(true);
    getU(`projects?limit=all`)
      .then((resp) => {
        if (resp.status === 'success') {
          setProjects(resp.data.projects);

          resp.data.projects[0] &&
            setSelectedProjectId(resp.data.projects[0].id);
        } else {
          showAlert('error', 'Произошла ошибка при загрузке проектов');
        }
      })
      .catch(() => {
        showAlert('error', 'Произошла ошибка при загрузке проектов');
      })
      .finally(() => {
        setIsLoaded(false);
      });
  };

  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    console.log(id);

    setIsLoaded(true);
    getU(`links/${id}`)
      .then((resp) => {
        if (resp.status === 'success') {
          const data = {
            linkToPublish: resp.data.link.linkToPublish,
            linkWherePublished: resp.data.link.linkWherePublished,
            phrase: resp.data.link.phrase,
            projectId: resp.data.link.projectId,
            isModerationPassed: resp.data.link.isModerationPassed,
            isManual: resp.data.link.isManual,
            isPublished: resp.data.link.isPublished,
            isNoFollow: resp.data.link.isNoFollow
          };

          setValues(data);
        }
      })
      .catch(() => {
        showAlert(
          'error',
          'Произошла ошибка при загрузке сслыки, пожалуйста, попробуйте позже'
        );
      })
      .finally(() => {
        setIsLoaded(false);
      });
  }, []);

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
        <title>Редактирование ссылки</title>
      </Helmet>
      <Box className="headerWrapper">
        <Box className="headerTitle">
          <Button startIcon={<ChevronLeft />} onClick={() => navigate(-1)}>
            Назад
          </Button>
          Ссылки
        </Box>
        <ul className="headerList">
          <li onClick={() => navigate(-1)}>Ссылки</li>
          <li>/</li>
          <li>Редактирование</li>
        </ul>
      </Box>

      <Box sx={{ backgroundColor: 'background.default', pt: 3 }}>
        <Container maxWidth={false}>
          <Box>
            <form>
              <Card>
                <CardHeader title="Редактирование ссылки" />
                <Divider />
                <CardContent sx={{ position: 'relative' }}>
                  <TextField
                    fullWidth
                    label="Ссылка"
                    margin="normal"
                    name="linkToPublish"
                    onChange={handleChange}
                    type="text"
                    value={values.linkToPublish}
                    variant="outlined"
                    error={errors.linkToPublish}
                  />
                  <TextField
                    fullWidth
                    label="Где размещено"
                    margin="normal"
                    name="linkWherePublished"
                    onChange={handleChange}
                    type="text"
                    value={values.linkWherePublished}
                    variant="outlined"
                    error={errors.linkWherePublished}
                  />
                  <TextField
                    fullWidth
                    label="Фраза"
                    margin="normal"
                    name="phrase"
                    onChange={handleChange}
                    type="text"
                    value={values.phrase}
                    variant="outlined"
                    error={errors.phrase}
                  />
                  <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
                    <InputLabel id="isModerationPassed">
                      На модерации?
                    </InputLabel>
                    <Select
                      labelId="isModerationPassed"
                      name="isModerationPassed"
                      value={values.isModerationPassed}
                      label="На модерации?"
                      onChange={handleChange}
                    >
                      <MenuItem value={false}>Да</MenuItem>
                      <MenuItem value={true}>Нет</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
                    <InputLabel id="projectId">Проект</InputLabel>
                    <Select
                      labelId="projectId"
                      name="projectId"
                      value={selectedProjectId}
                      label="Проект"
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                    >
                      {projects.map((project) => (
                        <MenuItem value={project.id}>{project.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {TokenStorage.getUser().role == 'admin' && (
                    <>
                      <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
                        <InputLabel id="isManual">Ручная проверка?</InputLabel>
                        <Select
                          labelId="isManual"
                          name="isManual"
                          value={values.isManual}
                          label="Ручная проверка?"
                          onChange={handleChange}
                        >
                          <MenuItem value={true}>Да</MenuItem>
                          <MenuItem value={false}>Нет</MenuItem>
                        </Select>
                      </FormControl>

                      {values.isManual && (
                        <>
                          <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
                            <InputLabel id="isPublished">
                              Опубликовано?
                            </InputLabel>
                            <Select
                              labelId="isPublished"
                              name="isPublished"
                              value={values.isPublished}
                              label="Опубликовано?"
                              onChange={handleChange}
                            >
                              <MenuItem value={true}>Да</MenuItem>
                              <MenuItem value={false}>Нет</MenuItem>
                            </Select>
                          </FormControl>
                          <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
                            <InputLabel id="isNoFollow">NoFollow?</InputLabel>
                            <Select
                              labelId="isNoFollow"
                              name="isNoFollow"
                              value={values.isNoFollow}
                              label="NoFollow?"
                              onChange={handleChange}
                            >
                              <MenuItem value={true}>Да</MenuItem>
                              <MenuItem value={false}>Нет</MenuItem>
                            </Select>
                          </FormControl>
                        </>
                      )}
                    </>
                  )}
                </CardContent>
                <Divider />
                <Alert
                  severity={alert.type}
                  style={{ display: alert.isVisible ? 'flex' : 'none' }}
                >
                  {alert.txt}
                </Alert>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={submitInfo}
                    disabled={submitDisabled}
                  >
                    Сохранить
                  </Button>
                </Box>
              </Card>
            </form>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LinkEdit;
