import { hashPassword } from '../../../lib/auth';
import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {

    if (req.method === 'POST') {

        const data = req.body;

        const { email, password } = data;

        if (
            !email ||
            !email.includes('@') ||
            password.trim().length < 7
        ) {
            res.status(422).json({ message: 'Inavlid input - password should also be at least 7 characters long.' });
            return;
        }

        const client = await clientPromise;

        const db = client.db();

        const existingUSer = await db.collection('user').findOne({ email: email })

        if (existingUSer) {
            res.status(422).json({ message: 'User already exit' });
            client.close();
            return;
        }

        const hashedPassword = await hashPassword(password)

        const result = await db.collection('user').insertOne({
            email: email,
            password: hashedPassword
        });

        res.status(201).json({ message: 'created' })
        client.close();

    }


}

