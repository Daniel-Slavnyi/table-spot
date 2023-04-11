import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";

export default function handler(req: NextApiRequest, res: NextApiResponse) { 
    
    if (req.method === 'POST') {
        const body = req.body;

        const errors : string[] = []

        const validationSchema = [{
            valid: validator.isLength(body.firstName, {
                min: 1,
                max: 20
            }),
            errorMessage: "First name is invalid"
        },
        {
            valid: validator.isLength(body.lastName, {
                min: 1,
                max: 20
            }),
            errorMessage: "Last name is invalid"
        },
        {
            valid: validator.isEmail(body.email),
            errorMessage: "Email is invalid"
        },
        {
            valid: validator.isMobilePhone(body.phone),
            errorMessage: "Mobile phone is invalid"
        },
        {
            valid: validator.isLength(body.city),
            errorMessage: "City is invalid"
        },
        {
            valid: validator.isStrongPassword(body.password),
            errorMessage: "Password is not strong enough"
        }]

        validationSchema.forEach((cheked) => {
            if (!cheked.valid) {
                errors.push(cheked.errorMessage)
            }
        })

        if (errors.length) {
            return res.status(400).json({errorMessage: errors[0]})
        }
        
        res.status(200).json({
        hello: "body"
    })
    }
    
}