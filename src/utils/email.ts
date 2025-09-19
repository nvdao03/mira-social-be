import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import '../configs/env.config'
import fs from 'fs'
import path from 'path'

const sesClient = new SESClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
  }
})

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  subject,
  body,
  replyToAddress = []
}: {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string | string[]
  subject: string
  body: string
  replyToAddress?: string | string[]
}) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddress instanceof Array ? replyToAddress : [replyToAddress]
  })
}

const sendEmail = ({ toAddresses, subject, body }: { toAddresses: string; subject: string; body: string }) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: process.env.AWS_SES_FROM_ADDRESS as string,
    toAddresses,
    subject,
    body
  })

  return sesClient.send(sendEmailCommand)
}

const verifyEmailTemplate = fs.readFileSync(path.resolve('src/templates/verify-email.html'), 'utf-8')
const resetPasswordTemplate = fs.readFileSync(path.resolve('src/templates/verify-forgot-password.html'), 'utf-8')

export const sendVerifyEmail = ({
  toAddresses,
  email_verify_token,
  template = verifyEmailTemplate
}: {
  toAddresses: string
  email_verify_token: string
  template?: string
}) => {
  return sendEmail({
    toAddresses: toAddresses,
    subject: 'Verify your email',
    body: template.replace(
      '{{link}}',
      `${process.env.CLIENT_REDIRECT_URL_VERIFY_EMAIL}/verify-email?email_verify_token=${email_verify_token}`
    )
  })
}

export const sendResetPassword = ({
  toAddresses,
  forgot_password_token,
  template = resetPasswordTemplate
}: {
  toAddresses: string
  forgot_password_token: string
  template?: string
}) => {
  return sendEmail({
    toAddresses: toAddresses,
    subject: 'Reset your password',
    body: template.replace(
      '{{link}}',
      `${process.env.CLIENT_REDIRECT_URL_VERIFY_FORGOT_PASSWORD}/verify-forgot-password?forgot_password_token=${forgot_password_token}`
    )
  })
}
