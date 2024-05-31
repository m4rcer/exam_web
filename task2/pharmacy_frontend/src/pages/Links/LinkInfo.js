import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Avatar,
  Container,
  Button,
  Card,
  CardContent,
  Divider,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Typography,
  Alert,
  TextField,
  TableFooter,
  TablePagination,
  CardActionArea,
  CardMedia
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { useGet } from '../../API/request';
import '../../styles/All.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { BallTriangle } from 'react-loader-spinner';

const LinkInfo = () => {
  const navigate = useNavigate();
  const getU = useGet();
  const { id } = useParams();

  const [isLoaded, setIsLoaded] = useState(true);

  const [data, setData] = useState({});

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

  useEffect(() => {
    setIsLoaded(true);
    getU(`links/${id}`)
      .then((resp) => {
        if (resp.status === 'success') {
          setData(resp.data.link);
        } else {
          showAlert('error', 'Произошла ошибка при попытке получить ссылку');
        }
      })
      .catch(() => {
        showAlert('error', 'Произошла ошибка при попытке получить ссылку');
      })
      .finally(() => {
        setIsLoaded(false);
      });
  }, [id]);

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
        <title>Ссылка</title>
      </Helmet>
      <Box className="headerWrapper">
        <Box className="headerTitle">
          <Button startIcon={<ChevronLeft />} onClick={() => navigate(-1)}>
            Назад
          </Button>
        </Box>
        <ul className="headerList">
          <li onClick={() => navigate(-1)}>Ссылки</li>
          <li>/</li>
          <li>Информация</li>
        </ul>
      </Box>

      <Box sx={{ backgroundColor: 'background.default', pt: 3, pb: 1 }}>
        <Container maxWidth={false}>
          <Alert
            severity={alert.type}
            style={{ display: alert.isVisible ? 'flex' : 'none' }}
          >
            {alert.txt}
          </Alert>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <PerfectScrollbar>
                <div className="info-block">
                  <div className="wrap">
                    <div className="label">ID:</div>
                    <div className="text">{data?.id || '---'}</div>
                  </div>

                  <div className="wrap">
                    <div className="label">Ссылка:</div>
                    <div className="text">
                      {(data?.linkToPublish && (
                        <a
                          href={data.linkToPublish}
                          target="_blank"
                        >
                          {data?.linkToPublish}
                        </a>
                      )) ||
                        '---'}
                    </div>
                  </div>

                  <div className="wrap">
                    <div className="label">Где размещено:</div>
                    <div className="text">
                      {(data?.linkWherePublished && (
                        <a
                          href={data.linkWherePublished}
                          target="_blank"
                        >
                          {data?.linkWherePublished}
                        </a>
                      )) ||
                        '---'}
                    </div>
                  </div>

                  <div className="wrap">
                    <div className="label">Фраза:</div>
                    <div
                      className="text"
                      style={{ maxWidth: 900, wordBreak: 'break-all' }}
                    >
                      {data?.phrase || '---'}
                    </div>
                  </div>

                  <div className="wrap">
                    <div className="label">Проект:</div>
                    <div className="text">
                      {(data?.project && (
                        <Link
                          to={`/app/project/info/${data.project.id}`}
                          target="_blank"
                        >
                          {data.project.name}
                        </Link>
                      )) ||
                        '---'}
                    </div>
                  </div>
                  <div className="wrap">
                    <div className="label">Пользователь:</div>
                    <div className="text">
                      {(data?.user && (
                        <Link
                          to={`/app/user/${data.user.id}`}
                          target="_blank"
                        >
                          {data.user.email}
                        </Link>
                      )) ||
                        '---'}
                    </div>
                  </div>

                  <div className="wrap">
                    <div className="label">На модерации:</div>
                    <div
                      className="text"
                      style={{ maxWidth: 900, wordBreak: 'break-all' }}
                    >
                      {data?.isModerationPassed ? "Нет" : "Да"}
                    </div>
                  </div>

                  <div className="wrap">
                    <div className="label">NoFollow:</div>
                    <div
                      className="text"
                      style={{ maxWidth: 900, wordBreak: 'break-all' }}
                    >
                      {data?.isNoFollow ? "Да" : "Нет"}
                    </div>
                  </div>

                  <div className="wrap">
                    <div className="label">Опубликовано 7 дней:</div>
                    <div
                      className="text"
                      style={{ maxWidth: 900, wordBreak: 'break-all' }}
                    >
                      {data?.is7DaysPublished ? "Да" : "Нет"}
                    </div>
                  </div>

                  <div className="wrap">
                    <div className="label">Опубликовано 30 дней:</div>
                    <div
                      className="text"
                      style={{ maxWidth: 900, wordBreak: 'break-all' }}
                    >
                      {data?.is30DaysPublished ? "Да" : "Нет"}
                    </div>
                  </div>

                  <div className="wrap">
                    <div className="label">Опубликовано:</div>
                    <div
                      className="text"
                      style={{ maxWidth: 900, wordBreak: 'break-all' }}
                    >
                      {data?.isPublished ? "Да" : "Нет"}
                    </div>
                  </div>

                  <div className="wrap">
                    <div className="label">Ручная проверка:</div>
                    <div
                      className="text"
                      style={{ maxWidth: 900, wordBreak: 'break-all' }}
                    >
                      {data?.isManual ? "Да" : "Нет"}
                    </div>
                  </div>

                  <div className="wrap">
                    <div className="label">Дата создания:</div>
                    <div className="text">
                      {(data?.creationDate &&
                        new Date(data.creationDate).toLocaleString()) ||
                        '---'}
                    </div>
                  </div>

                  <div className="wrap">
                    <Link to={`/app/links/edit/${data.id}`}>
                      <Button color="primary" variant="contained">
                        Редактировать
                      </Button>
                    </Link>
                  </div>
                </div>
              </PerfectScrollbar>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default LinkInfo;
