import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
    session: {
        jwt: true,
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials, req) {
                const client = await clientPromise;

                const userCollection = client.db().collection('user');

                const user = await userCollection.findOne({ email: credentials.email })

                if (!user) {
                    client.close();
                    throw new Error('No Users Found');
                }

                const isValid = await verifyPassword(credentials.password, user.password);
                if (!isValid) {
                    client.close();
                    throw new Error('Could not log you in')
                }

                client.close();
                return { email: user.email };
            }
        })
    ]
});