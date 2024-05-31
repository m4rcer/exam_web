import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Button,
  TextField,
  CardContent
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { useNavigate } from 'react-router-dom';
import { useGet, usePost, usePut } from '../../API/request';
import React, { useEffect, useState } from 'react';
import { BallTriangle } from 'react-loader-spinner';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Alert from '@material-ui/core/Alert';
import TokenStorage from '../../API/TokenStorage';

const LinkAdd = () => {
  const navigate = useNavigate();
  const postU = usePost();
  const getU = useGet();

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

  const [isLoaded, setIsLoaded] = useState(true);
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const [alert, setAlert] = useState({
    txt: '',
    isVisible: false,
    type: 'error'
  });

  const handleChange = (event) => {
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
    }, 1400);
  };

  const validate = () => {
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

  const clearForm = () => {
    setValues({
      linkToPublish: '',
      linkWherePublished: '',
      phrase: ''
    });
  };

  const submit = async () => {
    if (validate()) {
      setIsShowLoader(true);
      setSubmitDisabled(true);

      const data = {
        ...values,
        projectId: selectedProjectId
      };

      if (!data.isManual) {
        delete data['isPublished'];
        delete data['isNoFollow'];
      }

      postU('links', data)
        .then((resp) => {
          if (resp.status === 'success') {
            showAlert('success', 'Ссылка добавлена');
            clearForm();
          } else {
            showAlert('error', 'Ошибка');
          }
        })
        .catch((err) => {
          showAlert('error', err.response.data.message);
          setIsShowLoader(false);
          setSubmitDisabled(false);
        })
        .finally(() => {});
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
        <title>Создание сслыки</title>
      </Helmet>
      <Box sx={{ pt: 2 }}>
        <Container maxWidth={false}>
          <Button startIcon={<ChevronLeft />} onClick={() => navigate(-1)}>
            Back
          </Button>
        </Container>
      </Box>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100%' }}>
        <Container maxWidth={false}>
          <Box sx={{ pt: 2 }}>
            <form>
              <Card>
                <CardHeader title="Добавление новой ссылки" />
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
                  )}

                  {values.isManual && (
                    <>
                      <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
                        <InputLabel id="isPublished">Опубликовано?</InputLabel>
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
                  <Alert
                    severity={alert.type}
                    style={{ display: alert.isVisible ? 'flex' : 'none' }}
                  >
                    {alert.txt}
                  </Alert>
                </CardContent>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={submit}
                    disabled={submitDisabled}
                  >
                    Добавить
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

export default LinkAdd;
