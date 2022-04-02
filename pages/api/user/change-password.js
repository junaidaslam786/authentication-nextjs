import { getSession } from 'next-auth/react'
import { hashPassword, verifyPassword } from '../../../lib/auth';
import clientPromise from '../../../lib/mongodb';

async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return;
    }

    const session = await getSession({ req: req })

    if (!session) {
        res.status(401).json({ message: 'Not Authenticated' });
        return;
    }

    const userEmail = session.user.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const client = await clientPromise;

    const usersCollection = client.db().collection('user');

    const user = await usersCollection.findOne({ email: userEmail });

    if (!user) {
        res.status(404).json({ message: 'User Not Found' });
        client.close();
        return;
    }

    const currentPassword = user.password;

    const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

    if (!passwordsAreEqual) {
        res.status(422).json({ message: "Invalid Password." });
        client.close();
        return;
    }

    const hashedPassword = await hashPassword(newPassword);

    const result = await usersCollection.updateOne(
        { email: userEmail },
        { $set: { password: hashedPassword } }
    )

    client.close();
    res.status(200).json({ message: "Password Udated Successfully" });
}

export default handler;