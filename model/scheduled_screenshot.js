const Joi = require('joi')
const mongoose = require('mongoose')
const validateCron = require('cron-validator')


const urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i
const deviceRegex = /^[ia]$/i
const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/

const scheduledScreenshotSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return (!v || !v.trim().length || urlRegex.test(v))
            },
            message: "please provide a valid URL"
        },
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return (!v || !v.trim().length || emailRegex.test(v))
            },
            message: "please provide a valid email"
        },
    },
    cron: {
        type: String,
        required: true,
    },
    device: {
        type: String,
        validate: {
            validator: function (v) {
                return (!v || !v.trim().length || deviceRegex.test(v))
            },
            message: "provided string is invalid, allowed values are 'a', 'i', 'A', 'I'"
        }
    },
    running: {
        type: Boolean,
        default: true,
        required: true,
    }
})

const ScheduledScreenshot = mongoose.model('scheduled_screenshot', scheduledScreenshotSchema)



function validate(params) {
    const schema = Joi.object({
        url: Joi.string().regex(urlRegex).required(),
        email: Joi.string().email().required(),
        cron: Joi.string().required(),
        device: Joi.string().min(1).max(1).regex(deviceRegex),
        running: Joi.boolean().default(true),
    })
    const { error } = schema.validate(params)

    if (error) return error

    if (!validateCron.isValidCron(params.cron)) return { 'details': [{ 'message': 'not a valid cron expression' }] } //validate the cron expression.
    //note: made this weird object above inorder to maintain the working of the validate params middleware where this error is going to be returned.

    return
}

module.exports = { ScheduledScreenshot, validate }