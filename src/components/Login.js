import React,{useState} from 'react'
import { Link, navigate } from 'gatsby'
import { setUser, isLoggedIn } from '../services/auth'
import { Auth } from 'aws-amplify'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import styled,{keyframes} from "styled-components"
import {Container} from "../components/Container"
import {colors} from "../tokens"
import LoaderButton from './LoadingButton'
import {AiFillEye, AiOutlineEyeInvisible,AiFillFacebook} from 'react-icons/ai'
import {FcGoogle} from "react-icons/fc"

const Login = () => {
    if (isLoggedIn()) navigate('/app/profile')
    return (
    <Wrapper >
        <Container>
    
            
            <Formik
                initialValues={{ username: '', password: '' }}
                validate={values => {
                    const errors = {}
                    if (!values.username) {
                        errors.username = 'Required'
                    } 
                    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.username)) {
                        errors.username = 'Invalid email address'
                    }
                    if (!values.password) {
                        errors.password = 'Required'
                    }
                    return errors
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    // setLoading(true)
                    try {
                        await Auth.signIn(values.username, values.password)
                        const user = await Auth.currentAuthenticatedUser()
                        const userInfo = {
                            ...user.attributes,
                            username: user.username,
                        }
                        // setLoading(false)
                        setUser(userInfo)
                        navigate('/app/profile')
                    }
                    catch (err) {
                        // setLoading(false)
                        console.log('error...: ', err)
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form >
                        <Title>Hello !</Title>
                        <p className="information">Vous devez vous connecter pour jouir pleinement de nos services</p>
                        <label
                            htmlFor="username"
                        >
                            <p className="usr-label">Email</p>
                            <div className="input-container">
                                <Field
                                    type="email"
                                    name="username"
                                />
                            </div>
                            
                            <ErrorMessage
                                name="username"
                                component="div"
                                className="err-msg"
                            />
                        </label>
                        <label
                            htmlFor="password"
                        >
                            <p className="pswd-label">Password</p>
                            <Field
                                type="password"
                                name="password"
                                component={PasswordShowHide}
                            />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className="err-msg"
                            />
                        </label>
                        <div className="f-pswd">
                            <Link to="/app/reset-password">
                                Mot de passe oublie
                            </Link>
                        </div>
                        <LoaderButton isLoading={isSubmitting}>
                            Login
                        </LoaderButton>
                        <div className="create-account">
                            Envie de nous rejoindre ? <Link to="/app/signup" className="">
                                Creer un compte
                            </Link>
                        </div>
                         <Providers />
                    </Form>
                )}
               
            </Formik>
            
    
    </Container>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    /* border: solid red; */
    form{
        /* border: solid blue; */
        box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1);
        margin: 0 auto;
        width: 100%;
        max-width: 414px;
        padding: 1.3rem;
        display: flex;
        flex-direction: column;
        position: relative;
        .create-account{
            font-size: 12px;
        }
        .input-container{
            height: 40px;
            padding: 0 0 0 10px;
                border: 1px solid ${colors.grey7};
                display: flex;
                align-items: center;
                .show-hide{
                    font-size: 1.3rem;
                    margin-right: 10px;
                }
                input{
                    border: 0;
                    width: 100%;//calc(100% - 10%);
                    height: 100%;
                    box-sizing: border-box;
                    padding: 0 10px;
                    position: relative;
                    /* background-color: ${colors.smoothYellow}; */
                    opacity: 1;
                }
        }
        
        .information{
            font-size: 12px;
            width: 70%;
        }
        a,.pswd-label,.usr-label{
            font-weight: bold;
            text-decoration: none;
            color: black;
        }
        .f-pswd{
            font-size: 12px;
        }
        label{
            display: block;
            position: relative;
            .err-msg{
                color: tomato;
            }
        }
        input{
            /* width: 100%;
            box-sizing: border-box;
            padding: 11px 13px;
            margin-bottom: 0.9rem;
            border-radius: 0;
            outline: 0;
            border: 1px solid ${colors.grey7};
            border-radius: 2px;
            font-size: 14px;
            transition: all 0.3s ease-out; */
            :focus{
                border: 0 ;//1px solid ${colors.yellow};
                box-shadow: none;//0 0 3px ${colors.yellow}, 0 1px 5px rgba(0, 0, 0, 0.1);
            }
        }
        button{
            img{
                margin-left: 15px;
            }
            max-width: 100%;
            padding: 11px 13px;
            color: rgb(0, 0, 0);
            font-weight: 600;
            text-transform: uppercase;
            background: ${colors.yellow};
            border: none;
            border-radius: 3px;
            outline: 0;
            cursor: pointer;
            margin-top: 0.6rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease-out;
            :hover {
                /* background: rgb(200, 50, 70); */
                animation: ${jump} 0.2s ease-out forwards;
            }
        }
    }
`


const jump = keyframes`
  from{
    transform: translateY(0)
  }
  to{
    transform: translateY(-3px)
  }
`;
export const Title = styled.h2`
  font-weight: normal;
  color: #2a2a29;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1);
  /* text-align: center; */
`;



const PasswordShowHide = ({ field, form }) => {
  const [showHidePassword, changeShowHidePassword] = useState(false);
  const hasError = form.touched[field.name] && form.errors[field.name];

  return (
    <div className="input-container">
        <input
        type={showHidePassword ? "text" : "password"}
        {...field}
        placeholder="Password"
        />
            {
                showHidePassword
                ?
                <AiFillEye style={{color:"black"}} className="show-hide" onClick={() => changeShowHidePassword(!showHidePassword)}/>
                :
                <AiOutlineEyeInvisible className="show-hide" onClick={() => changeShowHidePassword(!showHidePassword)}/>
            }
        
    </div>
  );
};

export const Providers = () => {
    return(
        <ProviderWrapper>
            <span className="ou">ou</span>
            <button className="google">
                <FcGoogle className="icon"/>
                Connexion Google
            </button>
            <button className="facebook">
                <AiFillFacebook className="icon"/>
                Connexion Facebook
            </button>
        </ProviderWrapper>
    )
}

const ProviderWrapper = styled.div`
    margin-top: 20px;
    padding-bottom: 20px;
    background-color: whitesmoke;
    border-radius: 3px;
    padding-top: 20px;
    position: relative;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-gap: 5px;
    .ou{
        position: absolute;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        /* left: 50%; */
        right: 45%;
        background-color: white;
        top: -12%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
    }
    button{
        position: relative;
        border: 0;
        color: white !important;
        &.google{
            border: 1px solid #e15300;
            background-color: white;
            color: #e15300 !important;
        }
        &.facebook{
            background-color: #424fbc;
        }
        .icon{
            position: absolute;
            left: 0;
            font-size: 2.5rem;
            top: -5%;
        }
    }
    
    
`
export default Login