import {Helmet} from 'react-helmet';
import {
    Box,
    Container,
    Button, TextField, CardContent
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {useNavigate} from 'react-router-dom';
import {useGet, usePost, usePut} from "../../API/request";
import React, {useEffect, useState} from "react";
import {BallTriangle} from "react-loader-spinner";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Alert from "@material-ui/core/Alert";

const UserAdd = () => {

    const navigate = useNavigate();
    const postU = usePost();
    const getU = useGet();
    const putU = usePut();

    const [isLoaded, setIsLoaded] = useState(true);

    const [isValidateEmail, setIsValidateEmail] = useState(true);
    const [values, setValues] = useState({
        name: '',
        phone: '',
        age: '',
    });
    const [errors, setErrors] = useState({
        name: false,
        phone: false,
        age: false,
    });
    const [roles, setRoles] = useState([])

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


    const handleChangeEmail = (event) => {
        const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        setIsValidateEmail(!!event.target.value.match(reg));
        setValues({
            ...values,
            email: event.target.value
        });
    };

    const validate = () => {
        let validComplete = true;
        let formErrors = {...errors};

        setErrors(formErrors);
        return validComplete;
    };



    const clearForm = () => {
        setValues({
            name: '',
            phone: '',
            age: '',
        });
    };

    const submit = async () => {
        if (validate()) {
            setIsShowLoader(true);
            setSubmitDisabled(true);

            const data = {
                name: values.name,
                phone: values.phone,
                age: Number.parseInt(values.age),
            };

            postU('customers', data)
                .then((resp) => {
                        showAlert('success', 'Customer added');
                        clearForm();
                })
                .catch((err) => {
                    showAlert('error', 'Ошибка сервера');
                    setIsShowLoader(false);
                    setSubmitDisabled(false);
                })
                .finally(()=>{

                });
        }
    };

   
    return (
        <>
            <Helmet>
                <title>Create new customer</title>
            </Helmet>
            <Box sx={{pt: 2}}>
                <Container maxWidth={false}>
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </Container>
            </Box>
            <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
                <Container maxWidth={false}>
                    <Box sx={{pt: 2}}>
                        <form>
                            <Card>
                                <CardHeader
                                    title="Добавление нового клиента"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        margin="normal"
                                        name="name"
                                        onChange={handleChange}
                                        type="text"
                                        value={values.name}
                                        variant="outlined"
                                        error={errors.name}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        margin="normal"
                                        name="phone"
                                        onChange={handleChange}
                                        type="text"
                                        value={values.phone}
                                        variant="outlined"
                                        error={errors.phone}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Age"
                                        margin="normal"
                                        name="age"
                                        onChange={handleChange}
                                        type="age"
                                        value={values.age}
                                        variant="outlined"
                                        error={errors.age}
                                    />

                                    <Alert severity={alert.type}
                                           style={{display: alert.isVisible ? 'flex' : 'none'}}>
                                        {alert.txt}
                                    </Alert>
                                </CardContent>
                                <Divider/>
                                <Box sx={{display: 'flex', justifyContent: 'flex-end', p: 2}}>
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

export default UserAdd;
