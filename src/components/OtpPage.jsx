import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2 } from 'lucide-react'
import Button from '../components/button'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import otpImage from '/4309035.webp' 
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
      const res = await axios.post(
        `https://nahara-production.up.railway.app/api/creator/send-otp?blogName=${values.blogName}`
      )
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
        `https://nahara-production.up.railway.app/api/creator/verify-otp?blogName=${blogName}&otp=${values.otp}`
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
      const res = await axios.post(
        `https://nahara-production.up.railway.app/api/creator/send-otp?blogName=${blogName}`
      )
      setMessage(res.data)
    } catch (error) {
      setMessage(error.response?.data || 'Failed to resend OTP')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 to-black px-4 py-10">
      <div className="flex flex-col md:flex-row items-center bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full">
        <div className="md:w-1/2 p-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              {emailVerified ? '🎉 Blog Verified' : '🔐 Verify Your Blog'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {step === 1
                ? 'Enter your unique blog or creator name to receive a secure OTP.'
                : 'Enter the 6-digit OTP sent to your registered email.'}
            </p>
            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-blue-500 dark:text-blue-300"
              >
                {message}
              </motion.div>
            )}
          </motion.div>
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
                  <Form className="space-y-4 mt-4">
                    <div>
                      <Field
                        name="blogName"
                        placeholder="e.g. SmartMediaUpdate"
                        className="w-full px-4 py-2 border dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 dark:text-white"
                      />
                      <ErrorMessage
                        name="blogName"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                    </Button>
                  </Form>
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
                  <Form className="space-y-4 mt-4">
                    <div>
                      <Field
                        name="otp"
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        className="w-full px-4 py-2 border dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 dark:text-white text-center text-lg tracking-widest"
                      />
                      <ErrorMessage
                        name="otp"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? <Loader2 className="animate-spin" /> : 'Verify OTP'}
                    </Button>
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resendOTP}
                        disabled={cooldown > 0}
                        className="text-sm mt-2"
                      >
                        {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                      </Button>
                    </div>
                  </Form>
                </Formik>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.div
          className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-tr from-blue-800 to-blue-500 p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img
            src={otpImage}
            alt="Verify OTP Illustration"
            className="w-96 h-96 object-contain animate-fadeInUp"
          />
        </motion.div>
      </div>
    </div>
  )
}

export default OtpPage
