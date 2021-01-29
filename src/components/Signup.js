import React, { useState } from 'react'
import { navigate } from 'gatsby'
import { Auth } from 'aws-amplify'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { isLoggedIn } from '../services/auth'
import {Container} from "../components/Container"
import {Providers, Title} from './Login'
import {colors} from "../tokens"
import styled,{keyframes} from "styled-components"
import LoaderButton from './LoadingButton'

const SignUp = () => {
    if (isLoggedIn()) navigate('/app/profile')

    const [stage, setStage] = useState(0)

    return (
        <Wrapper>
            <Container>
                    <Formik
                        initialValues={{
                            username: '',
                            password: '',
                            authCode: '',
                        }}
                        validate={values => {
                            const errors = {}
                            if (stage === 0 && !values.username) {
                                errors.username = 'Required'
                            } 
                            else if (stage === 0 && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.username)) {
                                errors.username = 'Invalid email address'
                            }
                            if (stage === 0 && !values.password) {
                                errors.password = 'Required'
                            }
                            if (stage === 1 && !values.authCode) {
                                errors.authCode = 'Required'
                            }
                            return errors
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            console.log('onSubmit')
                            if (stage === 0) {
                                try {
                                    await Auth.signUp(values.username, values.password)
                                    setStage(1)
                                    console.log('Stage: ', stage)
                                } 
                                catch (err) {
                                    console.log('error signing up...', err)
                                }
                            } 
                            else {
                                try {
                                    await Auth.confirmSignUp(values.username, values.authCode)
                                    alert('Successfully signed up!')
                                    navigate('/app/login')
                                } 
                                catch (err) {
                                    console.log('error confirming signing up...', err)
                                }
                            }
                        }}
                    >
                        {({ isSubmitting }) => {
                            if (stage === 0) {
                                return (
                                    <Form>
                                        <Title>S'enregistrer</Title>
                                        <label
                                            htmlFor="username"
                                            className="block mt-6 text-gray-500 text-base"
                                        >
                                            <p>Email</p>
                                            <Field
                                                type="email"
                                                name="username"
                                                className="block border-gray-300 border-2 rounded text-gray-700 text-sm w-full px-2 py-2"
                                            />
                                            <ErrorMessage
                                                name="username"
                                                component="div"
                                                className="text-red-500 text-sm"
                                            />
                                        </label>
                                        <label
                                            htmlFor="password"
                                            className="block mt-6 text-gray-500 text-base"
                                        >
                                            <p>Password</p>
                                            <Field
                                                type="password"
                                                name="password"
                                                className="block border-gray-300 border-2 rounded text-gray-700 text-sm w-full px-2 py-2"
                                            />
                                            <ErrorMessage
                                                name="password"
                                                component="div"
                                                className="text-red-500 text-sm"
                                            />
                                        </label>
                                        
                                        <LoaderButton type="submit" isLoading={isSubmitting}>
                                            Sign up
                                        </LoaderButton>
                                        <Providers />
                                    </Form>
                                )
                            }
                            else {
                                return (
                                    <Form>
                                        <label
                                            htmlFor="authCode"
                                        >
                                            <p>Authorization Code</p>
                                            <Field
                                                type="text"
                                                name="authCode"
                                            />
                                            <ErrorMessage
                                                name="authCode"
                                                component="div"
                                                className="text-red-500 text-sm"
                                            />
                                        </label>
                                        
                                        <LoaderButton type="submit" isLoading={isSubmitting}>
                                        Confirm Signup
                                        </LoaderButton>
                                    </Form>
                                )
                            }
                        }}
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
        label{
            display: block;
            position: relative;
            .err-msg{
                color: tomato;
            }
        }
        input{
            width: 100%;
            box-sizing: border-box;
            padding: 11px 13px;
            margin-bottom: 0.9rem;
            border-radius: 0;
            outline: 0;
            border: 1px solid ${colors.grey7};
            border-radius: 2px;
            font-size: 14px;
            transition: all 0.3s ease-out;
            :focus{
                border: 1px solid ${colors.yellow};
                box-shadow: 0 0 3px ${colors.yellow}, 0 1px 5px rgba(0, 0, 0, 0.1);
            }
        }
        button{
            max-width: 100%;
            padding: 11px 13px;
            color: black;
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
export default SignUp