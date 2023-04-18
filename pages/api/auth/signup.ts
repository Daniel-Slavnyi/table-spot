import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import validator from "validator"; // valid gotten data from input
import bcrypt from "bcrypt"; // hash a password
import * as jose from "jose"; // make json token
import { setCookie } from "cookies-next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) { 
    
    if (req.method === 'POST') {
        const {firstName, lastName, email, phone, city, password} = req.body;

        const errors : string[] = []

        const validationSchema = [{
            valid: validator.isLength(firstName, {
                min: 1,
                max: 20
            }),
            errorMessage: "First name is invalid"
        },
        {
            valid: validator.isLength(lastName, {
                min: 1,
                max: 20
            }),
            errorMessage: "Last name is invalid"
        },
        {
            valid: validator.isEmail(email),
            errorMessage: "Email is invalid"
        },
        {
            valid: validator.isMobilePhone(phone),
            errorMessage: "Mobile phone is invalid"
        },
        {
            valid: validator.isLength(city),
            errorMessage: "City is invalid"
        },
        {
            valid: validator.isStrongPassword(password),
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
        
        const userWithEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (userWithEmail) {
             return res.status(400).json({errorMessage: "Email is associated with another account"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await prisma.user.create({
            data: {
                first_name: firstName,
                last_name: lastName,
                email: email,
                city: city,
                password: hashedPassword,
                phone: phone,
            }
        })

        const alg = "HS256"

        const secret = new TextEncoder().encode(process.env.JWT_SECRET)

        const token = await new jose.SignJWT({email: user.email}).setProtectedHeader({alg}).setExpirationTime("24h").sign(secret)

        setCookie('jwt', token, {req, res, maxAge: 60 * 6 * 24})

       return res.status(200).json({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        city: user.city,
    })
    }
    
    return res.status(401).json("Unknown endpoint")
}