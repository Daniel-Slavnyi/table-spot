import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import validator from "validator"; // valid gotten data from input
import bcrypt from "bcrypt"; //hash a password
import * as jose from "jose"; //make json token

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        const errors: string[] = [];

        const validationSchema = [
        {
            valid: validator.isEmail(email),
            errorMessage: "Email is invalid"
        },
        {
            valid: validator.isLength(password, {
                min: 1,
            }),
            errorMessage: "Password is invalid"
        },]

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

        if (!userWithEmail) {
            return res.status(401).json({errorMessage: "Password or email is invalid"})
        }

        const isMatch = await bcrypt.compare(password, userWithEmail.password)

        if (!isMatch) {
            return res.status(401).json({errorMessage: "Password or email is invalid"})
        }
        
        const alg = "HS256"

        const secret = new TextEncoder().encode(process.env.JWT_SECRET)

        const token = await new jose.SignJWT({email: userWithEmail.email}).setProtectedHeader({alg}).setExpirationTime("24h").sign(secret)

        return res.status(200).json({
            token
        })
    }

    return res.status(401).json("Unknown endpoint")
}