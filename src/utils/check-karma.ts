import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const { ADJUTOR_SECRET_KEY, ADJUTOR_KARMA_URL } = process.env;

export const checkKarmaList = async (email: string) => {
  const url = `${ADJUTOR_KARMA_URL}/${email}`;
  const headers = {
    Authorization: `Bearer ${ADJUTOR_SECRET_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(
      error.response?.data?.message || 'Error checking Karma list',
    );
  }
};
