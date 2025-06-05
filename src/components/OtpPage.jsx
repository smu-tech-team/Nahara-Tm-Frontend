import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2 } from 'lucide-react'
import Button  from '../components/button'
import axios from 'axios'
import { useNavigate } from 'react-router-dom' 

const BlogNameSchema = Yup.object().shape({
  blogName: Yup.string().required('Creator name or Blog name is required'),
})
const OTPSchema = Yup.object().shape({
  otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
})
const OtpPage = () => {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [emailVerified, setEmailVerified] = useState(false)
  const [blogName, setBlogName] = useState('')
  const [message, setMessage] = useState('')
  
  const navigate = useNavigate()
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])
  useEffect(() => {
    if (emailVerified) {
      const timer = setTimeout(() => {
        navigate('/creator-dashboard')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [emailVerified, navigate])

  const handleSendOtp = async (values) => {
    setIsLoading(true)
    setMessage('')
    try {
        const res = await axios.post(`http://localhost:8087/api/creator/send-otp?blogName=${values.blogName}`)
        setBlogName(values.blogName)
      setStep(2)
      setMessage(res.data)
    } catch (error) {
      setMessage(error.response?.data || 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (values) => {
    setIsLoading(true)
    setMessage('')
    try {
      const res = await axios.post(
        `http://localhost:8087/api/creator/verify-otp?blogName=${blogName}&otp=${values.otp}`
      )
      setEmailVerified(true)
      setMessage(res.data)
    } catch (error) {
      setMessage(error.response?.data || 'Invalid or expired OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const resendOTP = async () => {
    if (cooldown > 0 || !blogName) return
    setCooldown(30)
    setIsLoading(true)
    setMessage('')
    try {
      const res = await axios.post(`http://localhost:8087/api/creator/send-otp?blogName=${blogName}`)
      setMessage(res.data)
    } catch (error) {
      setMessage(error.response?.data || 'Failed to resend OTP')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black px-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {emailVerified ? 'Blog Verified' : 'Verify Blog'}
          </h1>
          {emailVerified && <CheckCircle2 className="text-green-500" />}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Step {step} of 2</p>
        {message && (
          <div className="text-center text-sm text-blue-500 dark:text-blue-300">{message}</div>
        )}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="blog"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Formik
                initialValues={{ blogName: '' }}
                validationSchema={BlogNameSchema}
                onSubmit={handleSendOtp}
              >
                {() => (
                  <Form className="space-y-4">
                    <div>
                      <Field
                        name="blogName"
                        placeholder="Enter your blog name"
                        className="w-full px-4 py-2 border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white"
                      />
                      <ErrorMessage name="blogName" component="div" className="text-red-500 text-sm" />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center items-center"
                    >
                      {isLoading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                    </Button>
                  </Form>
                )}
              </Formik>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Formik
                initialValues={{ otp: '' }}
                validationSchema={OTPSchema}
                onSubmit={handleVerifyOtp}
              >
                {() => (
                  <Form className="space-y-4">
                    <div>
                      <Field
                        name="otp"
                        type="text"
                        placeholder="Enter OTP"
                        maxLength={6}
                        className="w-full px-4 py-2 border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white tracking-widest text-center text-lg"
                      />
                      <ErrorMessage name="otp" component="div" className="text-red-500 text-sm" />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center items-center"
                    >
                      {isLoading ? <Loader2 className="animate-spin" /> : 'Verify OTP'}
                    </Button>
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resendOTP}
                        disabled={cooldown > 0}
                        className="text-sm"
                      >
                        {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default OtpPage
