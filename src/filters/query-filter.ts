import { HttpException, HttpStatus } from '@nestjs/common';
import { LocationCounterFilter } from 'src/location-counter/dto/create-location-counter.dto';
// import { UserFilter } from 'src/users/dto/create-user.dto';

export const buildLocationCounterFilter = async (
  queryParams: LocationCounterFilter,
) => {
  const query = {};
  if (queryParams?.city) query['city'] = queryParams.city.toLowerCase();
  if (queryParams?.role) query['role'] = queryParams.role.toLowerCase();

  if (queryParams?.start_date && queryParams?.end_date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(queryParams?.start_date)) {
      throw new HttpException(
        `use date format yy-mm-dd`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    query['created_at'] = {
      between: [
        new Date(queryParams.start_date),
        new Date(queryParams.end_date),
      ],
    };
  }
  return query;
};

// export const buildUserFilter = async (queryParams: UserFilter) => {
//   const query = {};

//   if (queryParams?.city) query['city'] = queryParams.city.toLowerCase();
//   if (queryParams?.email) query['email'] = queryParams.email.toLowerCase();
//   if (queryParams?.phone) query['phone'] = queryParams.phone;

//   if (queryParams?.start_date && queryParams?.end_date) {
//     const regex = /^\d{4}-\d{2}-\d{2}$/;
//     if (!regex.test(queryParams?.start_date)) {
//       throw new HttpException(
//         `use date format yy-mm-dd`,
//         HttpStatus.NOT_ACCEPTABLE,
//       );
//     }
//     query['created_at'] = {
//       between: [
//         new Date(queryParams.start_date),
//         new Date(queryParams.end_date),
//       ],
//     };
//   }
//   return query;
// };
